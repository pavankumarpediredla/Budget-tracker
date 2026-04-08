import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearAuthFeedback, login } from "../store/slices/authSlice";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, error, status } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("demo123");
  const verifiedMessage = (location.state as { verifiedMessage?: string } | null)?.verifiedMessage ?? "";

  useEffect(() => {
    dispatch(clearAuthFeedback());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate, token]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await dispatch(login({ username, password }));
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="muted">BudgetFlow</p>
        <h1 className="title">Manage your money every day.</h1>
        <p className="subtitle">
          Simple mobile-first budget tracking with income, expenses, and savings insights.
        </p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field-label">
            Username
            <input
              className="field-input"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
            />
          </label>

          <label className="field-label">
            Password
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
            />
          </label>

          <button className="primary-button" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {error ? <div className="error-banner">{error}</div> : null}
        {verifiedMessage ? <div className="success-banner">{verifiedMessage}</div> : null}

        <p className="subtitle">
          Demo login: <strong>demo</strong> / <strong>demo123</strong>
        </p>

        <p className="subtitle">
          New here? <Link to="/signup">Create new account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
