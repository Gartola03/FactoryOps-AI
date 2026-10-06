# Local Development and Engineering Workflow

## 1. Requirements

- Git
- Python 3.11 or higher (CI tests Python 3.12)
- `uv`
- Node.js and npm
- Docker and Docker Compose
- `psql` to apply the database schema from the host, if the container is not used

The API uses Python/FastAPI, while the frontend uses React/TypeScript/Vite.

PostgreSQL services are started using Docker Compose.

## 2. Prepare the Repository

```bash
git clone <repository-url>
cd FactoryOps-AI
cp services/api/.env.example services/api/.env
```

Review the configuration values before starting the API.

At minimum:

```dotenv
DATABASE_URL=postgresql://factoryops:password@localhost:5432/factoryops
JWT_SECRET=change-this-development-secret-key
JWT_EXPIRATION_MINUTES=60
```

The secrets shown above are exclusively for local development.

## 3. Start PostgreSQL

```bash
make db-up
make db-schema
make db-seed
```

The equivalent shortcut is:

```bash
make db-setup
```

The current Compose configuration exposes PostgreSQL on `localhost:5432` with:

- **Database:** `factoryops`
- **User:** `factoryops`
- **Password:** `password`

`db-reset` removes the PostgreSQL volume and should only be used when you accept losing all local database data.

## 4. Install Dependencies and Run the Application

```bash
make install
make api
```

In another terminal:

```bash
make web
```

The API is available at:

`http://localhost:8000`

FastAPI provides interactive documentation at `/docs` and the OpenAPI schema at `/openapi.json`.

Vite is normally available at:

`http://localhost:5173`

### Useful Direct Commands

Start the API:

```bash
cd services/api && uv run uvicorn app.main:app --reload --port 8000
```

Run API tests:

```bash
cd services/api && uv run pytest
```

Run a focused API test:

```bash
cd services/api
uv run pytest tests/test_api_contracts.py
uv run pytest tests/test_machine_operations.py::test_supervisor_can_create_and_transition_machine
```

The API tests use the local PostgreSQL database. Run `make db-setup` before
executing them, and never point the test configuration at a production
database.

Run API quality checks:

```bash
cd services/api
uv run ruff check .
uv run mypy app
```

Start the frontend:

```bash
cd apps/factoryops-web && npm run dev
```

Run frontend unit tests:

```bash
cd apps/factoryops-web
npm test
```

Run one frontend test file:

```bash
cd apps/factoryops-web
npx vitest run src/auth/permissions.test.ts
npx vitest run src/api/client.test.ts
```

Build the frontend:

```bash
cd apps/factoryops-web && npm run build
```

Run frontend linting:

```bash
cd apps/factoryops-web && npm run lint
```

The simulator can be started with:

```bash
make simulator
```

However, the complete simulation and telemetry integration is still under development.

`make prediction` and `make ai` are roadmap extension points, not services required to start the current MVP.

## 5. Recommended Daily Workflow

1. Create a branch from the current, up-to-date main branch.
2. Reproduce the use case with an API or domain test before changing behavior.
3. Change the router, schema, SQL, and UI as one coherent surface when the feature crosses those boundaries.
4. Run formatting, linting, and focused tests.
5. Run the web build if the change affects `apps/factoryops-web`.
6. Review the diff and make sure no secrets, caches, or generated artifacts have been included.

## 6. Validation

### API checks

From the API directory:

```bash
cd services/api
uv run pytest
uv run ruff check .
uv run black --check .
```

For type-related changes:

```bash
cd services/api
uv run mypy app
```

### Frontend checks

```bash
cd apps/factoryops-web
npm test
npm run lint
npm run build
```

`npm test` runs Vitest in non-watch mode. `npm run build` also runs the
TypeScript project build before producing the Vite bundle.

The CI configuration in `.github/workflows/ci.yml`:

1. Starts PostgreSQL 16.
2. Installs the API using `uv`.
3. Applies `schema.sql`.
4. Runs pytest.
5. Runs Ruff.

Integration tests require an initialized database and must not be run against a production database.

## 7. Adding an Endpoint

When adding a new API endpoint:

1. Define the router under `services/api/app/api/v1/`.
2. Add Pydantic models for input and, preferably, for the response.
3. Register the router in `app/api/v1/__init__.py`.
4. Apply `get_current_user` and/or `require_permission` according to the required capability.
5. Use parameterized SQL queries and explicitly translate `404`, `409`, and validation errors.
6. Add tests covering authentication, authorization, successful execution, and missing data.
7. Update `docs/API.md` and the OpenAPI documentation if the contract changes.

## 8. Database

The current schema is designed to be as idempotent as possible through `IF NOT EXISTS` and is applied with:

```bash
make db-schema
```

For real evolutionary database migrations, introduce a migration tool before modifying shared tables.

Do not rely on manually editing a local database.

### Database Inspection

Open a PostgreSQL shell:

```bash
make db-shell
```

View database logs:

```bash
make db-logs
```

Check database status:

```bash
make db-check
```

## 9. Quick Troubleshooting

### `401 Unauthorized`

Possible causes:

- Missing Bearer authorization header.
- Invalid token.
- Expired token.
- Missing JWT claims.

### `403 Forbidden`

The authenticated user's role does not have the required permission.

### `404 Not Found`

The requested resource does not exist.

### `409 Conflict`

Possible causes:

- Uniqueness conflict.
- Invalid machine state transition.

### Database Connection Error

Check:

```bash
docker compose ps
```

Also verify:

- `DATABASE_URL`
- PostgreSQL container status
- `make db-up`

### Frontend Shows No Data

Verify that:

1. The API responds successfully at `/api/v1/health`.
2. The browser is using an origin allowed by the configured CORS policy.
3. The API is running on the expected port.

## 10. Conventions

- API endpoints and JSON fields use `snake_case`.
- Python code is formatted with Black and validated with Ruff.
- Error responses use `{ "detail": "..." }`, following the FastAPI convention.
- Contract changes require both tests and documentation in the same change.
- Components that only exist in `ROADMAP.md` must not be documented as currently available.