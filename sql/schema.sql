-- Base schema for FactoryOps CI bootstrap
CREATE TABLE IF NOT EXISTS machines (
    id SERIAL PRIMARY KEY,
    machine_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    temperature NUMERIC(10,2) NOT NULL,
    pressure NUMERIC(10,2) NOT NULL,
    vibration NUMERIC(10,2) NOT NULL,
    rpm INTEGER NOT NULL,
    voltage NUMERIC(10,2) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL
);
