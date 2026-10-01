import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import heroImage from "../assets/hero.png";
import { login } from "../api/client";
import { AUTH_KEY, ROLE_KEY, isAuthenticated } from "../auth/permissions";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await login(email.trim(), password);
      sessionStorage.setItem(AUTH_KEY, "true");
      sessionStorage.setItem("factoryops-access-token", response.access_token);
      sessionStorage.setItem(ROLE_KEY, response.user.role ?? "user");
      navigate("/dashboard", { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel" aria-label="FactoryOps overview">
        <div className="login-brand-content">
          <div className="brand-lockup">
            <span className="brand-mark">FO</span>
            <span>FactoryOps AI</span>
          </div>
          <p className="login-eyebrow">Industrial intelligence platform</p>
          <h1>Keep every production line in sight.</h1>
          <p className="login-intro">
            Connect your teams to the signals, machines, and decisions that keep the factory moving.
          </p>
        </div>
        <img className="login-hero" src={heroImage} alt="Layered FactoryOps brand mark" />
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrap">
          <p className="login-kicker">Welcome back</p>
          <h2>Sign in to your workspace</h2>
          <p className="login-description">Access your factory operations dashboard.</p>

          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Work email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <div className="password-label-row">
              <label htmlFor="password">Password</label>
              <button className="forgot-password" type="button" onClick={() => setError("Password recovery will be available with backend authentication.")}>
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {error && <p className="login-error" role="alert">{error}</p>}

            <button className="login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Checking credentials..." : "Enter workspace"} <span aria-hidden="true">-&gt;</span>
            </button>
          </form>

          <p className="login-footer">FactoryOps AI <span aria-hidden="true">/</span> Operations control center</p>
        </div>
      </section>
    </main>
  );
}

export default Login;