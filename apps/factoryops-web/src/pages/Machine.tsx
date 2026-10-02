import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createMachine, deleteMachine, getMachines, updateMachine, type Machine as MachineRecord, type MachineInput } from "../api/client";
import "./Machine.css";
import { hasPermission } from "../auth/permissions";

type MachineFormProps = {
  machine: MachineRecord | null;
  onCancel: () => void;
  onSubmit: (input: MachineInput) => Promise<void>;
};

function MachineForm({ machine, onCancel, onSubmit }: MachineFormProps) {
  const [form, setForm] = useState<MachineInput>({
    machine_code: machine?.machine_code ?? "",
    name: machine?.name ?? "",
    machine_type: machine?.machine_type ?? "",
    factory_id: machine?.factory_id ?? null,
  });
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="machine-form" onSubmit={handleSubmit}>
      <div><label htmlFor="machine-code">Machine code</label><input id="machine-code" required value={form.machine_code} onChange={(event) => setForm({ ...form, machine_code: event.target.value })} /></div>
      <div><label htmlFor="machine-name">Name</label><input id="machine-name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
      <div><label htmlFor="machine-type">Type</label><input id="machine-type" required value={form.machine_type} onChange={(event) => setForm({ ...form, machine_type: event.target.value })} /></div>
      <div><label htmlFor="factory-id">Factory ID</label><input id="factory-id" type="number" value={form.factory_id ?? ""} onChange={(event) => setForm({ ...form, factory_id: event.target.value ? Number(event.target.value) : null })} /></div>
      <div className="machine-form-actions"><button type="button" onClick={onCancel}>Cancel</button><button className="machine-action" type="submit" disabled={isSaving}>{isSaving ? "Saving..." : machine ? "Save changes" : "Create machine"}</button></div>
    </form>
  );
}

function Machines() {
  const [machines, setMachines] = useState<MachineRecord[]>([]);
  const [showAttention, setShowAttention] = useState(false);
  const [error, setError] = useState("");
  const [formMachine, setFormMachine] = useState<MachineRecord | null | undefined>(undefined);
  const canManageMachines = hasPermission("update_machines") || hasPermission("delete_machines");

  useEffect(() => {
    getMachines()
      .then(setMachines)
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load machines"));
  }, []);

  const visibleMachines = showAttention
    ? machines.filter((machine) => ["warning", "critical", "failed"].includes(machine.status.toLowerCase()))
    : machines;
  const attentionCount = machines.filter((machine) => ["warning", "critical", "failed"].includes(machine.status.toLowerCase())).length;

  function formatDate(value: string) {
    return new Date(value).toLocaleString();
  }

  async function saveMachine(input: MachineInput) {
    try {
      const savedMachine = formMachine ? await updateMachine(formMachine.id, input) : await createMachine(input);
      setMachines((current) => formMachine
        ? current.map((machine) => machine.id === savedMachine.id ? savedMachine : machine)
        : [...current, savedMachine]);
      setFormMachine(undefined);
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save machine");
    }
  }

  async function removeMachine(machine: MachineRecord) {
    if (!window.confirm(`Delete ${machine.machine_code}?`)) return;
    try {
      await deleteMachine(machine.id);
      setMachines((current) => current.filter((item) => item.id !== machine.id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete machine");
    }
  }

  return (
    <div className="machines-page">
      <div className="page-heading machine-heading">
        <div>
          <p className="page-kicker">Asset registry</p>
          <h1>Machines</h1>
          <p className="page-subtitle">Monitor equipment health and current production state.</p>
        </div>
        {hasPermission("create_machines") && <button className="machine-action" type="button" onClick={() => setFormMachine(null)}>+ Add machine</button>}
      </div>

      {formMachine !== undefined && <MachineForm machine={formMachine} onCancel={() => setFormMachine(undefined)} onSubmit={saveMachine} />}

      <div className="machine-toolbar">
        <span className="machine-total"><strong>{machines.length}</strong> total assets</span>
        <button className={`machine-filter ${!showAttention ? "active" : ""}`} type="button" onClick={() => setShowAttention(false)}>All machines</button>
        <button className={`machine-filter ${showAttention ? "active" : ""}`} type="button" onClick={() => setShowAttention(true)}>Needs attention <b>{attentionCount}</b></button>
      </div>

      <section className="machine-list">
        <div className="machine-list-head"><span>Machine</span><span>Type</span><span>Health</span><span>Status</span><span>Last signal</span>{canManageMachines && <span>Actions</span>}</div>
        {error && <p className="machine-empty">{error}</p>}
        {!error && machines.length === 0 && <p className="machine-empty">No machines found in the database.</p>}
        {visibleMachines.map((machine) => {
          const status = machine.status.toLowerCase();
          const statusClass = ["warning", "critical", "failed"].includes(status) ? "status-warning" : "status-good";
          return (
            <div className="machine-row" key={machine.id}>
              <Link className="machine-row-machine" to={`/machines/${machine.id}`}><strong>{machine.machine_code}</strong><small>{machine.name}</small></Link>
              <span>{machine.machine_type}</span>
              <span className="health">-</span>
              <span className={`machine-status ${statusClass}`}>{machine.status}</span>
              <span>{formatDate(machine.updated_at)}</span>
              {canManageMachines && <div className="machine-row-actions"><button type="button" onClick={() => setFormMachine(machine)}>Edit</button><button type="button" onClick={() => removeMachine(machine)}>Delete</button></div>}
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default Machines;