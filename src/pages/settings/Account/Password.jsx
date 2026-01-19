import { ChevronLeft } from "lucide-react";
import React, { useState } from "react";

const Password = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const container = { background: "#fbf7f3", minHeight: "100%", padding: 24, color: "#4b332d", fontFamily: "sans-serif" };
  const header = { display: "flex", alignItems: "center", gap: 12, marginBottom: 18, };
  const sectionTitle = { fontSize: 16, fontWeight: 700, marginBottom: 8 };
  const label = { fontSize: 13, fontWeight: 600, marginBottom: 8 };
  const input = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e6e0dc", background: "white", marginBottom: 12 };
  const hint = { fontSize: 12, color: "#8b7a73", marginTop: 6 };
  const saveBtn = { marginTop: 18, background: "#C69C6D", color: "white", padding: "12px 16px", borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700, width: "100%", boxShadow: "0 6px 0 rgba(0,0,0,0.06)" };

  const validate = () => {
    // reset
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");

    let valid = true;
    if (!currentPassword) {
      setCurrentPasswordError("Please enter the correct password");
      valid = false;
    }
    if (newPassword.length < 8 || newPassword.length > 20 || !/[0-9]/.test(newPassword) || !/[A-Za-z]/.test(newPassword)) {
      setNewPasswordError("8–20 chars, letters + numbers required.");
      valid = false;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      valid = false;
    }
    return valid ? "" : "invalid";
  };

  const saveSettings = (e) => {
    e.preventDefault();
    const v = validate();
    // v === "" means valid
    if (v !== "") return;
    // Placeholder: submit password change to API
    console.log({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    alert("Password updated (placeholder)");
  };

  return (
    <div style={container}>
      <div style={header}>
        <button
          type="button"
          aria-label="back"
          onClick={() => window.history.back()}
          style={{ background: "transparent", border: "none", padding: 0 }}
        >
          <ChevronLeft className="text-primary text-xl leading-none" />
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Password</h2>
      </div>

      <form onSubmit={saveSettings} style={{ maxWidth: 420 }}>
        <div className="mt-30">
          <div className="text-primary text-lg font-semibold">Identity Verification</div>
          <div className="text-gray-400 text-sm mt-2">Avoid unauthorized</div>
          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ ...input, border: currentPasswordError ? "1px solid #e36b6b" : input.border }}
          />
          {currentPasswordError && <div style={{ color: "#c33", marginTop: 6 }}>{currentPasswordError}</div>}
        </div>

        <div className="text-pirmary text-lg font-semibolds mt-5">
          <div style={sectionTitle}>Enter New Password</div>
        </div>

        <div>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ ...input, border: newPasswordError ? "1px solid #e36b6b" : input.border }}
          />
          {/* {newPasswordError ? <div style={{ color: "#c33", marginTop: 6 }}>{newPasswordError}</div> : <div style={hint}>8–20 chars, letters + numbers required.</div>} */}
          <input
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ ...input, border: confirmPasswordError ? "1px solid #e36b6b" : input.border }}
          />
          {confirmPasswordError && <div style={{ color: "#c33", marginTop: 6 }}>{confirmPasswordError}</div>}
        </div>

        {error && <div style={{ color: "#c33", marginTop: 12 }}>{error}</div>}


        <button
          className="px-6 py-2 rounded-lg bg-[#C69C6D] text-white shadow-sm w-10/12 text-center flex items-center justify-center mx-auto mt-3"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Password;
