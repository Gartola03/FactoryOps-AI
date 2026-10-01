import { useEffect, useState } from "react";
import { getHealth } from "../api/client";
import "./Dashboard.css";

function Dashboard() {
  const [status, setStatus] = useState("Connecting...");

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

    // 1. Initial check immediately on load
    checkHealth();

    // 2. Poll the API every 5000ms (5 seconds)
    const intervalId = setInterval(checkHealth, 5000);

    // 3. Cleanup interval on unmount
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

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
          <p className="page-kicker">Thursday, 01 October 2026</p>
          <h1>Factory overview</h1>
          <p className="page-subtitle">A live view of production health across your floor.</p>
        </div>
        <div className={`api-pill ${getStatusClass()}`}>
          <span className="api-pill-dot" /> API: {status}
        </div>
      </div>

      <section className="metric-grid" aria-label="Factory metrics">
        <article className="metric-card metric-card-primary">
          <p>Production output</p>
          <strong>94<span>%</span></strong>
          <small><span className="trend-up">+6.4%</span> vs last shift</small>
          <div className="metric-sparkline"><i /><i /><i /><i /><i /><i /><i /><i /></div>
        </article>
        <article className="metric-card">
          <p>Machines online</p>
          <strong>19<span>/24</span></strong>
          <small><span className="trend-up">+2</span> since 06:00</small>
          <div className="machine-progress"><span /></div>
        </article>
        <article className="metric-card">
          <p>Active warnings</p>
          <strong>03</strong>
          <small className="muted-copy">Requires attention</small>
          <div className="warning-bars"><i /><i /><i /><i /><i /></div>
        </article>
        <article className="metric-card metric-card-alert">
          <p>Critical alerts</p>
          <strong>02</strong>
          <small>Immediate review needed</small>
          <div className="alert-line" />
        </article>
      </section>

      <div className="dashboard-lower-grid">
        <section className="panel production-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Performance</p>
              <h2>Production rhythm</h2>
            </div>
            <span className="panel-period">Last 8 hours</span>
          </div>
          <div className="chart-wrap" aria-label="Production performance chart">
            <div className="chart-y-axis"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div>
            <div className="chart-area">
              <div className="chart-grid-lines"><i /><i /><i /><i /><i /></div>
              <svg viewBox="0 0 600 190" role="img" aria-label="Production output rising to 94 percent">
                <defs><linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#9b59e8" stopOpacity=".28" /><stop offset="1" stopColor="#9b59e8" stopOpacity="0" /></linearGradient></defs>
                <path d="M0 150 C45 142, 52 120, 95 128 S145 110, 180 116 S230 92, 265 101 S314 70, 350 83 S395 60, 430 72 S475 44, 510 54 S560 29, 600 35 L600 190 L0 190 Z" fill="url(#area-fill)" />
                <path d="M0 150 C45 142, 52 120, 95 128 S145 110, 180 116 S230 92, 265 101 S314 70, 350 83 S395 60, 430 72 S475 44, 510 54 S560 29, 600 35" fill="none" stroke="#8a48d6" strokeWidth="3" />
              </svg>
              <div className="chart-x-axis"><span>06:00</span><span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span></div>
            </div>
          </div>
        </section>

        <section className="panel alerts-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Needs attention</p>
              <h2>Critical alerts</h2>
            </div>
            <span className="alert-count">02</span>
          </div>
          <div className="alert-item"><span className="alert-icon">!</span><div><strong>CNC-03</strong><p>Temperature high</p></div><time>4m</time></div>
          <div className="alert-item"><span className="alert-icon">!</span><div><strong>Press-07</strong><p>Vibration abnormal</p></div><time>18m</time></div>
          <button className="panel-link" type="button">View all events <span>-&gt;</span></button>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;