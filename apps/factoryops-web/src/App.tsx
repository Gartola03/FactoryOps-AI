import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Machines from "./pages/Machine";
import Dashboard from "./pages/Dashboard";
import Scenes from "./pages/Scenes";
import Events from "./pages/Events";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
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
          <Route path="/machines" element={<Machines />} />
          <Route path="/scenes" element={<RequireAccess path="/scenes"><Scenes /></RequireAccess>} />
          <Route path="/events" element={<RequireAccess path="/events"><Events /></RequireAccess>} />
          <Route path="/settings" element={<RequireAccess path="/settings"><Settings /></RequireAccess>} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App
