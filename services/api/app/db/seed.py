from app.db.session import SessionLocal
from app.models.machine import Machine


def seed():
    db = SessionLocal()

    try:
        machine = Machine(
            machine_code="PUMP-005",
            name="Main Cooling Pump",
            status="STOPPED",
        )

        db.add(machine)
        db.commit()

        print("Seed data created.")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
