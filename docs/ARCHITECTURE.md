# Architecture and Design Decisions

> **Documentation status:** October 2026. This document describes the code currently present in the repository. Components marked as future work are not part of the current runtime.

## 1. Purpose and Scope

FactoryOps AI is an industrial operations platform focused on machine monitoring and maintenance workflows.

The currently available vertical slice covers:

- React web application for dashboard, machines, machine details, maintenance, and administration;
- Versioned REST API built with FastAPI;
- JWT Bearer authentication and role-based access control;
- Operational persistence in PostgreSQL;
- Machine CRUD operations, state transitions, scenarios, maintenance records, and shift reports;
- Reproducible local development environment using Docker Compose, `uv`, and a CI pipeline.

Historical telemetry, the prediction service, Kafka, Airflow, RAG, agents, advanced observability, Kubernetes, and AWS are included in the roadmap, but they are not currently dependencies or implemented endpoints of the MVP.

## 2. Current Logical Architecture

```text
+--------------------------------+
| React + TypeScript + Vite      |
| apps/factoryops-web            |
+---------------+----------------+
                |
                | HTTP/JSON, JWT Bearer
                v
+--------------------------------+
| FastAPI                        |
| services/api                   |
| /api/v1                        |
+---------------+----------------+
                |
                | psycopg
                v
+--------------------------------+
| PostgreSQL 16                  |
| users, roles,                  |
| machines and maintenance       |
+--------------------------------+
```

A simulation process exists as a separate service in `services/machine-simulator`, but the simulation loop and complete telemetry persistence are still roadmap work.

The prediction service and AI copilot have reserved commands in the `Makefile`, but do not have an operational implementation equivalent to the current API.

## 3. Components and Responsibilities

### Frontend

`apps/factoryops-web` is a Vite SPA.

It maintains the session and user role in the browser, filters navigation and visible actions based on permissions, and consumes the API through a shared HTTP client.

UI visibility does not replace backend authorization.

### API

`services/api/app/main.py` creates the FastAPI application, configures CORS for the local frontend ports, and includes the versioned `/api/v1` router.

Routers are separated by context:

- `auth`: login and token issuance;
- `health`: health check;
- `machines`: machines, states, scenarios, maintenance, and reports;
- `admin`: users, roles/permissions, and factory configuration.

The PostgreSQL connection is centralized in `app.db.connection.get_connection`.

SQL operations use parameters, and transactions are committed when the connection context exits successfully.

### Persistence

The schema in `services/api/app/sql/schema.sql` separates:

- **Identity:** `Users`, `Roles`, `Permissions`, `RolePermissions`;
- **Assets:** `machines`;
- **Signals and operations:** `machine_telemetry`, `simulation_scenarios`;
- **Maintenance:** `maintenance_records`;
- **Configuration:** `factory_configuration`.

PostgreSQL is the system of record for operational data.

Large historical datasets and data archives have not yet been moved to object storage.

## 4. Request Flow

1. The frontend sends JSON and, except for `/`, `/api/v1/health`, and `/api/v1/auth/login`, an `Authorization: Bearer <JWT>` header.
2. `get_current_user` validates the HS256 signature, expiration, and the `sub`, `email`, and `role` claims.
3. `require_permission(...)` checks the requested permission against the user's role.
4. The router validates the request body using Pydantic.
5. The handler executes parameterized SQL and returns JSON with the appropriate HTTP status code.
6. The interface updates its state and displays the error returned by the API when applicable.

## 5. Security and Authorization

The built-in roles are:

- `operator`
- `supervisor`
- `admin`

The effective runtime policy is defined in `app.core.security.ROLE_PERMISSIONS`.

### Operator

`operator` has access to machine read operations and maintenance/investigation capabilities.

### Supervisor

`supervisor` has all operator capabilities, plus:

- Machine CRUD;
- State transitions;
- Scenarios;
- Shift-report review.

### Admin

`admin` currently has a wildcard (`*`) permission in the policy.

Passwords are stored using `pwdlib` with Argon2.

`password_hash` is never returned by the API.

The JWT contains:

- `sub`
- `email`
- `role`
- `exp`

The default token lifetime is 60 minutes and is configured using `JWT_EXPIRATION_MINUTES`.

For production deployments:

- Development secrets must be replaced.
- CORS should be restricted to known origins.
- PostgreSQL credentials embedded in Compose configuration should be avoided.

## 6. Design Decisions and Trade-offs

### Versioned REST API from the Start

The `/api/v1` prefix allows contracts to evolve without breaking the existing frontend.

Domain-specific routers keep handlers small and make boundary testing easier.

### PostgreSQL Before Streaming

The MVP prioritizes transactional consistency and operational traceability.

Kafka and event processing will be introduced when there is a real use case for decoupling and sufficient volume.

The architecture does not simulate a distributed system without real consumers.

### Machine as a State Machine

Valid state transitions are declared in `STATE_TRANSITIONS`.

The client cannot submit an arbitrary machine state.

An invalid transition returns:

```text
409 Conflict
```

This keeps state-management rules centralized in the backend.

### Explicit Roles and Permissions

Permissions represent capabilities rather than screen names.

This allows the frontend to hide unavailable actions without turning the frontend into a security boundary.

## 7. Known Limitations

- There is currently no API for telemetry ingestion, predictions, or alerts.
- There is no WebSocket or real-time streaming functionality.
- The individual machine `GET` endpoint still uses a legacy positional response; `/detail` is the recommended contract.
- Default configuration contains development values. These should be overridden through `.env`.
- The evolution toward Kafka, MLflow, RAG, Kubernetes, and AWS is specified in `ROADMAP.md`, but their availability should not be assumed simply because these names appear in the README.

## 8. Planned Evolution

The following sequence preserves the current design:

1. Complete the machine simulator and telemetry functionality.
2. Add prediction and alert capabilities.
3. Introduce events once defined consumers exist.
4. Build data engineering capabilities.
5. Add MLOps infrastructure.
6. Introduce advanced AI capabilities.

Each stage should provide clear contracts and tests before additional infrastructure is introduced.