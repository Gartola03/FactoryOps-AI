# FactoryOps AI — Roadmap

> **The implementation roadmap for evolving FactoryOps AI from a focused industrial AI vertical slice into a production-inspired, event-driven, ML-powered, observable, cloud-deployed platform.**

FactoryOps AI is intentionally developed in stages.

The goal is to build a complete industrial workflow first, then introduce architectural complexity only when it solves a real engineering problem.

---

# Roadmap Philosophy

The core workflow is:

```text
Developer
    ↓
Machine Simulator
    ↓
Failure Injection
    ↓
Telemetry Degradation
    ↓
Prediction
    ↓
Alert
    ↓
Technician Investigation
    ↓
AI Copilot
    ↓
Maintenance Action
```

Once that workflow works end-to-end, the platform evolves through increasingly sophisticated layers:

```text
Complete MVP
    ↓
Event Streaming
    ↓
Data Engineering
    ↓
Advanced ML
    ↓
MLOps
    ↓
RAG + AI Agents
    ↓
Observability
    ↓
Kubernetes
    ↓
AWS
```

Each phase has:

- A concrete engineering objective
- A set of implementation tasks
- A target architecture
- A definition of done
- A demonstrable milestone

---

# Repository Structure Evolution


## Initial Repository

```text
factoryops-ai/
│
├── README.md
├── ROADMAP.md
├── LICENSE
├── .gitignore
├── .env.example
├── docker-compose.yml
├── Makefile
│
├── apps/
│   └── factoryops-web/
│
├── services/
│   ├── api/
│   ├── machine-simulator/
│   ├── prediction-service/
│   └── ai-copilot/
│
├── shared/
├── data/
├── tests/
├── docs/
│
└── .github/
    └── workflows/
```

This is the repository structure for the first major milestone.

---

## Repository After Data Engineering

When Kafka, Airflow, object storage, and larger ML workflows become real requirements, additional directories can be introduced:

```text
factoryops-ai/
│
├── apps/
├── services/
│
├── shared/
│
├── data/
│
├── ml/
│   ├── notebooks/
│   ├── datasets/
│   ├── features/
│   ├── training/
│   ├── evaluation/
│   └── models/
│
├── pipelines/
│   ├── ingestion/
│   ├── transformation/
│   ├── feature-engineering/
│   └── training/
│
├── infrastructure/
│   ├── docker/
│   ├── postgres/
│   ├── kafka/
│   ├── airflow/
│   └── monitoring/
│
├── tests/
├── docs/
└── .github/
```

---

## Repository at the Cloud / Kubernetes Stage

Only after the distributed architecture exists should infrastructure become more extensive:

```text
factoryops-ai/
│
├── apps/
├── services/
├── shared/
├── data/
├── ml/
├── pipelines/
│
├── infrastructure/
│   ├── docker/
│   ├── postgres/
│   ├── kafka/
│   ├── airflow/
│   ├── monitoring/
│   ├── kubernetes/
│   └── aws/
│
├── tests/
├── docs/
├── scripts/
│
├── docker-compose.yml
├── Makefile
├── LICENSE
├── README.md
├── ROADMAP.md
│
└── .github/
    └── workflows/
```

The repository therefore reflects the actual maturity of the system instead of pretending that every future component already exists.

---

# Milestone Overview

| Milestone | Phase | Main Result |
|---|---|---|
| **M0** | Foundation | Local application boots |
| **M1** | Complete MVP | Full machine-failure vertical slice works |
| **M2** | Event Streaming | Telemetry flows through Kafka |
| **M3** | Data Engineering | Historical data becomes reproducible datasets |
| **M4** | Advanced ML | Real predictive-maintenance model deployed |
| **M5** | MLOps | Models are tracked and versioned |
| **M6** | RAG + Agents | Copilot uses tools and technical knowledge |
| **M7** | Observability | Distributed system is measurable and traceable |
| **M8** | Kubernetes | Services run as independently deployable workloads |
| **M9** | AWS | Cloud deployment is automated and production-inspired |

---

# Phase 0 — Foundation

## Objective

Create the basic FactoryOps application and development environment.

The system should be able to run locally before any sophisticated industrial or AI functionality is added.

## Tasks

### Repository

```text
[X] Create repository
[X] Add README.md
[X] Add ROADMAP.md
[X] Add LICENSE
[X] Add .gitignore
[X] Add .env.example
[X] Add Makefile
```

### Backend

```text
[X] Create FastAPI application
[X] Configure project structure
[X] Add Pydantic configuration
[X] Add health endpoint
[X] Add API versioning
[X] Add error handling
```

### Frontend

```text
[X] Create React application
[X] Configure CSS
[X] Configure TypeScript
[X] Create application shell
[X] Create navigation
[X] Create basic dashboard
[X] Create API client
[X] Connect frontend to API health endpoint
```

### Database

```text
[X] Add PostgreSQL
[X] Configure migrations
[X] Create initial database connection
[X] Add development seed strategy
```

### Development

```text
[X] Docker Compose
[X] Local environment configuration
[X] Basic CI workflow
[X] Basic unit-test configuration
```

## Target Architecture

```text
React
  │
  │ REST
  ▼
FastAPI
  │
  ▼
PostgreSQL
```

## Definition of Done

The application can be started locally and:

```text
Frontend
    ↓
Backend
    ↓
Database
```

communicate successfully.

---

# Phase 1 — Complete Vertical-Slice MVP

## Objective

Build the first complete FactoryOps experience.

This is the most important phase of the project.

The system should demonstrate the complete industrial workflow before Kafka, Spark, Kubernetes, or AWS are introduced.

---

## 1. Authentication

```text
[ ] User model
[ ] Login
[ ] Password hashing
[ ] Session / token authentication
[ ] Authentication middleware
```

---

## 2. Role-Based Access Control

Initial roles:

```text
ADMIN
DEVELOPER
TECHNICIAN
```

Permissions should reflect the actual workflows.

### Developer

```text
[ ] View machines
[ ] Create machines
[ ] Start machines
[ ] Stop machines
[ ] Pause machines
[ ] Resume machines
[ ] Run scenarios
[ ] Inject failures
[ ] Reset simulations
```

### Technician

```text
[ ] View machines
[ ] View telemetry
[ ] View alerts
[ ] View predictions
[ ] View maintenance history
[ ] Investigate machines
[ ] Use AI Copilot
[ ] Record maintenance
```

### Administrator

```text
[ ] Manage users
[ ] Manage roles
[ ] Manage factory configuration
[ ] Access developer functionality
[ ] Access technician functionality
```

---

# Phase 1.1 — Machine Domain

Create the central machine domain.

## Machine

Example:

```text
PUMP-005
```

Fields should include concepts such as:

```text
id
machine_code
name
type
status
factory_id
created_at
updated_at
```

## Machine States

```text
CREATED
    ↓
STOPPED
    ↓
RUNNING
    ├── PAUSED
    ├── FAILED
    └── MAINTENANCE
```

Tasks:

```text
[ ] Machine model
[ ] Machine CRUD
[ ] Machine state machine
[ ] State transition validation
[ ] Machine API
[ ] Machine UI
```

---

# Phase 1.2 — Machine Simulator

Implement the industrial simulation engine.

## Initial Signals

```text
Temperature
Vibration
RPM
Machine State
Failure State
Scenario
```

Tasks:

```text
[ ] Simulation loop
[ ] Sampling interval
[ ] Healthy baseline
[ ] Gaussian / realistic noise
[ ] Sensor generation
[ ] Machine operating state
[ ] Simulation clock
[ ] Start / stop control
[ ] Pause / resume
```

---

# Phase 1.3 — Failure Scenarios

Initial scenario:

```text
Bearing Failure
```

The failure must create a degradation trajectory rather than instantly failing the machine.

Example:

```text
Healthy
   ↓
Vibration begins increasing
   ↓
Temperature begins increasing
   ↓
RPM begins degrading
   ↓
Warning
   ↓
Critical
   ↓
Failure
```

Tasks:

```text
[ ] Scenario model
[ ] Bearing failure scenario
[ ] Scenario activation
[ ] Scenario reset
[ ] Scenario state
[ ] Telemetry degradation curves
```

Future scenarios:

```text
[ ] Motor Overheating
[ ] Lubrication Failure
[ ] Misalignment
[ ] Pump Cavitation
[ ] Sensor Fault
[ ] Excessive Vibration
[ ] Unexpected RPM Drop
```

---

# Phase 1.4 — Real-Time Telemetry

Use WebSockets for live machine data.

Tasks:

```text
[ ] Telemetry model
[ ] Telemetry persistence
[ ] WebSocket connection
[ ] Telemetry subscriptions
[ ] Live telemetry updates
[ ] Machine state events
[ ] Simulation events
```

Target flow:

```text
Simulator
    ↓
Telemetry
    ↓
FastAPI
    ↓
WebSocket
    ↓
React Dashboard
```

---

# Phase 1.5 — Prediction Service

Start with a deterministic or lightweight prediction model.

The important requirement is not model complexity.

The important requirement is:

> The prediction must react meaningfully to machine degradation.

Tasks:

```text
[ ] Prediction input schema
[ ] Baseline prediction logic
[ ] Failure probability
[ ] Prediction history
[ ] Prediction API
[ ] Prediction display
```

Example:

```text
Healthy
  → 5–18%

Warning
  → 31–54%

Critical
  → 91%
```

---

# Phase 1.6 — Alerting

Create a real alert workflow.

Tasks:

```text
[ ] Alert model
[ ] Threshold rules
[ ] Prediction-based alerts
[ ] Alert severity
[ ] Alert lifecycle
[ ] Alert API
[ ] Alert UI
```

Example:

```text
🚨 CRITICAL

PUMP-005

Bearing failure probability: 91%
```

---

# Phase 1.7 — Technician Dashboard

The technician should see the factory from a decision-making perspective.

Tasks:

```text
[ ] Factory overview
[ ] Machine health status
[ ] Critical machines
[ ] Alerts
[ ] Prediction cards
[ ] Telemetry charts
[ ] Machine details
[ ] Maintenance history
```

The interface should prioritize:

```text
What is wrong?
How serious is it?
Why is it happening?
What should I investigate?
```

---

# Phase 1.8 — Maintenance Records

Create the feedback loop.

Tasks:

```text
[ ] Maintenance record model
[ ] Maintenance API
[ ] Maintenance UI
[ ] Technician actions
[ ] Machine maintenance history
```

Example:

```text
Inspection performed.

Drive-end bearing requires replacement.
```

This record becomes part of the machine's historical context.

---

# Phase 1.9 — Basic AI Copilot

The initial Copilot should remain simple.

Input:

```text
Machine State
+
Current Telemetry
+
Prediction
+
Maintenance History
```

Tasks:

```text
[ ] LLM integration
[ ] Machine context builder
[ ] Maintenance prompt
[ ] Copilot endpoint
[ ] Chat UI
[ ] Basic error handling
```

Example:

> Why is PUMP-005 at high risk?

The Copilot should explain which signals and prediction factors are contributing to the risk.

---

# Phase 1 — Final Vertical Slice

The MVP must support:

```text
Login
  ↓
Developer opens simulator
  ↓
PUMP-005 starts
  ↓
Bearing Failure injected
  ↓
Telemetry degrades
  ↓
Prediction increases
  ↓
Critical alert generated
  ↓
Technician opens PUMP-005
  ↓
Technician sees telemetry and prediction
  ↓
Technician asks AI Copilot
  ↓
AI explains the degradation
  ↓
Technician records maintenance
```

## Definition of Done

> **A complete machine failure can be simulated, detected, investigated, explained, and recorded through one FactoryOps application.**

This is **Milestone M1**.

---

# Phase 2 — Event Streaming

## Objective

Introduce event-driven architecture when the MVP has a clear need to decouple telemetry production from consumers.

Initial architecture:

```text
Simulator
    ↓
FastAPI
    ↓
PostgreSQL
```

Target architecture:

```text
Simulator
    ↓
Kafka
    ├── Prediction Consumer
    ├── Persistence Consumer
    ├── Alert Consumer
    └── Analytics Consumer
```

---

## Kafka

Tasks:

```text
[ ] Kafka
[ ] Kafka development environment
[ ] Producer abstraction
[ ] Consumer abstraction
[ ] Topic configuration
```

Initial topics:

```text
telemetry.machine
machine.events
machine.alerts
simulation.events
```

---

## Event Contracts

Define stable event schemas.

Example concepts:

```text
TelemetryEvent
MachineStateEvent
ScenarioEvent
PredictionEvent
AlertEvent
MaintenanceEvent
```

Tasks:

```text
[ ] Event schemas
[ ] Event versioning strategy
[ ] Event metadata
[ ] Event timestamps
[ ] Correlation IDs
```

---

## Consumers

```text
[ ] Telemetry persistence consumer
[ ] Prediction consumer
[ ] Alert consumer
[ ] Event audit consumer
```

## Definition of Done

> Telemetry and machine events can move through Kafka while the existing FactoryOps workflow continues to work.

This is **Milestone M2**.

---

# Phase 3 — Data Engineering

## Objective

Turn operational telemetry into a reproducible historical data platform.

Architecture:

```text
Kafka
   ↓
Raw Telemetry
   ↓
Object Storage
   ↓
Validation
   ↓
Transformation
   ↓
Feature Engineering
   ↓
Training Dataset
```

---

# Object Storage

Introduce MinIO locally and S3-compatible storage concepts.

Tasks:

```text
[ ] MinIO
[ ] Raw telemetry bucket
[ ] Processed data bucket
[ ] Dataset bucket
[ ] Partitioning strategy
[ ] Retention strategy
```

---

# Airflow

Introduce workflow orchestration.

Tasks:

```text
[ ] Airflow
[ ] DAG structure
[ ] Ingestion workflow
[ ] Validation workflow
[ ] Transformation workflow
[ ] Feature-generation workflow
[ ] Dataset-generation workflow
```

---

# Data Quality

Tasks:

```text
[ ] Schema validation
[ ] Missing-value checks
[ ] Timestamp validation
[ ] Range validation
[ ] Duplicate detection
[ ] Sensor anomaly checks
```

---

# Feature Engineering

Potential features:

```text
Rolling mean
Rolling standard deviation
Rate of change
Temperature trend
Vibration trend
RPM deviation
Signal ratios
Time since maintenance
```

Tasks:

```text
[ ] Feature definitions
[ ] Feature generation
[ ] Feature datasets
[ ] Feature validation
```

## Definition of Done

> Historical machine telemetry can automatically be transformed into a reproducible dataset suitable for ML training.

This is **Milestone M3**.

---

# Phase 4 — Advanced Predictive Maintenance

## Objective

Replace the MVP prediction logic with trained time-series models.

Start with strong baselines before deep learning.

---

## Model Progression

```text
Deterministic Baseline
        ↓
Scikit-Learn
        ↓
Time-Series Features
        ↓
LSTM / GRU
        ↓
1D CNN
        ↓
Autoencoder
```

Do not assume that the most complex model is automatically the best model.

---

# Training Pipeline

```text
Historical Telemetry
        ↓
Feature Engineering
        ↓
Train / Validation / Test
        ↓
Model Training
        ↓
Evaluation
        ↓
Model Selection
        ↓
Inference
```

Tasks:

```text
[ ] Dataset versioning
[ ] Baseline model
[ ] Evaluation metrics
[ ] Training pipeline
[ ] Time-series model
[ ] Anomaly detection experiment
[ ] Model comparison
```

---

# Prediction API

The prediction service should eventually provide:

```text
Machine ID
Timestamp
Failure Probability
Model Version
Prediction Confidence
Relevant Signals
```

Tasks:

```text
[ ] Model loading
[ ] Inference endpoint
[ ] Model version reporting
[ ] Prediction latency measurement
[ ] Batch inference
[ ] Online inference
```

## Definition of Done

> A trained predictive-maintenance model is used by the FactoryOps prediction service and can be evaluated against a reproducible dataset.

This is **Milestone M4**.

---

# Phase 5 — MLOps

## Objective

Make the ML lifecycle reproducible and traceable.

Introduce MLflow.

Architecture:

```text
Training
    ↓
MLflow Experiment
    ↓
Metrics
    ↓
Artifacts
    ↓
Model Registry
    ↓
Model Version
    ↓
Inference Service
```

Tasks:

```text
[ ] MLflow
[ ] Experiment tracking
[ ] Parameter tracking
[ ] Metric tracking
[ ] Artifact tracking
[ ] Model registry
[ ] Model versioning
[ ] Model promotion
```

The prediction system should make it possible to answer:

```text
Which model produced this prediction?
Which dataset trained it?
Which experiment produced it?
What metrics did it achieve?
```

## Definition of Done

> Model versions can be tracked, registered, promoted, and identified from production predictions.

This is **Milestone M5**.

---

# Phase 6 — RAG + AI Maintenance Copilot

## Objective

Transform the basic LLM assistant into a contextual maintenance investigation system.

The Copilot should eventually combine:

```text
Current Machine State
+
Live Telemetry
+
Prediction
+
Maintenance History
+
Technical Documentation
```

---

# Knowledge Base

Potential sources:

```text
Technical Manuals
Maintenance Procedures
Equipment Documentation
Historical Work Orders
Maintenance Reports
Failure Documentation
```

Tasks:

```text
[ ] Document ingestion
[ ] Document parsing
[ ] Chunking
[ ] Metadata
[ ] Embeddings
[ ] Vector storage
[ ] Retrieval
```

Introduce:

```text
pgvector
```

---

# RAG

Target architecture:

```text
Technician Question
        ↓
Query Processing
        ↓
Vector Search
        ↓
Relevant Documentation
        ↓
Machine Context
        ↓
LLM
        ↓
Maintenance Answer
```

Tasks:

```text
[ ] Retrieval pipeline
[ ] Metadata filtering
[ ] Machine-specific retrieval
[ ] Maintenance-history retrieval
[ ] Citation / source tracking
```

---

# Agent Architecture

Introduce LangGraph when multiple tools and controlled workflows are required.

Potential tools:

```text
Machine Tool
Prediction Tool
Telemetry Tool
Maintenance Tool
RAG Tool
```

Architecture:

```text
                    Technician
                         ↓
                    AI Copilot
                         ↓
                    LangGraph
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
      Machine         Prediction        RAG
       Tool             Tool            Tool
          ↓              ↓              ↓
     Factory API       ML API        Knowledge Base
```

Tasks:

```text
[ ] LangGraph
[ ] Tool definitions
[ ] Tool authorization
[ ] Agent state
[ ] Tool routing
[ ] Retrieval workflow
[ ] Maintenance investigation workflow
[ ] Safety boundaries
```

## Definition of Done

> A technician can ask a maintenance question and the Copilot can combine machine data, prediction results, maintenance history, and technical documentation to produce a contextual answer.

This is **Milestone M6**.

---

# Phase 7 — Observability

## Objective

Make the distributed FactoryOps platform measurable and debuggable.

Introduce:

```text
Prometheus
Grafana
OpenTelemetry
Structured Logging
Distributed Tracing
```

---

# Metrics

Monitor:

```text
API latency
API error rate
Telemetry throughput
Simulation rate
Prediction latency
Prediction error rate
Kafka throughput
Consumer lag
Database latency
Copilot latency
LLM failures
RAG retrieval latency
```

---

# Logging

Tasks:

```text
[ ] Structured logs
[ ] Correlation IDs
[ ] Machine IDs in logs
[ ] Scenario IDs
[ ] Request IDs
[ ] Error classification
```

---

# Tracing

Track workflows such as:

```text
Telemetry Event
    ↓
Kafka
    ↓
Prediction
    ↓
Alert
    ↓
WebSocket
    ↓
Technician Dashboard
```

And:

```text
Technician Question
    ↓
Copilot
    ↓
Machine Tool
    ↓
Prediction Tool
    ↓
RAG
    ↓
LLM
```

## Definition of Done

> A developer can identify where latency, errors, or failures occurred across the distributed system.

This is **Milestone M7**.

---

# Phase 8 — Kubernetes

## Objective

Move from local Docker orchestration to independently deployable services.

Only introduce Kubernetes after service boundaries are stable.

Potential services:

```text
factoryops-web
factoryops-api
machine-simulator
prediction-service
ai-copilot
ingestion
```

---

# Kubernetes Work

Tasks:

```text
[ ] Kubernetes manifests
[ ] Helm charts
[ ] Deployments
[ ] Services
[ ] ConfigMaps
[ ] Secrets
[ ] Ingress
[ ] Health probes
[ ] Resource limits
[ ] Horizontal scaling
[ ] Rolling deployment
```

---

# Service Resilience

Tasks:

```text
[ ] Startup probes
[ ] Readiness probes
[ ] Liveness probes
[ ] Retry strategies
[ ] Graceful shutdown
[ ] Failure recovery
```

## Definition of Done

> FactoryOps services can run as independently deployable containers in Kubernetes.

This is **Milestone M8**.

---

# Phase 9 — AWS

## Objective

Deploy the production-inspired FactoryOps architecture into AWS.

Potential services:

```text
EKS
RDS
S3
ECR
EMR
IAM
CloudWatch
```

---

# AWS Architecture

```text
                         AWS
                          │
             ┌────────────┴────────────┐
             │                         │
            EKS                       RDS
             │                         │
      ┌──────┼────────┐                │
      ↓      ↓        ↓                │
     API     ML     Copilot            │
      │      │        │                │
      └──────┼────────┘                │
             │                         │
             └───────────────→ Database

                    S3
                     ↑
             Historical Data
```

---

# Container Registry

```text
[ ] ECR repositories
[ ] Image builds
[ ] Image scanning
[ ] Versioned images
[ ] Deployment tags
```

---

# Database

```text
[ ] RDS PostgreSQL
[ ] Database migrations
[ ] Backup strategy
[ ] Connection management
[ ] Environment separation
```

---

# Storage

```text
[ ] S3 raw telemetry
[ ] S3 processed data
[ ] S3 training datasets
[ ] S3 model artifacts
```

---

# Kubernetes Cloud Deployment

```text
[ ] EKS cluster
[ ] Networking
[ ] IAM
[ ] Secrets
[ ] Ingress
[ ] Autoscaling
[ ] Monitoring
[ ] CI/CD deployment
```

---

# CI/CD

Target workflow:

```text
Git Push
   ↓
GitHub Actions
   ↓
Tests
   ↓
Build
   ↓
Container Image
   ↓
ECR
   ↓
Deployment
   ↓
EKS
```

Tasks:

```text
[ ] Backend tests
[ ] Frontend tests
[ ] Integration tests
[ ] Docker builds
[ ] Image publishing
[ ] Deployment automation
[ ] Environment promotion
```

## Definition of Done

> FactoryOps can be deployed through CI/CD into AWS with persistent storage, container orchestration, monitoring, and independently deployable services.

This is **Milestone M9**.

---

# Cross-Phase Testing Strategy

Testing evolves together with the architecture.

## Unit Testing

```text
[ ] Domain logic
[ ] Machine state transitions
[ ] Telemetry generation
[ ] Failure scenarios
[ ] Prediction calculations
[ ] Alert rules
[ ] Data validation
[ ] AI tools
```

---

## Integration Testing

```text
[ ] API ↔ PostgreSQL
[ ] Simulator ↔ API
[ ] Simulator ↔ Kafka
[ ] Kafka ↔ Consumers
[ ] Prediction ↔ Model
[ ] Copilot ↔ Tools
[ ] Copilot ↔ Vector Store
```

---

## End-to-End Testing

The primary E2E workflow remains:

```text
Login
 ↓
Start PUMP-005
 ↓
Inject Bearing Failure
 ↓
Observe Telemetry
 ↓
Observe Prediction
 ↓
Receive Alert
 ↓
Open Machine
 ↓
Ask AI Copilot
 ↓
Record Maintenance
```

Every major architectural evolution should preserve this workflow.

---

# Documentation Roadmap

Documentation should evolve alongside implementation.

Initial:

```text
docs/
├── DEVELOPMENT.md
├── ARCHITECTURE.md
└── API.md
```

As the system grows:

```text
docs/
├── DEVELOPMENT.md
├── ARCHITECTURE.md
├── API.md
├── SIMULATION.md
├── ML.md
├── AI_COPILOT.md
├── DATA_ENGINEERING.md
├── DEPLOYMENT.md
└── DECISIONS/
```

Architecture decisions should be documented when important design choices are made.

Examples:

```text
DECISIONS/
├── 001-mvp-monolith.md
├── 002-websocket-telemetry.md
├── 003-kafka-event-streaming.md
├── 004-model-serving.md
└── 005-agent-architecture.md
```

---

# What Should NOT Be Built Too Early

FactoryOps should deliberately avoid premature complexity.

Do not start with:

```text
Kubernetes
Kafka
Spark
Airflow
MLflow
LangGraph
AWS
```

before the MVP proves the product workflow.

The correct progression is:

```text
Working Product
      ↓
Architectural Pressure
      ↓
New Technology
      ↓
Measured Improvement
```

not:

```text
Technology
    ↓
Technology
    ↓
Technology
    ↓
Complexity
```

---

# Phase Completion Rule

A phase is complete only when it has:

1. Working implementation
2. Tests
3. Documentation
4. Demonstrable behavior
5. Stable interfaces for the next phase

For example, Phase 2 is not complete merely because Kafka is running.

It is complete when:

```text
Simulator
    ↓
Kafka
    ↓
Consumers
    ↓
Prediction / Persistence / Alerts
```

works reliably as part of the existing FactoryOps workflow.

---

# Priority Order

If development time becomes limited, prioritize in this order:

```text
1. Complete MVP
2. Realistic machine simulation
3. Reliable telemetry
4. Prediction and alerts
5. Technician workflow
6. Basic AI Copilot
7. Event streaming
8. Historical data pipeline
9. Advanced ML
10. MLOps
11. RAG / Agents
12. Observability
13. Kubernetes
14. AWS
```

The first six items form the core product.

The remaining phases progressively increase architectural depth.

---

# Final Target Architecture

At the end of the roadmap, FactoryOps can evolve toward:

```text
                                      USERS
                                        │
                       ┌────────────────┴────────────────┐
                       │                                 │
                 Developer                         Technician
                       │                                 │
                       └────────────────┬────────────────┘
                                        │
                                        ▼
                              FactoryOps Web
                                        │
                                  REST / WS
                                        │
                                        ▼
                              FactoryOps API
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              │                         │                         │
              ▼                         ▼                         ▼
       Machine Simulator        Prediction Service          AI Copilot
              │                         │                         │
              └─────────────────────────┼─────────────────────────┘
                                        │
                                      Kafka
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
                Ingestion           Events             Analytics
                    │
                    ▼
              Object Storage
                    │
              ┌─────┴─────┐
              ▼           ▼
           Spark       ML Pipeline
              │           │
              ▼           ▼
          Features      MLflow
                          │
                          ▼
                    Model Registry
                          │
                          ▼
                    Model Serving

AI Copilot
    │
    ▼
 LangGraph
    │
 ┌──┼───────────────┐
 ▼  ▼               ▼
RAG Tools       Machine Tools
 │                 │
 ▼                 ▼
pgvector        Factory APIs
 │
 ▼
Technical Docs
+
Maintenance History

Infrastructure
    │
    ├── Kubernetes
    ├── Prometheus
    ├── Grafana
    ├── OpenTelemetry
    │
    └── AWS
         ├── EKS
         ├── RDS
         ├── S3
         ├── ECR
         └── EMR
```

---

# Final Objective

The final objective is not to check every technology off a list.

The objective is to demonstrate the evolution of one coherent Industrial AI system.

```text
                    MACHINE
                       │
                       ▼
                  SIMULATION
                       │
                       ▼
                  TELEMETRY
                       │
                       ▼
                 PREDICTION
                       │
                       ▼
                    ALERT
                       │
                       ▼
                 INVESTIGATION
                       │
                       ▼
                  AI COPILOT
                       │
                       ▼
                 MAINTENANCE
                       │
                       ▼
                 HISTORICAL DATA
                       │
                       ▼
                  ML TRAINING
                       │
                       ▼
                  BETTER MODEL
                       │
                       ▼
                 BETTER PREDICTION
```

The architecture then grows around that loop:

```text
MVP
 ↓
Streaming
 ↓
Data Engineering
 ↓
Machine Learning
 ↓
MLOps
 ↓
RAG
 ↓
Agents
 ↓
Observability
 ↓
Kubernetes
 ↓
Cloud
```

The core product never changes:

> **A machine fails. FactoryOps sees it happening, predicts the failure, alerts a technician, explains the situation, and helps determine what to do next.**

Everything else exists to make that workflow progressively more realistic, scalable, intelligent, observable, and production-inspired.
