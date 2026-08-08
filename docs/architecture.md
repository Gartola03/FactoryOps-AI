```text
              ┌─────────────────────────┐
              │      React Frontend     │
              │    TypeScript + Vite    │
              └────────────┬────────────┘
                           │
                        REST/HTTP
                           │
                           ▼
              ┌─────────────────────────┐
              │       FastAPI API       │
              │         Python          │
              └────────────┬────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
       PostgreSQL    Prediction       AI Copilot
                     Service              │
                                        ┌─┴───┐
                                        ▼     ▼
                                       RAG   ML Tools

```