# FactoryOps AI — Roadmap

> **The implementation roadmap for evolving FactoryOps AI from a focused industrial AI vertical slice into a production-inspired, event-driven, ML-powered, cloud-deployed platform.**

FactoryOps AI is intentionally developed in stages.

The goal is to build the **industrial workflow and predictive-maintenance foundation first**, then introduce additional capabilities such as authentication, LLMs, RAG, AI agents, observability, and other production features only when they provide a clear engineering or product benefit.

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
Maintenance Action
```

The initial roadmap focuses on making this workflow reliable and progressively more sophisticated:

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
Kubernetes
    ↓
AWS
```

Additional capabilities are introduced later as **Future Feature Implementations**:

```text
Authentication
    ↓
LLM Copilot
    ↓
RAG
    ↓
AI Agents
    ↓
Observability
    ↓
Additional Production Features
```

This separation keeps the main milestones focused and prevents the project from becoming overloaded with infrastructure and AI technologies before the core system is proven.

---

# Milestone Overview

| Milestone | Phase            | Main Result                                           |
| --------- | ---------------- | ----------------------------------------------------- |
| **M0**    | Foundation       | Local application boots                               |
| **M1**    | Complete MVP     | Full machine-failure vertical slice works             |
| **M2**    | Event Streaming  | Telemetry and machine events flow through Kafka       |
| **M3**    | Data Engineering | Historical data becomes reproducible datasets         |
| **M4**    | Advanced ML      | Real predictive-maintenance model is deployed         |
| **M5**    | MLOps            | Models are tracked, versioned, and reproducible       |
| **M10**   | Kubernetes       | Services run as independently deployable workloads    |
| **M11**   | AWS              | Cloud deployment is automated and production-inspired |

Between these milestones, additional functionality can be introduced as **Future Feature Implementations** without changing the core milestone structure.

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
│   └── prediction-service/
│
├── shared/
├── data/
├── tests/
├── docs/
│
└── .github/
    └── workflows/
```

The initial repository intentionally contains only the components required for the core FactoryOps workflow.

The AI Copilot is **not required for the initial MVP**.

---

## Repository After Data Engineering

When Kafka, Airflow, object storage, and larger ML workflows become real requirements:

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
│   └── airflow/
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

Future AI functionality can later introduce additional directories such as:

```text
services/
└── ai-copilot/

ai/
├── prompts/
├── rag/
├── agents/
└── tools/
```

These are **future extensions**, not requirements for the core milestone progression.

---

# Phase 0 — Foundation

## Objective

Create the basic FactoryOps application and development environment.

The system should be able to run locally before sophisticated industrial, ML, or AI functionality is added.

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

Build the first complete FactoryOps industrial experience.

---

# Phase 1.1 — Machine Domain

Create the central machine domain.

Example:

```text
PUMP-005
```

Fields should include:

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

The failure should create a degradation trajectory rather than instantly failing the machine.

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
What should I investigate?
```

AI explanation is **not required at this stage**.

---

# Phase 1.8 — Maintenance Records

Create the maintenance feedback loop.

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

This record becomes part of the machine's historical context and can later become useful to ML and AI features.

---

# Phase 1 — Final Vertical Slice

The MVP must support:

```text
Developer
  ↓
Open simulator
  ↓
Start PUMP-005
  ↓
Inject Bearing Failure
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
Technician investigates
  ↓
Technician records maintenance
```

## Definition of Done

> **A complete machine failure can be simulated, detected, predicted, investigated, and recorded through one FactoryOps application.**

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

## Event Contracts

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

## Object Storage

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

## Airflow

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

## Data Quality

```text
[ ] Schema validation
[ ] Missing-value checks
[ ] Timestamp validation
[ ] Range validation
[ ] Duplicate detection
[ ] Sensor anomaly checks
```

## Feature Engineering

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

## Training Pipeline

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

## Prediction API

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

> Model versions can be tracked, registered, promoted, and identified from predictions.

This is **Milestone M5**.

---

# Future Feature Implementations

The following capabilities are intentionally **not part of M1–M5**.

They can be introduced later as independent feature implementations once the core FactoryOps platform is stable.

---

# Future Feature 1 — Authentication & User Management

Authentication should be added when FactoryOps needs real users and access control.

```text
[ ] User model
[ ] Signup
[ ] Login
[ ] Password hashing
[ ] Session / JWT authentication
[ ] Authentication middleware
[ ] Logout
```

## Role-Based Access Control

Initial roles:

```text
ADMIN
DEVELOPER
TECHNICIAN
```

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
[ ] Record maintenance
```

### Administrator

```text
[ ] Manage users
[ ] Manage roles
[ ] Manage factory configuration
```

Authentication can therefore be implemented independently without blocking the industrial MVP.

---

# Future Feature 2 — LLM Maintenance Copilot

Once the predictive-maintenance system works, introduce a basic LLM integration.

The first AI version should remain deliberately simple.

The LLM receives structured FactoryOps context:

```text
Machine State
+
Current Telemetry
+
Prediction
+
Failure Scenario
+
Maintenance History
```

Architecture:

```text
FactoryOps Data
      ↓
Context Builder
      ↓
LLM
      ↓
AI Explanation
```

Example:

```text
PUMP-005

Temperature: 87°C
Vibration: 8.4 mm/s
RPM: 1,420
Failure probability: 91%
Scenario: Bearing Failure
```

The Copilot can explain:

> PUMP-005 is showing a high risk of bearing failure because vibration and temperature are increasing while RPM is decreasing.

Tasks:

```text
[ ] LLM integration
[ ] Context builder
[ ] Prompt design
[ ] Copilot API
[ ] Chat UI
[ ] Error handling
```

The goal of the first AI implementation is **explanation**, not autonomous decision-making.

---

# Future Feature 3 — RAG

After the basic LLM Copilot is useful, introduce technical knowledge retrieval.

The Copilot can eventually combine:

```text
Machine Data
+
Prediction
+
Maintenance History
+
Technical Documentation
```

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
[ ] Metadata filtering
[ ] Source citations
```

Potential technology:

```text
pgvector
```

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

This allows the Copilot to answer questions such as:

```text
What is happening?
Why is the machine at risk?
What does the maintenance documentation recommend?
```

---

# Future Feature 4 — AI Agents

Agentic functionality should only be introduced when the Copilot requires multiple tools or multi-step investigation.

Potential tools:

```text
Machine Tool
Prediction Tool
Telemetry Tool
Maintenance Tool
RAG Tool
```

Potential architecture:

```text
Technician
    ↓
AI Copilot
    ↓
Agent
    │
    ├── Machine Tool
    ├── Telemetry Tool
    ├── Prediction Tool
    ├── Maintenance Tool
    └── RAG Tool
```

Potential framework:

```text
LangGraph
```

Tasks:

```text
[ ] Tool definitions
[ ] Tool authorization
[ ] Agent state
[ ] Tool routing
[ ] Retrieval workflow
[ ] Maintenance investigation workflow
[ ] Safety boundaries
```

Example future workflow:

```text
Technician Question
       ↓
Analyze Machine
       ↓
Check Telemetry
       ↓
Check Prediction
       ↓
Search Documentation
       ↓
Check Maintenance History
       ↓
Generate Recommendation
```

The agent should remain **controlled and tool-based**, rather than being given unrestricted access to FactoryOps.

---

# Future Feature 5 — Observability

Observability should be introduced once the distributed architecture has enough components to justify it.

Potential technologies:

```text
Prometheus
Grafana
OpenTelemetry
Structured Logging
Distributed Tracing
```

## Metrics

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

## Logging

```text
[ ] Structured logs
[ ] Correlation IDs
[ ] Machine IDs in logs
[ ] Scenario IDs
[ ] Request IDs
[ ] Error classification
```

## Tracing

Eventually trace workflows such as:

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

And later:

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

The purpose is to make the system measurable and debuggable rather than adding observability simply because it is a common production technology.

---

# Milestone 10 — Kubernetes

## Objective

Move from local Docker orchestration to independently deployable services.

Kubernetes is introduced after the service architecture and ML platform are stable.

Potential services:

```text
factoryops-web
factoryops-api
machine-simulator
prediction-service
ingestion
```

Future AI services can also be deployed independently:

```text
ai-copilot
rag-service
agent-service
```

## Kubernetes Work

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

## Service Resilience

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

This is **Milestone M10**.

---

# Milestone 11 — AWS

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

## AWS Architecture

```text
                         AWS
                          │
             ┌────────────┴────────────┐
             │                         │
            EKS                       RDS
             │                         │
      ┌──────┼────────┐                │
      ↓      ↓        ↓                │
     API     ML     Other Services     │
      │      │        │                │
      └──────┼────────┘                │
             │                         │
             └───────────────→ Database

                    S3
                     ↑
             Historical Data
```

AI services can later be added to EKS without changing the core architecture:

```text
EKS
├── FactoryOps API
├── Prediction Service
├── Machine Simulator
├── AI Copilot
├── RAG Service
└── Agent Service
```

## Container Registry

```text
[ ] ECR repositories
[ ] Image builds
[ ] Image scanning
[ ] Versioned images
[ ] Deployment tags
```

## Database

```text
[ ] RDS PostgreSQL
[ ] Database migrations
[ ] Backup strategy
[ ] Connection management
[ ] Environment separation
```

## Storage

```text
[ ] S3 raw telemetry
[ ] S3 processed data
[ ] S3 training datasets
[ ] S3 model artifacts
```

## Kubernetes Cloud Deployment

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

## CI/CD

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

> FactoryOps can be deployed through CI/CD into AWS with persistent storage, container orchestration, and independently deployable services.

This is **Milestone M11**.

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
```

Future:

```text
[ ] AI tools
[ ] RAG retrieval
[ ] Agent workflows
```

---

## Integration Testing

```text
[ ] API ↔ PostgreSQL
[ ] Simulator ↔ API
[ ] Simulator ↔ Kafka
[ ] Kafka ↔ Consumers
[ ] Prediction ↔ Model
```

Future:

```text
[ ] Copilot ↔ Tools
[ ] Copilot ↔ Vector Store
[ ] Agent ↔ Factory APIs
```

---

## End-to-End Testing

The core E2E workflow remains:

```text
Start Machine
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
Record Maintenance
```

Future AI E2E functionality can extend it:

```text
...
 ↓
Ask AI Copilot
 ↓
AI Explains Failure
 ↓
Retrieve Technical Documentation
 ↓
Generate Maintenance Recommendation
```

Every major architectural evolution should preserve the original industrial workflow.

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
├── DATA_ENGINEERING.md
├── DEPLOYMENT.md
└── DECISIONS/
```

Future AI documentation:

```text
docs/
├── AI_COPILOT.md
├── RAG.md
├── AGENTS.md
└── OBSERVABILITY.md
```

---


# Feature Implementation Philosophy

Future features should be added because they solve a real problem.

For example:

### LLM

Introduce when technicians need natural-language explanations.

```text
Prediction
    ↓
Technician asks "Why?"
    ↓
LLM explains prediction
```

### RAG

Introduce when the LLM needs external technical knowledge.

```text
LLM
 +
Maintenance Manuals
 +
Technical Documentation
```

### Agents

Introduce when the Copilot needs to perform multi-step investigation.

```text
Question
 ↓
Machine
 ↓
Telemetry
 ↓
Prediction
 ↓
Documentation
 ↓
Recommendation
```

### Observability

Introduce when the system has enough distributed components that debugging becomes difficult.

```text
Kafka
 + 
Services
 +
ML
 +
Infrastructure
```

This gives every technology a concrete reason to exist.

---

# Final Target Architecture

The eventual FactoryOps architecture can evolve toward:

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
       Machine Simulator        Prediction Service       Future AI Copilot
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
           Features    ML Pipeline
                          │
                          ▼
                        MLflow
                          │
                          ▼
                    Model Registry
                          │
                          ▼
                    Model Serving
```

Future AI architecture:

```text
AI Copilot
    │
    ▼
   LLM
    │
    ├───────────────┐
    │               │
    ▼               ▼
   RAG           AI Agent
    │               │
    ▼               ├── Machine Tool
Technical Docs      ├── Telemetry Tool
                    ├── Prediction Tool
                    ├── Maintenance Tool
                    └── RAG Tool
```

Future observability layer:

```text
FactoryOps Services
       │
       ├── Metrics
       ├── Logs
       └── Traces
              │
              ▼
      Observability Stack
       ├── Prometheus
       ├── Grafana
       └── OpenTelemetry
```

Infrastructure:

```text
Kubernetes
    ↓
AWS
    ├── EKS
    ├── RDS
    ├── S3
    ├── ECR
    └── EMR
```

---

# Final Objective

The final objective is not to check every technology off a list.

The objective is to demonstrate the evolution of **one coherent Industrial AI system**.

The core system starts with:

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

The main milestone progression is:

```text
M1 — Complete MVP
 ↓
M2 — Event Streaming
 ↓
M3 — Data Engineering
 ↓
M4 — Advanced ML
 ↓
M5 — MLOps
 ↓
M10 — Kubernetes
 ↓
M11 — AWS
```

Then the platform can progressively gain additional capabilities:

```text
Future Features
      │
      ├── Authentication
      │
      ├── LLM Copilot
      │
      ├── RAG
      │
      ├── AI Agents
      │
      └── Observability
```

The core product therefore remains:

> **A machine fails. FactoryOps sees it happening, predicts the failure, alerts a technician, and records the maintenance response.**

The future AI layer then makes that system more intelligent:

> **FactoryOps can explain why the machine is at risk, retrieve relevant technical knowledge, and eventually assist with a controlled maintenance investigation.**

Everything else exists to make the same industrial workflow progressively more realistic, scalable, intelligent, observable, and production-inspired.
