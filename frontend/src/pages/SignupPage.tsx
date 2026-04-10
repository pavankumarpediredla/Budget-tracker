import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearAuthFeedback, signup } from "../store/slices/authSlice";

const designationOptions = [
  "Government Servant",
  "Software Developer",
  "Software Engineer",
  "Teacher",
  "Doctor",
  "Nurse",
  "Accountant",
  "Bank Employee",
  "Sales Executive",
  "Business Owner",
  "Plumber",
  "Carpenter",
  "Electrician",
  "Mechanic",
  "Student",
  "Homemaker",
  "Other",
] as const;

const SignupPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, message } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: "Mr",
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    occupation: "Software Engineer",
    occupationOther: "",
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
        title: formData.title,
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        occupation: formData.occupation === "Other" ? formData.occupationOther : formData.occupation,
        company: formData.company,
        age: Number(formData.age),
        currencyCode: formData.currencyCode,
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
            Title
            <select className="field-select" value={formData.title} onChange={(e) => setFormData((c) => ({ ...c, title: e.target.value }))}>
              <option value="Mr">Mr</option>
              <option value="Ms">Ms</option>
              <option value="Mrs">Mrs</option>
              <option value="Mx">Mx</option>
            </select>
          </label>
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
            <input className="field-input" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={formData.phone} onChange={(e) => setFormData((c) => ({ ...c, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} required />
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
            Designation
            <select className="field-select" value={formData.occupation} onChange={(e) => setFormData((c) => ({ ...c, occupation: e.target.value }))}>
              {designationOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          {formData.occupation === "Other" ? (
            <label className="field-label">
              Enter designation
              <input className="field-input" value={formData.occupationOther} onChange={(e) => setFormData((c) => ({ ...c, occupationOther: e.target.value }))} required />
            </label>
          ) : null}
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
