SELECT
    id,
    machine_code,
    name,
    machine_type,
    status
FROM machines
WHERE id = %s;