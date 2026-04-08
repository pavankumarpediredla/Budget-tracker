import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearAuthFeedback,
  getPendingOtpHint,
  getPendingSignupEmail,
  verifyOtp,
} from "../store/slices/authSlice";

const VerifyOtpPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, message } = useAppSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const email = getPendingSignupEmail();
  const otpHint = getPendingOtpHint();

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (message === "Account verified successfully. Please login.") {
      const timeout = window.setTimeout(() => {
        dispatch(clearAuthFeedback());
        navigate("/login", {
          state: { verifiedMessage: "OTP verified. You can login now." },
        });
      }, 1400);

      return () => window.clearTimeout(timeout);
    }
  }, [dispatch, message, navigate]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await dispatch(verifyOtp({ email, otp }));
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="muted">BudgetFlow</p>
        <h1 className="title">Verify OTP</h1>
        <p className="subtitle">Enter the OTP sent for {email}.</p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field-label">
            OTP
            <input
              className="field-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6 digit OTP"
              required
            />
          </label>

          <button className="primary-button" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {otpHint ? (
          <div className="info-banner">
            Dev OTP: <strong>{otpHint}</strong>
          </div>
        ) : null}

        {message ? <div className="success-banner">{message}</div> : null}
        {error ? <div className="error-banner">{error}</div> : null}

        <p className="subtitle">
          Want to restart? <Link to="/signup">Create new account</Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
