import { useEffect, useState } from "react";
import { getShiftReports, verifyShiftReport, type ShiftReport } from "../api/client";
import "./ShiftReports.css";

function ShiftReports() {
  const [reports, setReports] = useState<ShiftReport[]>([]);
  const [error, setError] = useState("");
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  function loadReports() {
    getShiftReports()
      .then(setReports)
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load shift reports"));
  }

  useEffect(() => {
    loadReports();
  }, []);

  async function handleVerify(reportId: number) {
    setVerifyingId(reportId);
    setError("");
    try {
      await verifyShiftReport(reportId);
      loadReports();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to verify maintenance report");
    } finally {
      setVerifyingId(null);
    }
  }

  return (
    <div className="shift-reports-page">
      <div className="page-heading">
        <div>
          <p className="page-kicker">Supervisor review</p>
          <h1>Shift reports</h1>
          <p className="page-subtitle">Maintenance reports submitted by operators from the machine workflow.</p>
        </div>
        <span className="shift-reports-count">{reports.length} reports</span>
      </div>

      {error && <p className="shift-reports-error" role="alert">{error}</p>}
      <section className="shift-reports-list" aria-label="Maintenance shift reports">
        <div className="shift-report-head"><span>Machine</span><span>Repair report</span><span>Submitted</span><span>Status</span><span /></div>
        {reports.length === 0 && <p className="shift-reports-empty">No maintenance reports have been submitted.</p>}
        {reports.map((report) => (
          <article className="shift-report-row" key={report.id}>
            <strong>{report.machine_code}</strong>
            <p>{report.description}</p>
            <time>{new Date(report.created_at).toLocaleString()}</time>
            <span className={`shift-report-status ${report.status === "verified" ? "verified" : "pending"}`}>{report.status}</span>
            {report.status === "verified" ? <span className="shift-report-verified">Verified</span> : <button type="button" onClick={() => handleVerify(report.id)} disabled={verifyingId === report.id}>{verifyingId === report.id ? "Verifying..." : "Verify"}</button>}
          </article>
        ))}
      </section>
    </div>
  );
}

export default ShiftReports;
