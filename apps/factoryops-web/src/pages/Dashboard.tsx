import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHealth, getMachines, type Machine } from "../api/client";
import "./Dashboard.css";

function Dashboard() {
  const [status, setStatus] = useState("Connecting...");
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    let isMounted = true;

    const checkHealth = () => {
      getHealth()
        .then((data) => {
          if (isMounted) setStatus(data.status || "healthy");
        })
        .catch(() => {
          if (isMounted) setStatus("API unavailable");
        });
    };

    const loadMachines = () => {
      getMachines()
        .then((data) => {
          if (isMounted) setMachines(data);
        })
        .catch(() => {
          if (isMounted) setMachines([]);
        });
    };

    // 1. Initial check immediately on load
    checkHealth();
    loadMachines();

    // 2. Poll the API every 5000ms (5 seconds)
    const intervalId = setInterval(() => {
      checkHealth();
      loadMachines();
    }, 5000);

    // 3. Cleanup interval on unmount
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const onlineMachines = machines.filter((machine) => ["running", "paused"].includes(machine.status.toLowerCase()));
  const attentionMachines = machines.filter((machine) => ["warning", "critical", "failed"].includes(machine.status.toLowerCase()));
  const criticalMachines = machines.filter((machine) => ["critical", "failed"].includes(machine.status.toLowerCase()));

  // Helper class to style the status pill dynamically (optional)
  const getStatusClass = () => {
    if (status === "healthy" || status === "ok") return "status-online";
    if (status === "Connecting...") return "status-pending";
    return "status-offline";
  };

  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <div>
          <h1>Factory overview</h1>
          <p className="page-subtitle">A live view of production health across your floor.</p>
        </div>
        <div className={`api-pill ${getStatusClass()}`}>
          <span className="api-pill-dot" /> API: {status}
        </div>
      </div>

      <section className="metric-grid" aria-label="Factory metrics">
        <article className="metric-card metric-card-primary">
            <p>Factory machines</p>
          <strong>{machines.length}</strong>
          <small>Records in database</small>
          <div className="metric-sparkline"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        </article>
        <article className="metric-card">
          <p>Machines online</p>
          <strong>{onlineMachines.length}<span>/{machines.length}</span></strong>
          <small>Running or paused</small>
          <div className="machine-progress"><span /></div>
        </article>
        <article className="metric-card">
          <p>Active warnings</p>
          <strong>{attentionMachines.length}</strong>
          <small className="muted-copy">Requires attention</small>
          <div className="warning-bars"><i /><i /><i /><i /><i /></div>
        </article>
        <article className="metric-card metric-card-alert">
          <p>Critical alerts</p>
          <strong>{criticalMachines.length}</strong>
          <small>Immediate review needed</small>
          <div className="alert-line" />
        </article>
      </section>

      <div className="dashboard-lower-grid">
        <section className="panel production-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Live inventory</p>
              <h2>Machine states</h2>
            </div>
            <span className="panel-period">Database</span>
          </div>
          <div className="dashboard-state-list">
            {["running", "paused", "stopped", "failed"].map((state) => {
              const count = machines.filter((machine) => machine.status.toLowerCase() === state).length;
              return <div className="dashboard-state-row" key={state}><span>{state}</span><strong>{count}</strong></div>;
            })}
          </div>
        </section>

        <section className="panel alerts-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Needs attention</p>
              <h2>Critical alerts</h2>
            </div>
            <span className="alert-count">{attentionMachines.length}</span>
          </div>
          {attentionMachines.length === 0 ? <p className="dashboard-empty">No machines require attention.</p> : attentionMachines.slice(0, 4).map((machine) => (
            <Link className="alert-item" to={`/machines/${machine.id}`} key={machine.id}><span className="alert-icon">!</span><div><strong>{machine.machine_code}</strong><p>{machine.status}</p></div><time>{new Date(machine.updated_at).toLocaleDateString()}</time></Link>
          ))}
          <Link className="panel-link" to="/machines">View machines <span>-&gt;</span></Link>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;