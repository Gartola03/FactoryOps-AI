# FactoryOps AI

> An end-to-end Industrial AI platform for predictive maintenance, machine telemetry, data engineering, ML, and AI-assisted maintenance.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-API-green)
![Docker](https://img.shields.io/badge/Docker-Containers-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Frontend](https://img.shields.io/badge/React%20%7C%20TypeScript%20%7C%20Vite-Frontend-646CFF)
---

## Overview

FactoryOps AI is a production-inspired industrial operations platform. The current
vertical slice focuses on machine management, role-based access, maintenance
workflows, and a React dashboard backed by a versioned FastAPI API.

The repository is intentionally evolving in milestones. The current runtime
includes the foundation and core machine-management workflow; streaming,
predictive-maintenance models, RAG, AI agents, Kubernetes, and AWS deployment
remain roadmap work until their implementation and tests are present.

### Current implementation

* React, TypeScript, and Vite web application
* FastAPI REST API under `/api/v1`
* PostgreSQL 16 persistence
* JWT Bearer authentication with Argon2 password hashing
* Operator, supervisor, and administrator roles
* Machine CRUD and validated machine-state transitions
* Scenario records, maintenance records, shift reports, and factory configuration
* Docker Compose local database
* API tests, Ruff linting, and GitHub Actions CI

## Architecture

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

### Architecture Overview

The current system separates the web client, API, and operational database:

* **React frontend** provides the dashboard, machine views, maintenance workflow,
  and administration screens.
* **FastAPI API** validates requests, authenticates users, enforces permissions,
  and exposes the `/api/v1` contracts.
* **PostgreSQL** is the system of record for users, roles, machines, scenarios,
  maintenance records, and factory configuration.

The machine simulator exists as a separate project area, but the complete
simulation loop and telemetry integration are not yet part of the current API.
Historical object storage, prediction services, Kafka, Airflow, RAG, and agents
are planned extensions rather than available runtime dependencies.

## Features

### Machine and maintenance operations

* Machine directory and detail views
* Machine creation, update, and deletion
* Validated start, stop, pause, resume, and maintenance transitions
* Scenario recording, including failure injection and reset actions
* Maintenance records and supervisor verification of shift reports

### Identity and administration

* JWT login endpoint
* Argon2 password hashing
* Role-based permissions enforced by the API
* User and role administration
* Factory configuration management

### Engineering foundation

* Docker Compose PostgreSQL environment
* API and integration tests
* Ruff, Black, mypy configuration, and GitHub Actions CI
* Separate documentation for architecture, development, and API contracts

Telemetry ingestion, prediction, alerting, AI Copilot, RAG, and agent workflows
are documented as future capabilities in [`ROADMAP.md`](ROADMAP.md), not as
completed features.

## Technology Stack

| Layer                | Technologies                |
| -------------------- | --------------------------- |
| **Database**         | PostgreSQL 16              |
| **API**              | FastAPI, Pydantic, PyJWT   |
| **Authentication**   | JWT, Argon2 via `pwdlib`   |
| **Frontend**         | React, TypeScript, Vite    |
| **Local infrastructure** | Docker, Docker Compose |
| **Testing and quality** | Pytest, Ruff, Black, mypy |
| **CI/CD**            | GitHub Actions              |

Planned technologies such as Kafka, Spark, PyTorch, MLflow, LangChain,
Kubernetes, and AWS will be added when the corresponding roadmap milestone is
implemented.


## Getting Started

### Prerequisites

Install:

* Git
* Python 3.11+
* Docker
* Docker Compose
* PostgreSQL
* Node.js and npm/pnpm for the web application

### Clone

```bash
git clone <repository-url>
cd factoryops-ai
```

### Configure Environment

```bash
cp services/api/.env.example services/api/.env
```

Update the environment variables required for local development.

### Start Infrastructure

```bash
make db-setup
```

### Run the Application

Use the project commands documented in `Makefile`.

```bash
make help
```

Typical development commands include:

```bash
make install
make api
make web
make down
```

See [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) for prerequisites, database
setup, service-specific test and quality commands, troubleshooting, and the CI
workflow.

## Testing

Tests are organized around the system boundaries and core domain behavior.
Run the API and frontend suites separately because they use different tools and
runtime dependencies.

### API tests

Start and initialize PostgreSQL first:

```bash
make db-setup
```

Run all API tests:

```bash
cd services/api
uv run pytest
```

Run one API test file or one test:

```bash
cd services/api
uv run pytest tests/test_api_contracts.py
uv run pytest tests/test_machine_operations.py::test_supervisor_can_create_and_transition_machine
```

Validate API quality checks:

```bash
cd services/api
uv run ruff check .
uv run mypy app
```

The API suite currently covers:

* Health and authentication behavior
* Machine reads and machine CRUD
* Role and permission enforcement
* State transitions
* Scenarios and maintenance records
* Administrative user management

### Frontend tests

Install frontend dependencies and run the Vitest suite:

```bash
cd apps/factoryops-web
npm install
npm test
```

Run a focused frontend test file:

```bash
cd apps/factoryops-web
npx vitest run src/auth/permissions.test.ts
npx vitest run src/api/client.test.ts
```

Validate the frontend with linting and a production build:

```bash
cd apps/factoryops-web
npm run lint
npm run build
```

The frontend suite currently covers:

* Role normalization and permission checks.
* Route access for operators and administrators.
* Login request serialization.
* Bearer-token propagation.
* API error handling in the client.
* Maintenance request serialization.

Simulation, prediction, alerting, and AI-tool tests will be added with their
corresponding implementations.

The primary end-to-end scenario is:

```text
Login
  ↓
List or create machine
  ↓
Transition machine state
  ↓
Run scenario
  ↓
Record maintenance
  ↓
Review and verify shift report
```

## Documentation

Detailed project documentation is maintained separately from this README.

- `ROADMAP.md` — implementation phases and milestones
- `docs/ARCHITECTURE.md` — system architecture and design decisions
- `docs/DEVELOPMENT.md` — local development and engineering workflow
- `docs/API.md` — API endpoints and contracts

### Project Documentation

Run the MkDocs documentation server with:

```bash
make mkdocs
```

The documentation will be available at:

[http://127.0.0.1:8001/](http://127.0.0.1:8001/)

The `make mkdocs` target runs:

```bash
uv run mkdocs serve --dev-addr=127.0.0.1:8001
```

## AI-Assisted Development

AI, mainly **Microsoft GitHub Copilot through the Copilot Student program**, was used to speed up the development and documentation of this project.

It was used for code assistance, debugging, and preparing technical documentation. The **architecture, technical decisions, implementation, and final result remained under human control**.

AI-generated content was reviewed and adapted before being included in the project.

## Roadmap

FactoryOps AI is developed incrementally.

```text
M0  Foundation
 ↓
M1  Complete MVP
 ↓
M2  Event Streaming
 ↓
M3  Data Engineering
 ↓
M4  Advanced ML
 ↓
M5  MLOps
 ↓
M6  RAG + AI Agents
 ↓
M7  Observability
 ↓
M8  Kubernetes
 ↓
M9  AWS
```

See [`ROADMAP.md`](ROADMAP.md) for the implementation plan, milestones, architectural changes, and definitions of done.

## Project Principles

### Build the workflow before the infrastructure

The project prioritizes a working end-to-end product before introducing distributed infrastructure.

### Introduce technology for a reason

Kafka, Spark, Kubernetes, AWS, and other technologies are introduced when they solve an actual engineering requirement.

### Keep services independently understandable

Each service should have a clear responsibility and a well-defined interface.

### Make data reproducible

Data generation, processing, feature engineering, and model training should be reproducible whenever possible.

### Treat documentation as part of the system

Architecture, development procedures, APIs, and important design decisions should be documented alongside the implementation.

<!-- ## Contributing

Contributions are welcome.

Before submitting a change:

```bash
cd services/api && uv run pytest
cd services/api && uv run ruff check .
cd apps/factoryops-web && npm test
cd apps/factoryops-web && npm run lint
cd apps/factoryops-web && npm run build
```

For larger changes, document the architectural impact and update the relevant documentation. -->

## License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.
