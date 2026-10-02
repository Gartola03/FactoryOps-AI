INSERT INTO Roles (role_name) VALUES
('admin'),
('supervisor'),
('operator')
ON CONFLICT (role_name) DO NOTHING;

INSERT INTO Permissions (permission_name) VALUES
('create_machine'),
('read_machine'),
('update_machine'),
('delete_machine'),
('view_telemetry'),
('view_alerts'),
('view_predictions'),
('view_maintenance_history'),
('investigate_machines'),
('use_copilot'),
('record_maintenance'),
('start_machines'),
('stop_machines'),
('pause_machines'),
('resume_machines'),
('run_scenarios'),
('inject_failures'),
('reset_simulations'),
('review_shift_logs'),
('manage_users'),
('manage_roles'),
('manage_factory_configuration')
ON CONFLICT (permission_name) DO NOTHING;

INSERT INTO RolePermissions (role_id, permission_id) VALUES
((SELECT id FROM Roles WHERE role_name = 'admin'), (SELECT id FROM Permissions WHERE permission_name = 'create_machine')),
((SELECT id FROM Roles WHERE role_name = 'admin'), (SELECT id FROM Permissions WHERE permission_name = 'read_machine')),
((SELECT id FROM Roles WHERE role_name = 'admin'), (SELECT id FROM Permissions WHERE permission_name = 'update_machine')),
((SELECT id FROM Roles WHERE role_name = 'admin'), (SELECT id FROM Permissions WHERE permission_name = 'delete_machine')),
((SELECT id FROM Roles WHERE role_name = 'supervisor'), (SELECT id FROM Permissions WHERE permission_name = 'create_machine')),
((SELECT id FROM Roles WHERE role_name = 'supervisor'), (SELECT id FROM Permissions WHERE permission_name = 'read_machine')),
((SELECT id FROM Roles WHERE role_name = 'supervisor'), (SELECT id FROM Permissions WHERE permission_name = 'update_machine')),
((SELECT id FROM Roles WHERE role_name = 'supervisor'), (SELECT id FROM Permissions WHERE permission_name = 'delete_machine')),
((SELECT id FROM Roles WHERE role_name = 'operator'), (SELECT id FROM Permissions WHERE permission_name = 'read_machine')),
((SELECT id FROM Roles WHERE role_name = 'operator'), (SELECT id FROM Permissions WHERE permission_name = 'update_machine'))
ON CONFLICT DO NOTHING;

INSERT INTO RolePermissions (role_id, permission_id)
SELECT roles.id, permissions.id
FROM Roles AS roles CROSS JOIN Permissions AS permissions
WHERE roles.role_name = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO RolePermissions (role_id, permission_id)
SELECT roles.id, permissions.id
FROM Roles AS roles CROSS JOIN Permissions AS permissions
WHERE roles.role_name = 'supervisor'
	AND permissions.permission_name IN (
		'view_telemetry', 'view_alerts', 'view_predictions', 'view_maintenance_history',
		'investigate_machines', 'use_copilot', 'record_maintenance', 'create_machine',
		'read_machine', 'update_machine', 'delete_machine', 'create_machines',
		'update_machines', 'delete_machines', 'start_machines', 'stop_machines',
		'pause_machines', 'resume_machines', 'run_scenarios', 'inject_failures',
		'reset_simulations', 'review_shift_logs'
	)
ON CONFLICT DO NOTHING;

INSERT INTO RolePermissions (role_id, permission_id)
SELECT roles.id, permissions.id
FROM Roles AS roles CROSS JOIN Permissions AS permissions
WHERE roles.role_name = 'operator'
	AND permissions.permission_name IN (
		'read_machine', 'update_machine', 'view_telemetry', 'view_alerts',
		'view_predictions', 'view_maintenance_history', 'investigate_machines',
		'use_copilot', 'record_maintenance'
	)
ON CONFLICT DO NOTHING;

-- Pasword admnin: admin123 ejemplo para borrar
INSERT INTO Users (username, email, password_hash, role_id) VALUES
('admin', 'admin@example.com', '$argon2id$v=19$m=65536,t=3,p=4$BlRgK6F5rmotKD/vCYJlug$vfBX7Icj5hKAkHVTKTWjPe/5CvQ+1aYa+Ozaj828Tt4', (SELECT id FROM Roles WHERE role_name = 'admin'))
ON CONFLICT (email) DO UPDATE SET role_id = EXCLUDED.role_id;
INSERT INTO Users (username, email, password_hash, role_id) VALUES
('supervisor', 'supervisor@example.com', '$argon2id$v=19$m=65536,t=3,p=4$a/vUo03PgqVBP5St73t59g$8CrUkZZKY6wjoL4yigeBdcnN9GnHTBbnT1s1YZ56Yeg', (SELECT id FROM Roles WHERE role_name = 'supervisor'))
ON CONFLICT (email) DO UPDATE SET role_id = EXCLUDED.role_id;
INSERT INTO Users (username, email, password_hash, role_id) VALUES
('operator', 'operator@example.com', '$argon2id$v=19$m=65536,t=3,p=4$yrOZnLwsXBnYQmk/fuwj6w$U5F+wEeWfyxKvc8Z1vj0wr2XglWibATF0yTL4Hj2Gh8', (SELECT id FROM Roles WHERE role_name = 'operator'))
ON CONFLICT (email) DO UPDATE SET role_id = EXCLUDED.role_id;

INSERT INTO machines (machine_code, name, machine_type, status, factory_id) VALUES
('PUMP-005', 'Cooling water pump', 'Pump', 'running', 1),
('CNC-03', 'CNC production mill', 'CNC mill', 'warning', 1),
('Press-07', 'Hydraulic forming press', 'Hydraulic press', 'failed', 1),
('Robot-12', 'Assembly robot', 'Robotic arm', 'running', 1)
ON CONFLICT (machine_code) DO UPDATE SET
	name = EXCLUDED.name,
	machine_type = EXCLUDED.machine_type,
	status = EXCLUDED.status,
	factory_id = EXCLUDED.factory_id,
	updated_at = CURRENT_TIMESTAMP;
