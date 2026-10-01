from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "FactoryOps AI API"
    app_env: str = "development"
    database_url: str = "postgresql://factoryops:password@localhost:5432/factoryops"
    jwt_secret: str = "change-this-development-secret-key"
    jwt_expiration_minutes: int = 60

    model_config = {
        "env_file": ".env",
    }


settings = Settings()
