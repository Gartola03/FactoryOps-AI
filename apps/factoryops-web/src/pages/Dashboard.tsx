import { useEffect, useState } from "react";
import { getHealth } from "../api/client";

function Dashboard() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    getHealth()
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("API unavailable"));
  }, []);

  return (
    <div>
      <h1>Factory Status</h1>
      <p>API Status: {status}</p>

      <section>
        <h2>Machines</h2>
        <p>24</p>
      </section>

      <section>
        <h2>Running</h2>
        <p>19</p>
      </section>

      <section>
        <h2>Warnings</h2>
        <p>3</p>
      </section>

      <section>
        <h2>Critical</h2>
        <p>2</p>
      </section>

      <section>
        <h2>Production</h2>
        <p>94%</p>
      </section>

      <section>
        <h2>Critical Alerts</h2>
        <p>CNC-03 — Temperature high</p>
        <p>Press-07 — Vibration abnormal</p>
      </section>
    </div>
  );
}

export default Dashboard;