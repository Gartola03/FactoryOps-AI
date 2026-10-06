# API

## 1. General Information

- **Local Base URL:** `http://localhost:8000`
- **Current Version:** `v1`
- **Prefix:** `/api/v1`
- **Format:** JSON UTF-8
- **Authentication:** HTTP Bearer with JWT HS256
- **OpenAPI:** `/openapi.json`
- **Swagger UI:** `/docs`

The endpoints not documented here (telemetry, prediction, alerts, WebSocket, and copilot) are not implemented in the current runtime, although they are included as roadmap targets.

## 2. HTTP Conventions

| Code | Usage |
|---|---|
| `200` | Successful read or update |
| `201` | Resource created |
| `204` | Successful deletion, no body |
| `400` | Invalid body or action |
| `401` | Missing or invalid authentication |
| `403` | Role does not have the required permission |
| `404` | Resource not found |
| `409` | Uniqueness conflict or invalid transition |
| `422` | Automatic FastAPI/Pydantic validation |

Errors follow the standard FastAPI pattern:

```json
{ "detail": "Machine not found" }
```

## 3. Authentication

### `POST /api/v1/auth/login`

This endpoint does not require a token. It searches for the email address case-insensitively and updates `last_login_at`.

**Request:**

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response `200`:**

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

Incorrect credentials return `401` with:

```text
Invalid email or password
```

For protected calls:

```http
Authorization: Bearer <access_token>
```

### Roles

`operator` can view machines and record maintenance.

`supervisor` additionally has access to machine operations, scenarios, and shift-log review.

`admin` has global access according to the current policy.

Authorization is enforced by the backend, even if the frontend hides unavailable actions.

## 4. Health and Root

### `GET /`

No token required.

Returns:

```json
{
  "name": "FactoryOps AI API",
  "version": "0.1.0",
  "status": "ok"
}
```

### `GET /api/v1/health`

No token required.

```json
{
  "status": "ok"
}
```

This endpoint verifies that the process is responding. It does not currently perform a `SELECT 1` against PostgreSQL.

## 5. Machines

### Simplified Model

```json
{
  "id": 12,
  "machine_code": "PUMP-005",
  "name": "Cooling water pump",
  "machine_type": "Pump",
  "status": "running",
  "factory_id": 1,
  "created_at": "2026-10-06T09:00:00",
  "updated_at": "2026-10-06T09:00:00"
}
```

Supported machine states:

- `created`
- `stopped`
- `running`
- `paused`
- `failed`
- `maintenance`

State transitions are validated on the server.

### `GET /api/v1/machines/`

**Permission:** `view_machines`

Returns `200` with an array of complete machine models, ordered by `id`.

### `POST /api/v1/machines/`

**Permission:** `create_machines`

Returns `201`.

**Request:**

```json
{
  "machine_code": "PUMP-005",
  "name": "Cooling water pump",
  "machine_type": "Pump",
  "factory_id": 1
}
```

`machine_code`, `name`, and `machine_type` are required.

Length limits:

- `machine_code`: 1–50 characters
- `name`: 1–100 characters
- `machine_type`: 1–50 characters

A duplicate machine code returns `409`.

### `PUT /api/v1/machines/{machine_id}`

**Permission:** `update_machines`

Replaces:

- `machine_code`
- `name`
- `machine_type`
- `factory_id`

Returns `200` with the complete machine model.

Possible errors:

- `404` — machine not found
- `409` — duplicate machine code

### `DELETE /api/v1/machines/{machine_id}`

**Permission:** `delete_machines`

Returns `204` with no body, or `404` if the machine does not exist.

### `GET /api/v1/machines/{machine_id}`

**Permission:** `view_machines`

This is a legacy contract. It returns a positional array rather than an object:

```json
[12, "PUMP-005", "Cooling water pump", "Pump", "running"]
```

New integrations should prefer `/detail`.

### `GET /api/v1/machines/{machine_id}/detail`

**Permission:** `view_machines`

Returns:

```json
{
  "machine": {
    "id": 12,
    "machine_code": "PUMP-005",
    "name": "Cooling water pump",
    "machine_type": "Pump",
    "status": "running",
    "factory_id": 1,
    "created_at": "...",
    "updated_at": "..."
  },
  "telemetry": null,
  "maintenance_history": []
}
```

When available, `telemetry` contains the latest row from `machine_telemetry`:

- `temperature`
- `vibration`
- `rpm`
- `failure_probability`
- `alert_severity`
- `scenario`
- `recorded_at`

## 6. Operations and Scenarios

### `PATCH /api/v1/machines/{machine_id}/state`

**Base permission:** `start_machines`

**Request:**

```json
{
  "action": "start"
}
```

Supported actions:

- `start`
- `stop`
- `pause`
- `resume`
- `maintenance`

**Response:**

```json
{
  "machine_id": 12,
  "status": "running",
  "changed_by": 3
}
```

Possible errors:

- `400` — unknown action
- `409` — transition not allowed
- `404` — machine not found

### `POST /api/v1/machines/{machine_id}/scenarios`

**Base permission:** `run_scenarios`

**Request:**

```json
{
  "scenario_name": "Bearing Failure",
  "action": "inject_failure"
}
```

Supported actions:

- `run`
- `inject_failure`
- `reset`

`inject_failure` additionally requires `inject_failures`.

`reset` additionally requires `reset_simulations`.

Returns `200` with:

- `id`
- `machine_id`
- `scenario_name`
- `action`
- `created_at`

The `reset` action returns the machine to the `stopped` state.

## 7. Maintenance and Reports

### `POST /api/v1/machines/{machine_id}/maintenance`

**Permission:** `record_maintenance`

Returns `201`.

**Request:**

```json
{
  "description": "Drive-end bearing inspected and replaced."
}
```

The description is required and cannot be empty.

The response includes:

- `id`
- `machine_id`
- `description`
- `status` (`submitted`)
- `created_at`

### `GET /api/v1/machines/shift-reports`

**Permission:** `review_shift_logs`

Returns maintenance records ordered from newest to oldest:

```json
{
  "id": 9,
  "machine_code": "PUMP-005",
  "description": "Bearing inspected.",
  "status": "submitted",
  "created_at": "...",
  "verified_at": null
}
```

### `PATCH /api/v1/machines/shift-reports/{record_id}/verify`

**Permission:** `review_shift_logs`

Marks the record as `verified` and returns:

- `id`
- `status`
- `verified_at`

If the record does not exist, returns `404`.

## 8. Administration

All endpoints in this section require effective administrator access through `manage_users`, `manage_roles`, or `manage_factory_configuration`.

### Users

#### `GET /api/v1/admin/users`

Lists:

- `id`
- `username`
- `email`
- `role`
- `is_active`
- `last_login_at`
- `created_at`

#### `POST /api/v1/admin/users`

Creates a user with:

- `username`
- `email`
- `password`
- `role`
- `is_active`

Returns `201`.

#### `PUT /api/v1/admin/users/{user_id}`

Replaces the user fields listed above.

`password` is optional.

#### `PATCH /api/v1/admin/users/{user_id}/role`

**Request:**

```json
{
  "role": "operator"
}
```

Accepted roles:

- `admin`
- `supervisor`
- `operator`

Duplicate usernames or email addresses return `409`.

### Roles and Permissions

#### `GET /api/v1/admin/roles`

Returns:

```json
{
  "role": "...",
  "permissions": ["..."]
}
```

#### `PUT /api/v1/admin/roles/{role}/permissions`

**Request:**

```json
{
  "permissions": ["view_machines"]
}
```

The server rejects:

- Unknown roles with `404`
- Unknown permissions with `400`

### Factory Configuration

#### `GET /api/v1/admin/factory`

Returns:

```json
{
  "key": "...",
  "value": "...",
  "updated_at": "..."
}
```

#### `PUT /api/v1/admin/factory/{config_key}`

**Request:**

```json
{
  "value": "..."
}
```

Creates or updates the configuration using an upsert operation.

## 9. Integration Example

```bash
TOKEN=$(curl -s http://localhost:8000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"admin123"}' | jq -r .access_token)

curl -s http://localhost:8000/api/v1/machines/ \
  -H "Authorization: Bearer $TOKEN"
```

## 10. Compatibility and Upcoming Contracts

Consumers should use `/detail` instead of depending on the positional response returned by `GET /machines/{id}`.

Clients should **not** be created for predictions, alerts, live telemetry, or copilot functionality until their routers and schemas are implemented.

When these features are added, they should:

- Preserve the `/api/v1` prefix.
- Document idempotency.
- Document pagination.
- Document timestamps.
- Document request/response correlation.
- Include contract tests.