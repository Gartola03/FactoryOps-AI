import "./Machine.css";

function Machines() {
  return (
    <div className="machines-page">
      <div className="page-heading machine-heading">
        <div>
          <p className="page-kicker">Asset registry</p>
          <h1>Machines</h1>
          <p className="page-subtitle">Monitor equipment health and current production state.</p>
        </div>
        <button className="machine-action" type="button">+ Add machine</button>
      </div>

      <div className="machine-toolbar">
        <span className="machine-total"><strong>24</strong> total assets</span>
        <span className="machine-filter active">All machines</span>
        <span className="machine-filter">Needs attention <b>3</b></span>
      </div>

      <section className="machine-list">
        <div className="machine-list-head"><span>Machine</span><span>Type</span><span>Health</span><span>Status</span><span>Last signal</span></div>
        <div className="machine-row"><div><strong>CNC-03</strong><small>Line A / Station 03</small></div><span>CNC mill</span><span className="health health-warning">72%</span><span className="machine-status status-warning">Warning</span><span>4 min ago</span></div>
        <div className="machine-row"><div><strong>Press-07</strong><small>Line B / Station 07</small></div><span>Hydraulic press</span><span className="health health-critical">48%</span><span className="machine-status status-critical">Critical</span><span>18 min ago</span></div>
        <div className="machine-row"><div><strong>Robot-12</strong><small>Assembly / Cell 02</small></div><span>Robotic arm</span><span className="health health-good">98%</span><span className="machine-status status-good">Running</span><span>Just now</span></div>
        <div className="machine-row"><div><strong>Lathe-04</strong><small>Line A / Station 04</small></div><span>Precision lathe</span><span className="health health-good">91%</span><span className="machine-status status-good">Running</span><span>2 min ago</span></div>
      </section>
    </div>
  );
}

export default Machines;