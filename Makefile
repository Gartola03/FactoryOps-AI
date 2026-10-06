.PHONY: help venv install test lint format typecheck docker setup clean web api simulator prediction ai up down restart ps db-shell db-logs migrate

## Show help
help:
	@echo "Available commands:"
	@echo "  make help         - Show this help message"
	@echo "  make venv         - Create or update the virtual environment using uv"
	@echo "  make install      - Sync dependencies from pyproject.toml / lockfile"
	@echo "  make test         - Run pytest"
	@echo "  make lint         - Run ruff linter"
	@echo "  make format       - Format code with black"
	@echo "  make typecheck    - Run mypy type checking (optional, must be installed manually)"
	@echo "  make docker       - Build and run Docker Compose"
	@echo "  make setup        - Full setup: venv + install + test"
	@echo "  make mkdocs       - Serve project documentation locally with MkDocs"
	@echo "  make clean_selected - Interactively remove selected project files (mandatory before delivering to client)"
	@echo "  make clean        - Remove Python cache directories (__pycache__, .pytest_cache, .mypy_cache) and build artifacts (build/, dist/, *.egg-info)"
	@echo "  make web		   - Run the web application in development mode" 
	@echo "  make web-install 	- Install web application dependencies" 	
	@echo "  make web-build    - Build the web application"
	@echo "  make api          - Run the API service in development mode"
	@echo "  make simulator    - Run the machine simulator service in development mode"
	@echo "  make prediction   - Run the prediction service in development mode"
	@echo "  make ai           - Run the AI copilot service in development mode"
# 	@echo "  make dev          - Run both the API and web application in development mode"
	@echo "  make up           - Start Docker Compose in detached mode"
	@echo "  make down         - Stop Docker Compose"
	@echo "  make restart      - Restart Docker Compose"
	@echo "  make ps           - Show the status of Docker Compose services"
	@echo "  make db-shell     - Open a shell to the PostgreSQL database"
	@echo "  make db-logs      - Show logs for the PostgreSQL database service"
	@echo "  make db-up        - Start the PostgreSQL database service"
	@echo "  make db-down      - Stop the PostgreSQL database service"
	@echo "  make db-schema    - Apply the database schema from the schema.sql file"
	@echo "  make db-seed      - Seed the database with initial data from the seed.sql file"
	@echo "  make db-setup     - Set up the database: start service, apply schema, and seed data"
	@echo "  make db-check     - Open a shell to the PostgreSQL database for checking"
	@echo "  make db-reset     - Reset the database: stop service, remove volumes, start service, apply schema (and optionally seed data)"
	@echo "  make db-clean     - Stop the database service and remove volumes"

## Create virtual environment
venv:
	uv venv

## Install dependencies from lockfile
install:
	cd apps/factoryops-web && npm install
	cd services/api && uv sync
	cd services/machine-simulator && uv sync
#	cd services/prediction-service && uv sync
# 	cd services/ai-copilot && uv sync

## Run tests
test:
	uv run pytest

## Run linter
lint:
	uv run ruff check .

## Run code formatter
format:
	uv run black .

## Run type checker (optional)
typecheck:
	uv run mypy src

## Build and run Docker
docker:
	docker compose up --build

## Full setup: venv + install + test
setup: venv install test

## Run localhost webpage for the project docs
mkdocs:
	uv run mkdocs serve --dev-addr=127.0.0.1:8001

## Clean selected project files interactively
clean_selected:
	uv run python -m src.utils.clean_project

## Clean build artifacts
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	rm -rf build/ dist/ *.egg-info


web:
	cd apps/factoryops-web && npm run dev

web-install:
	cd apps/factoryops-web && npm install

web-build:
	cd apps/factoryops-web && npm run build

api:
	cd services/api && uv run uvicorn app.main:app --reload --port 8000

simulator:
	cd services/machine-simulator && uv run python main.py

prediction:
	cd services/prediction-service && uv run python main.py

ai:
	cd services/ai-copilot && uv run python main.py 

# dev:
# 	$(MAKE) api & $(MAKE) web
# 	wait


up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose down
	docker compose up -d

ps:
	docker compose ps

# Database

DB_SERVICE=postgres
DB_USER=factoryops
DB_NAME=factoryops
DB_SCHEMA_FILE=services/api/app/sql/schema.sql
DB_SEED_FILE=services/api/app/sql/seed.sql

db-up:
	docker compose up -d $(DB_SERVICE)
	docker compose exec -T $(DB_SERVICE) sh -c 'until pg_isready -U $(DB_USER) -d $(DB_NAME); do sleep 1; done'

db-down:
	docker compose stop $(DB_SERVICE)

db-shell:
	docker compose exec $(DB_SERVICE) psql -U $(DB_USER) -d $(DB_NAME)

db-logs:
	docker compose logs -f $(DB_SERVICE)

db-schema:
	docker compose exec -T $(DB_SERVICE) \
		psql -U $(DB_USER) -d $(DB_NAME) \
		< $(DB_SCHEMA_FILE)

db-seed:
	docker compose exec -T $(DB_SERVICE) \
		psql -U $(DB_USER) -d $(DB_NAME) \
		< $(DB_SEED_FILE)

db-setup:
	$(MAKE) db-up
	$(MAKE) db-schema
	$(MAKE) db-seed

db-check:
	$(MAKE) db-shell

db-reset:
	docker compose down -v
	$(MAKE) db-up
	$(MAKE) db-schema
	$(MAKE) db-seed

db-clean:
	docker compose down -v