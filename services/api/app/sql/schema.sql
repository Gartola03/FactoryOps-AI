-------------------------
--Users Management
-------------------------
CREATE TABLE IF NOT EXISTS Roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL

);

CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES Roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE Users ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE Users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;


CREATE TABLE IF NOT EXISTS Permissions (
    id SERIAL PRIMARY KEY,
    permission_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS RolePermissions (
    role_id INT REFERENCES Roles(id),
    permission_id INT REFERENCES Permissions(id),
    PRIMARY KEY (role_id, permission_id)
);


-------------------------
--Machine Management
-------------------------

CREATE TABLE IF NOT EXISTS machines (
    id SERIAL PRIMARY KEY,
    machine_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    machine_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'created',
    factory_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE machines ADD COLUMN IF NOT EXISTS factory_id INT;
ALTER TABLE machines ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE machines ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS machine_telemetry (
    id SERIAL PRIMARY KEY,
    machine_id INT NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    temperature NUMERIC(8, 2),
    vibration NUMERIC(8, 2),
    rpm NUMERIC(8, 2),
    failure_probability NUMERIC(5, 2),
    alert_severity VARCHAR(20),
    scenario VARCHAR(100),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_records (
    id SERIAL PRIMARY KEY,
    machine_id INT NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    recorded_by INT NOT NULL REFERENCES Users(id),
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'submitted',
    verified_by INT REFERENCES Users(id),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS simulation_scenarios (
    id SERIAL PRIMARY KEY,
    machine_id INT NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    scenario_name VARCHAR(100) NOT NULL,
    action VARCHAR(30) NOT NULL,
    created_by INT NOT NULL REFERENCES Users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS factory_configuration (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value TEXT NOT NULL,
    updated_by INT REFERENCES Users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

