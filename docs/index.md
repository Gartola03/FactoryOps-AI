# Home

Welcome to the **FactoryOps AI** documentation.

FactoryOps AI is a platform designed to support industrial operations with AI-powered tools for monitoring, analysis, and decision-making.

## Documentation

Use the navigation menu to explore the project:

<!-- - **Getting Started** — Set up the project locally and run the different services.
-->
- **Architecture** — Understand the structure and main components of the system.
- **API** — Documentation for the backend API and available endpoints.
- **Development** — Development guidelines, workflows, and useful commands.

## Project Structure

```text
FactoryOps-AI/
├── docs/              # Project documentation
├── services/
│   └── api/           # FastAPI backend
├── Makefile           # Development commands
└── ...
```

## Quick Start

Clone the repository and install the project dependencies:

```bash
git clone <repository-url>
cd FactoryOps-AI
```

Start the API:

```bash
make api
```

Start the documentation:

```bash
make mkdocs
```

The API will be available at:

```text
http://127.0.0.1:8000
```

The documentation will be available at:

```text
http://127.0.0.1:8001
```

## Status

This project is currently under active development. Documentation will evolve together with the platform.