INSERT INTO Roles (role_name) VALUES
('admin'),
('user'),
('manager');

INSERT INTO Permissions (permission_name) VALUES
('create_machine'),
('read_machine'),
('update_machine'),
('delete_machine');

INSERT INTO RolePermissions (role_id, permission_id) VALUES
(1, 1), -- admin can create_machine
(1, 2), -- admin can read_machine
(1, 3), -- admin can update_machine
(1, 4), -- admin can delete_machine
(2, 2), -- user can read_machine
(3, 2), -- manager can read_machine
(3, 3); -- manager can update_machine

-- Pasword admnin: admin123 ejemplo para borrar
INSERT INTO Users (username, email, password_hash, role_id) VALUES
('admin', 'admin@example.com', '$argon2id$v=19$m=65536,t=3,p=4$BlRgK6F5rmotKD/vCYJlug$vfBX7Icj5hKAkHVTKTWjPe/5CvQ+1aYa+Ozaj828Tt4', 1);

INSERT INTO Users (username, email, password_hash, role_id) VALUES
('user', 'user@example.com', '$argon2id$v=19$m=65536,t=3,p=4$gWmZGw8gkFmwWpmWzjtRtA$jk8KAFMXLJ9GrBsuKNx3RoSG/h5ehYXniiwc0vReIGY', 2);