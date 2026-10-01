.PHONY: test lint format typecheck check

## Show help
help:
	@echo "Available commands:"
	@echo "  make help         - Show this help message"
	@echo "  make test         - Run pytest"
	@echo "  make lint         - Run ruff linter"
	@echo "  make format       - Format code with black"
	@echo "  make typecheck    - Run mypy type checking (optional, must be installed manually)"
	@echo "  make check        - Run lint format typecheck and test"

test:
	uv run pytest

lint:
	uv run ruff check . --fix

format:
	uv run black .

typecheck:
	uv run mypy app

check: lint format typecheck test