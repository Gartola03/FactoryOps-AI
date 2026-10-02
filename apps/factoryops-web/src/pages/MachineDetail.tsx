import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMachineDetail, type MachineDetail as MachineDetailData } from "../api/client";
import { hasPermission } from "../auth/permissions";
import "./MachineDetail.css";

function displayValue(value: number | string | null | undefined, suffix = "") {
  return value === null || value === undefined ? "No data" : `${value}${suffix}`;
}

function MachineDetail() {
  const { machineId } = useParams();
  const [data, setData] = useState<MachineDetailData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const parsedMachineId = Number(machineId);
    if (!Number.isInteger(parsedMachineId)) {
      setError("Invalid machine identifier");
      return;
    }

    getMachineDetail(parsedMachineId)
      .then(setData)
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load machine"));
  }, [machineId]);

  if (error) {
    return <div className="machine-detail-page"><p className="machine-detail-error">{error}</p></div>;
  }

  if (!data) {
    return <div className="machine-detail-page"><p className="machine-detail-loading">Loading machine data...</p></div>;
  }

  const { machine, telemetry, maintenance_history: maintenanceHistory } = data;
  const statusClass = ["warning", "critical", "failed"].includes(machine.status.toLowerCase())
    ? "machine-detail-state machine-detail-state-alert"
    : "machine-detail-state";

  return (
    <div className="machine-detail-page">
      <Link className="machine-detail-back" to="/machines">&lt;- All machines</Link>
      <div className="page-heading">
        <div>
          <p className="page-kicker">Machine detail / {machine.machine_type}</p>
          <h1>{machine.machine_code}</h1>
          <p className="page-subtitle">{machine.name}</p>
        </div>
        <span className={statusClass}>{machine.status}</span>
      </div>

      <section className="machine-detail-metrics" aria-label="Machine telemetry summary">
        <article><span>Temperature</span><strong>{displayValue(telemetry?.temperature, "°C")}</strong><small>Latest recorded value</small></article>
        <article><span>Vibration</span><strong>{displayValue(telemetry?.vibration, " mm/s")}</strong><small>Latest recorded value</small></article>
        <article><span>RPM</span><strong>{displayValue(telemetry?.rpm)}</strong><small>Latest recorded value</small></article>
        <article><span>Failure probability</span><strong>{displayValue(telemetry?.failure_probability, "%")}</strong><small className="metric-critical">Model output</small></article>
      </section>

      <section className="machine-detail-grid">
        <article className="machine-detail-panel">
          <p className="panel-label">Current signals</p>
          <h2>Latest telemetry</h2>
          <div className="signal-data-list">
            <span>Scenario <strong>{telemetry?.scenario || "No active scenario"}</strong></span>
            <span>Alert severity <strong>{telemetry?.alert_severity || "No active alert"}</strong></span>
            <span>Recorded <strong>{telemetry ? new Date(telemetry.recorded_at).toLocaleString() : "No telemetry recorded"}</strong></span>
          </div>
        </article>
        <article className="machine-detail-panel">
          <p className="panel-label">Active alert</p>
          <h2>{telemetry?.alert_severity || "No active alert"}</h2>
          <p className="machine-detail-copy">
            {telemetry?.scenario ? `Scenario: ${telemetry.scenario}` : "This machine has no active scenario or alert recorded."}
          </p>
          {hasPermission("use_copilot") && <Link className="detail-panel-link" to="/copilot">Ask AI Copilot <span>-&gt;</span></Link>}
        </article>
        <article className="machine-detail-panel machine-detail-history">
          <p className="panel-label">Maintenance history</p>
          <h2>{maintenanceHistory.length} records</h2>
          {maintenanceHistory.length === 0 ? <p className="machine-detail-copy">No maintenance records found.</p> : maintenanceHistory.map((record) => (
            <div className="history-entry" key={record.id}>
              <strong>{record.description}</strong>
              <span>{new Date(record.created_at).toLocaleString()} / {record.status}</span>
            </div>
          ))}
          {hasPermission("record_maintenance") && <Link className="detail-panel-button" to={`/machines/${machine.id}/maintenance`}>Record maintenance <span>-&gt;</span></Link>}
        </article>
      </section>
    </div>
  );
}

export default MachineDetail;
