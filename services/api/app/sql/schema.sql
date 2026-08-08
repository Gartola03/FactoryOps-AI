CREATE TABLE machines (
    id SERIAL PRIMARY KEY,
    machine_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    machine_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL
);