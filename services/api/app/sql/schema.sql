-------------------------
--Users Management
-------------------------
CREATE TABLE Roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL

);

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES Roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Permissions (
    id SERIAL PRIMARY KEY,
    permission_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE RolePermissions (
    role_id INT REFERENCES Roles(id),
    permission_id INT REFERENCES Permissions(id),
    PRIMARY KEY (role_id, permission_id)
);


-------------------------
--Machine Management
-------------------------

CREATE TABLE machines (
    id SERIAL PRIMARY KEY,
    machine_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    machine_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL
);

