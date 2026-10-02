from typing import Any

from app.core.security import get_current_user, require_permission
from app.db.connection import get_connection
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter(prefix="/machines")

MACHINE_STATES = {"created", "stopped", "running", "paused", "failed", "maintenance"}
STATE_TRANSITIONS = {
    "start": {"created": "running", "stopped": "running", "paused": "running"},
    "stop": {"running": "stopped", "paused": "stopped", "failed": "stopped", "maintenance": "stopped"},
    "pause": {"running": "paused"},
    "resume": {"paused": "running"},
    "maintenance": {"stopped": "maintenance", "failed": "maintenance"},
}


class MachineCreate(BaseModel):
    machine_code: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=100)
    machine_type: str = Field(min_length=1, max_length=50)
    factory_id: int | None = None


class MachineUpdate(BaseModel):
    machine_code: str = Field(min_length=1, max_length=50)
    name: str = Field(min_length=1, max_length=100)
    machine_type: str = Field(min_length=1, max_length=50)
    factory_id: int | None = None


class MachineStateChange(BaseModel):
    action: str


class ScenarioRequest(BaseModel):
    scenario_name: str = Field(min_length=1, max_length=100)
    action: str = "run"


class MaintenanceCreate(BaseModel):
    description: str = Field(min_length=1)


def _user_id(user: dict[str, Any]) -> int:
    return int(user["sub"])


def _machine_dict(row: tuple[Any, ...]) -> dict[str, Any]:
    return {
        "id": row[0],
        "machine_code": row[1],
        "name": row[2],
        "machine_type": row[3],
        "status": row[4],
        "factory_id": row[5],
        "created_at": row[6],
        "updated_at": row[7],
    }


@router.get("/", dependencies=[Depends(require_permission("view_machines"))])
def list_machines() -> list[dict[str, Any]]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, machine_code, name, machine_type, status, factory_id,
                       created_at, updated_at
                FROM machines ORDER BY id
                """
            )
            return [_machine_dict(row) for row in cur.fetchall()]


@router.post("/", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_permission("create_machines"))])
def create_machine(machine: MachineCreate) -> dict[str, Any]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute(
                    """
                    INSERT INTO machines (machine_code, name, machine_type, status, factory_id)
                    VALUES (%s, %s, %s, 'created', %s)
                    RETURNING id, machine_code, name, machine_type, status, factory_id,
                              created_at, updated_at
                    """,
                    (machine.machine_code, machine.name, machine.machine_type, machine.factory_id),
                )
            except Exception as error:
                if "unique" in str(error).lower():
                    raise HTTPException(status_code=409, detail="Machine code already exists") from error
                raise
            return _machine_dict(cur.fetchone())


@router.put("/{machine_id}", dependencies=[Depends(require_permission("update_machines"))])
def update_machine(machine_id: int, machine: MachineUpdate) -> dict[str, Any]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute(
                    """
                    UPDATE machines
                    SET machine_code = %s, name = %s, machine_type = %s,
                        factory_id = %s, updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                    RETURNING id, machine_code, name, machine_type, status, factory_id,
                              created_at, updated_at
                    """,
                    (machine.machine_code, machine.name, machine.machine_type, machine.factory_id, machine_id),
                )
            except Exception as error:
                if "unique" in str(error).lower():
                    raise HTTPException(status_code=409, detail="Machine code already exists") from error
                raise
            row = cur.fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail="Machine not found")
            return _machine_dict(row)


@router.delete("/{machine_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(require_permission("delete_machines"))])
def delete_machine(machine_id: int) -> None:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM machines WHERE id = %s RETURNING id", (machine_id,))
            if cur.fetchone() is None:
                raise HTTPException(status_code=404, detail="Machine not found")


@router.get("/shift-reports", dependencies=[Depends(require_permission("review_shift_logs"))])
def shift_reports() -> list[dict[str, Any]]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT records.id, machines.machine_code, records.description,
                       records.status, records.created_at, records.verified_at
                FROM maintenance_records AS records
                JOIN machines ON machines.id = records.machine_id
                ORDER BY records.created_at DESC
                """
            )
            return [
                {
                    "id": row[0], "machine_code": row[1], "description": row[2],
                    "status": row[3], "created_at": row[4], "verified_at": row[5],
                }
                for row in cur.fetchall()
            ]


@router.patch("/shift-reports/{record_id}/verify", dependencies=[Depends(require_permission("review_shift_logs"))])
def verify_maintenance_record(record_id: int, user: dict[str, Any] = Depends(get_current_user)):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE maintenance_records
                SET status = 'verified', verified_by = %s, verified_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, status, verified_at
                """,
                (_user_id(user), record_id),
            )
            record = cur.fetchone()
            if record is None:
                raise HTTPException(status_code=404, detail="Maintenance record not found")
    return {"id": record[0], "status": record[1], "verified_at": record[2]}


@router.get("/{machine_id}/detail", dependencies=[Depends(require_permission("view_machines"))])
def machine_detail(machine_id: int) -> dict[str, Any]:
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, machine_code, name, machine_type, status, factory_id,
                       created_at, updated_at
                FROM machines WHERE id = %s
                """,
                (machine_id,),
            )
            machine = cur.fetchone()
            if machine is None:
                raise HTTPException(status_code=404, detail="Machine not found")
            cur.execute(
                """
                SELECT temperature, vibration, rpm, failure_probability,
                       alert_severity, scenario, recorded_at
                FROM machine_telemetry WHERE machine_id = %s
                ORDER BY recorded_at DESC LIMIT 1
                """,
                (machine_id,),
            )
            telemetry = cur.fetchone()
            cur.execute(
                """
                SELECT id, description, status, created_at, verified_at
                FROM maintenance_records WHERE machine_id = %s
                ORDER BY created_at DESC
                """,
                (machine_id,),
            )
            maintenance = cur.fetchall()

    return {
        "machine": _machine_dict(machine),
        "telemetry": None if telemetry is None else {
            "temperature": telemetry[0], "vibration": telemetry[1], "rpm": telemetry[2],
            "failure_probability": telemetry[3], "alert_severity": telemetry[4],
            "scenario": telemetry[5], "recorded_at": telemetry[6],
        },
        "maintenance_history": [
            {"id": row[0], "description": row[1], "status": row[2],
             "created_at": row[3], "verified_at": row[4]}
            for row in maintenance
        ],
    }


@router.get("/{machine_id}", dependencies=[Depends(require_permission("view_machines"))])
def get_machine(machine_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, machine_code, name, machine_type, status
                FROM machines WHERE id = %s
                """,
                (machine_id,),
            )
            row = cur.fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Machine not found")
    return row


@router.patch("/{machine_id}/state", dependencies=[Depends(require_permission("start_machines"))])
def change_machine_state(machine_id: int, request: MachineStateChange, user: dict[str, Any] = Depends(get_current_user)):
    action = request.action.strip().lower()
    permission_by_action = {
        "start": "start_machines", "stop": "stop_machines", "pause": "pause_machines",
        "resume": "resume_machines", "maintenance": "record_maintenance",
    }
    if action not in permission_by_action:
        raise HTTPException(status_code=400, detail="Unsupported machine state action")
    require_permission(permission_by_action[action])
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT status FROM machines WHERE id = %s FOR UPDATE", (machine_id,))
            row = cur.fetchone()
            if row is None:
                raise HTTPException(status_code=404, detail="Machine not found")
            next_state = STATE_TRANSITIONS[action].get(row[0])
            if next_state is None:
                raise HTTPException(status_code=409, detail=f"Cannot {action} a {row[0]} machine")
            cur.execute(
                "UPDATE machines SET status = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING status",
                (next_state, machine_id),
            )
            return {"machine_id": machine_id, "status": cur.fetchone()[0], "changed_by": _user_id(user)}


@router.post("/{machine_id}/scenarios", dependencies=[Depends(require_permission("run_scenarios"))])
def run_scenario(machine_id: int, request: ScenarioRequest, user: dict[str, Any] = Depends(get_current_user)):
    if request.action not in {"run", "inject_failure", "reset"}:
        raise HTTPException(status_code=400, detail="Unsupported scenario action")
    if request.action == "inject_failure":
        require_permission("inject_failures")
    if request.action == "reset":
        require_permission("reset_simulations")
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM machines WHERE id = %s", (machine_id,))
            if cur.fetchone() is None:
                raise HTTPException(status_code=404, detail="Machine not found")
            cur.execute(
                """
                INSERT INTO simulation_scenarios (machine_id, scenario_name, action, created_by)
                VALUES (%s, %s, %s, %s) RETURNING id, created_at
                """,
                (machine_id, request.scenario_name, request.action, _user_id(user)),
            )
            scenario_id, created_at = cur.fetchone()
            if request.action == "reset":
                cur.execute("UPDATE machines SET status = 'stopped', updated_at = CURRENT_TIMESTAMP WHERE id = %s", (machine_id,))
    return {"id": scenario_id, "machine_id": machine_id, "scenario_name": request.scenario_name,
            "action": request.action, "created_at": created_at}


@router.post("/{machine_id}/maintenance", status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_permission("record_maintenance"))])
def record_maintenance(machine_id: int, record: MaintenanceCreate, user: dict[str, Any] = Depends(get_current_user)):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM machines WHERE id = %s", (machine_id,))
            if cur.fetchone() is None:
                raise HTTPException(status_code=404, detail="Machine not found")
            cur.execute(
                """
                INSERT INTO maintenance_records (machine_id, recorded_by, description)
                VALUES (%s, %s, %s) RETURNING id, status, created_at
                """,
                (machine_id, _user_id(user), record.description),
            )
            row = cur.fetchone()
    return {"id": row[0], "machine_id": machine_id, "description": record.description,
            "status": row[1], "created_at": row[2]}


