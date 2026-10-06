import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Machines from "./pages/Machine";
import MachineDetail from "./pages/MachineDetail.tsx";
import MaintenanceLog from "./pages/MaintenanceLog";
import ShiftReports from "./pages/ShiftReports.tsx";
import Dashboard from "./pages/Dashboard";
import Scenes from "./pages/Scenes";
import Login from "./pages/Login";
import RoleScreen from "./pages/RoleScreen";
import Copilot from "./pages/Copilot";
import AdminSettings from "./pages/AdminSettings";
import { canAccess, getDefaultRoute, isAuthenticated } from "./auth/permissions";

import './App.css'

function ProtectedLayout() {
  return isAuthenticated() ? <DashboardLayout /> : <Navigate to="/login" replace />;
}

function RequireAccess({ path, children }: { path: string; children: React.ReactNode }) {
  return canAccess(path) ? children : <Navigate to={getDefaultRoute()} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/machines" element={<RequireAccess path="/machines"><Machines /></RequireAccess>} />
          <Route path="/machines/:machineId" element={<RequireAccess path="/machines"><MachineDetail /></RequireAccess>} />
          <Route path="/machines/:machineId/maintenance" element={<RequireAccess path="/maintenance"><MaintenanceLog /></RequireAccess>} />
          <Route path="/telemetry" element={<RequireAccess path="/telemetry"><RoleScreen path="/telemetry" title="Live telemetry" description="Inspect current machine signals and operating state." /></RequireAccess>} />
          <Route path="/predictions" element={<RequireAccess path="/predictions"><RoleScreen path="/predictions" title="Failure predictions" description="Review risk signals and prioritize machines for investigation." /></RequireAccess>} />
          <Route path="/maintenance" element={<RequireAccess path="/maintenance"><RoleScreen path="/maintenance" title="Maintenance history" description="Review completed work and record the next maintenance action." /></RequireAccess>} />
          <Route path="/investigations" element={<RequireAccess path="/investigations"><RoleScreen path="/investigations" title="Machine investigations" description="Bring telemetry, alerts, predictions, and history together for a machine review." /></RequireAccess>} />
          <Route path="/copilot" element={<RequireAccess path="/copilot"><Copilot /></RequireAccess>} />
          <Route path="/scenes" element={<RequireAccess path="/scenes"><Scenes /></RequireAccess>} />
          <Route path="/shift-logs" element={<RequireAccess path="/shift-logs"><ShiftReports /></RequireAccess>} />
          <Route path="/admin/users" element={<RequireAccess path="/admin/users"><AdminSettings initialTab="users" /></RequireAccess>} />
          <Route path="/admin/roles" element={<Navigate to="/admin/users" replace />} />
          <Route path="/admin/factory" element={<RequireAccess path="/admin/factory"><AdminSettings initialTab="factory" /></RequireAccess>} />
          <Route path="/events" element={<Navigate to="/alerts" replace />} />
          <Route path="/settings" element={<Navigate to="/admin/factory" replace />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App
