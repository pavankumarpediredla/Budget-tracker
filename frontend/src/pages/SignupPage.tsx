import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearAuthFeedback, signup } from "../store/slices/authSlice";

const SignupPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, message } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    occupation: "",
    company: "",
    age: "18",
    currencyCode: "INR",
  });

  useEffect(() => {
    dispatch(clearAuthFeedback());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      navigate("/verify-otp");
    }
  }, [message, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await dispatch(
      signup({
        ...formData,
        age: Number(formData.age),
      }),
    );
  };

  return (
    <div className="auth-shell">
      <div className="auth-card auth-card--wide">
        <p className="muted">BudgetFlow</p>
        <h1 className="title">Create new account</h1>
        <p className="subtitle">Fill your details, receive OTP, verify, then login.</p>

        <form className="form-stack compact-grid" onSubmit={handleSubmit}>
          <label className="field-label">
            Username
            <input className="field-input" value={formData.username} onChange={(e) => setFormData((c) => ({ ...c, username: e.target.value }))} required />
          </label>
          <label className="field-label">
            Password
            <input className="field-input" type="password" value={formData.password} onChange={(e) => setFormData((c) => ({ ...c, password: e.target.value }))} required />
          </label>
          <label className="field-label">
            Full name
            <input className="field-input" value={formData.fullName} onChange={(e) => setFormData((c) => ({ ...c, fullName: e.target.value }))} required />
          </label>
          <label className="field-label">
            Email
            <input className="field-input" type="email" value={formData.email} onChange={(e) => setFormData((c) => ({ ...c, email: e.target.value }))} required />
          </label>
          <label className="field-label">
            Phone
            <input className="field-input" value={formData.phone} onChange={(e) => setFormData((c) => ({ ...c, phone: e.target.value }))} required />
          </label>
          <label className="field-label">
            Age
            <input className="field-input" type="number" value={formData.age} onChange={(e) => setFormData((c) => ({ ...c, age: e.target.value }))} required />
          </label>
          <label className="field-label">
            Address
            <input className="field-input" value={formData.address} onChange={(e) => setFormData((c) => ({ ...c, address: e.target.value }))} required />
          </label>
          <label className="field-label">
            Occupation
            <input className="field-input" value={formData.occupation} onChange={(e) => setFormData((c) => ({ ...c, occupation: e.target.value }))} required />
          </label>
          <label className="field-label">
            Company
            <input className="field-input" value={formData.company} onChange={(e) => setFormData((c) => ({ ...c, company: e.target.value }))} required />
          </label>
          <label className="field-label">
            Currency
            <select className="field-select" value={formData.currencyCode} onChange={(e) => setFormData((c) => ({ ...c, currencyCode: e.target.value }))}>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </label>

          <button className="primary-button full-span" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sending OTP..." : "Sign up"}
          </button>
        </form>

        {error ? <div className="error-banner">{error}</div> : null}

        <p className="subtitle">
          Already verified? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
