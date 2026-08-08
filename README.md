# FactoryOps AI

> An end-to-end Industrial AI platform for predictive maintenance, machine telemetry, data engineering, ML, and AI-assisted maintenance.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![PyTorch](https://img.shields.io/badge/PyTorch-DeepLearning-red)
![FastAPI](https://img.shields.io/badge/FastAPI-API-green)
![Docker](https://img.shields.io/badge/Docker-Containers-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestration-326CE5)
![AWS](https://img.shields.io/badge/AWS-Cloud-orange)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Apache Airflow](https://img.shields.io/badge/Airflow-Workflow-red)
![Apache Spark](https://img.shields.io/badge/PySpark-BigData-orange)
![LangChain](https://img.shields.io/badge/LangChain-LLM-success)
---

## Overview

FactoryOps AI is a production-inspired Industrial AI platform that simulates the lifecycle of industrial machine data—from telemetry generation and storage to predictive maintenance and AI-assisted investigation.

The platform covers:

* Industrial IoT and machine telemetry
* Data ingestion and processing
* PostgreSQL data storage
* Predictive maintenance
* Machine learning and deep learning
* REST APIs
* MLOps
* Big-data processing
* Retrieval-Augmented Generation (RAG)
* AI agents
* Observability
* Containerized and cloud deployment

## Architecture

```text
                         Industrial Machines
                                │
                                ▼
                       Machine Simulator
                                │
                                ▼
                            Telemetry
                                │
                                ▼
                       Ingestion Pipeline
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
              PostgreSQL             Object Storage
          Operational Data          Raw / Historical Data
                    │                       │
                    │                       ▼
                    │                Data Processing
                    │                       │
                    │                       ▼
                    │               Feature Engineering
                    │                       │
                    │                       ▼
                    │                  ML Training
                    │                       │
                    │                       ▼
                    │                   ML Models
                    │                       │
                    └───────────┬───────────┘
                                ▼
                         Prediction API
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
               AI Copilot             FastAPI API
                    │                       │
              ┌─────┴─────┐                 │
              ▼           ▼                 ▼
             RAG       ML Tools       React Frontend
              │                             │
              └──────────────┬──────────────┘
                             ▼
                   Maintenance Dashboard
```

### Architecture Overview

FactoryOps separates **operational application data** from **large-scale historical and ML data**.

* **PostgreSQL** stores operational data such as machines, machine state, alerts, predictions, and maintenance records.
* **Object Storage** stores raw telemetry, historical datasets, Parquet files, training datasets, and other large artifacts.
* **Data Processing** transforms historical data into datasets suitable for analytics and machine learning.
* **ML Training** produces predictive-maintenance models from engineered features.
* **Prediction API** exposes trained models to the rest of the platform.
* **AI Copilot** combines machine data, prediction services, and RAG to assist with maintenance investigation.
* **Factory Dashboard** provides the user-facing view of machines, predictions, alerts, and maintenance information.

## Features

### Machine Simulation

* Industrial machine simulation
* Synthetic sensor telemetry
* Machine operating states
* Failure scenarios
* Configurable sensor behavior

### Data Platform

* Telemetry ingestion
* PostgreSQL persistence
* Data validation
* Historical datasets
* Feature engineering
* Scheduled data workflows

### Predictive Maintenance

* Failure prediction
* Anomaly detection
* Time-series features
* Model evaluation
* Prediction API

### AI Maintenance Copilot

* Machine history lookup
* Prediction lookup
* Technical-document retrieval
* RAG-based investigation
* AI-assisted maintenance recommendations

### Platform Engineering

* Docker-based development
* Automated testing
* CI/CD
* Service separation
* Observability
* Kubernetes deployment
* Cloud infrastructure

## Technology Stack

| Layer                | Technologies                |
| -------------------- | --------------------------- |
| **Frontend**         | React, TypeScript, Vite     |
| **Backend / API**    | Python, FastAPI, Pydantic   |
| **Database**         | PostgreSQL, pgvector        |
| **Data Engineering** | Pandas, SQL, Apache Airflow |
| **Streaming**        | Apache Kafka                |
| **Big Data**         | Apache Spark, PySpark       |
| **Machine Learning** | Scikit-learn, PyTorch       |
| **MLOps**            | MLflow                      |
| **Generative AI**    | LangChain, LangGraph, RAG   |
| **Containers**       | Docker, Docker Compose      |
| **Orchestration**    | Kubernetes                  |
| **CI/CD**            | GitHub Actions              |
| **Cloud**            | AWS                         |


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
cp .env.example .env
```

Update the environment variables required for local development.

### Start Infrastructure

```bash
docker compose up -d
```

### Run the Application

Use the project commands documented in `Makefile`.

```bash
make help
```

Typical development commands include:

```bash
make dev
make test
make lint
make format
make migrate
make seed
make down
```

> Commands are added as the corresponding components become available.

## Testing

Tests are organized around the system boundaries and core domain behavior.

```bash
make test
```

Testing will cover:

* Unit tests
* API tests
* Database integration tests
* Data validation
* Machine simulation
* Prediction logic
* AI tools
* End-to-end workflows

The primary end-to-end scenario is:

```text
Start Machine
      ↓
Inject Failure
      ↓
Generate Telemetry
      ↓
Process Telemetry
      ↓
Generate Prediction
      ↓
Create Alert
      ↓
Investigate Machine
      ↓
Ask AI Copilot
      ↓
Record Maintenance
```

## Documentation

Detailed project documentation is maintained separately from this README.

* `ROADMAP.md` — implementation phases and milestones
* `docs/ARCHITECTURE.md` — system architecture and design decisions
* `docs/DEVELOPMENT.md` — local development and engineering workflow
* `docs/API.md` — API endpoints and contracts

The README is intentionally kept focused on orientation and getting started.

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
make test
make lint
make format
```

For larger changes, document the architectural impact and update the relevant documentation. -->

## License

This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.
