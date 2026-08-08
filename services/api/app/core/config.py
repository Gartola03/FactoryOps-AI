from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "FactoryOps AI API"
    app_env: str = "development"
    database_url: str = "postgresql://factoryops:password@localhost:5432/factoryops"

    model_config = {
        "env_file": ".env",
    }


settings = Settings()
