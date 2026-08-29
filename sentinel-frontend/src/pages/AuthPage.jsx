import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { Shield } from "lucide-react";

export const AuthPage = () => {
  const { login } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) {
      errs.username = "Username is required";
    }
    if (!isLoginMode) {
      if (!formData.email.trim()) {
        errs.email = "Email address is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errs.email = "Invalid email format";
      }
    }
    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);

    // Sanitize unique fields to lowercase
    const payload = {
      ...formData,
      username: formData.username.trim().toLowerCase(),
      email: formData.email ? formData.email.trim().toLowerCase() : undefined,
    };

    try {
      if (isLoginMode) {
        const response = await API.post("/auth/login", {
          username: payload.username,
          password: payload.password,
        });
        login(response.data);
      } else {
        await API.post("/auth/register", payload);
        setIsLoginMode(true);
        alert("Registration successful! Please sign in.");
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--sentinelcore-bg-dark)",
      }}
    >
      <div className="form-panel" style={{ width: "380px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <Shield size={28} color="#52c41a" />
          <h2 style={{ color: "#52c41a", margin: 0 }}>sentinelcore </h2>
        </div>
        <h3
          style={{ textAlign: "center", marginBottom: "20px", color: "#fff" }}
        >
          {isLoginMode ? "Sign In to   SOC" : "Register SOC Account"}
        </h3>

        {apiError && (
          <div
            className="field-error-msg"
            style={{ textAlign: "center", marginBottom: "10px" }}
          >
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field" style={{ marginBottom: "14px" }}>
            <label>Username</label>
            <input
              type="text"
              className={`form-input ${errors.username ? "is-invalid" : ""}`}
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            {errors.username && (
              <span className="field-error-msg">{errors.username}</span>
            )}
          </div>

          {!isLoginMode && (
            <div className="form-field" style={{ marginBottom: "14px" }}>
              <label>Email Address</label>
              <input
                type="email"
                className={`form-input ${errors.email ? "is-invalid" : ""}`}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && (
                <span className="field-error-msg">{errors.email}</span>
              )}
            </div>
          )}

          <div className="form-field" style={{ marginBottom: "18px" }}>
            <label>Password</label>
            <input
              type="password"
              className={`form-input ${errors.password ? "is-invalid" : ""}`}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && (
              <span className="field-error-msg">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Processing..." : isLoginMode ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "16px",
            fontSize: "0.85rem",
            color: "var(--sentinelcore-blue)",
            cursor: "pointer",
          }}
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setErrors({});
            setApiError("");
          }}
        >
          {isLoginMode
            ? "Don't have an account? Sign Up"
            : "Already registered? Sign In"}
        </p>
      </div>
    </div>
  );
};
