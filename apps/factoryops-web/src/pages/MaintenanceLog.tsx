import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getMachineDetail, recordMaintenance, type MachineDetail } from "../api/client";
import "./MaintenanceLog.css";

function MaintenanceLog() {
  const { machineId } = useParams();
  const navigate = useNavigate();
  const [machine, setMachine] = useState<MachineDetail["machine"] | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const parsedMachineId = Number(machineId);
    if (!Number.isInteger(parsedMachineId)) {
      setError("Invalid machine identifier");
      return;
    }

    getMachineDetail(parsedMachineId)
      .then((data) => setMachine(data.machine))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load machine"));
  }, [machineId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedMachineId = Number(machineId);
    if (!Number.isInteger(parsedMachineId) || !description.trim()) {
      setError("Describe the completed repair before submitting.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await recordMaintenance(parsedMachineId, description.trim());
      navigate(`/machines/${parsedMachineId}`, { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save maintenance record");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (error && !machine) {
    return <div className="maintenance-log-page"><p className="maintenance-log-error">{error}</p></div>;
  }

  return (
    <div className="maintenance-log-page">
      <Link className="maintenance-log-back" to={`/machines/${machineId}`}>&lt;- Machine detail</Link>
      <div className="page-heading">
        <div>
          <p className="page-kicker">Maintenance record</p>
          <h1>Log completed repair</h1>
          <p className="page-subtitle">Submit the work completed on {machine?.machine_code || "this machine"} for the shift record.</p>
        </div>
        <span className="maintenance-log-badge">Operator action</span>
      </div>

      <form className="maintenance-log-form" onSubmit={handleSubmit}>
        <label htmlFor="maintenance-description">Repair summary</label>
        <textarea
          id="maintenance-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the inspection, repair, replaced part, or follow-up required."
          rows={8}
          required
        />
        {error && <p className="maintenance-log-error" role="alert">{error}</p>}
        <div className="maintenance-log-actions">
          <Link className="maintenance-log-cancel" to={`/machines/${machineId}`}>Cancel</Link>
          <button className="maintenance-log-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit maintenance log"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MaintenanceLog;
