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
    if ((newPassword !== confirmPassword) || (confirmPassword === "" && newPassword === "")) {
      console.log(newPassword, confirmPassword);
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
    <div className="bg-ivory min-h-full p-6 text-primary font-['Roboto', sans-serif]">
      <div className="flex items-center gap-4 mb-[108px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg">Password</h2>
      </div>

      <form onSubmit={saveSettings}>
        <div className="mb-[20px]">
          <div className="text-primary text-base font-bold mb-[6px]">Identity Verification</div>
          <div className="text-custom-12 text-xs mb-[6px]">Avoid unauthorized</div>
          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={`w-full bg-white rounded-[8px] px-4 py-3 placeholder-custom-12 text-sm ${currentPasswordError ? "border border-[#d32f2f]" : "border border-[#ccc]"}`}
          // style={{ ...input, border: currentPasswordError ? "1px solid #e36b6b" : input.border }}
          />
          {currentPasswordError && <div className="text-sm text-[#d32f2f] mt-[9px] mb-[20px]">{currentPasswordError}</div>}
        </div>

        <div className="text-primary text-base font-bold mb-[6px]">
          Enter New Password
        </div>

        <div className="mb-[20px]">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`w-full bg-white rounded-[8px] px-4 py-3 placeholder-custom-12 text-sm ${newPasswordError ? "border border-[#d32f2f]" : "border border-[#ccc]"}`}
          // style={{ ...input, border: newPasswordError ? "1px solid #e36b6b" : input.border }}
          />
          {newPasswordError && <div className="text-sm text-[#d32f2f] mt-[9px] mb-[20px]">{newPasswordError}</div>}
          <input
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full bg-white rounded-[8px] px-4 py-3 placeholder-custom-12 text-sm ${confirmPasswordError ? "border border-[#d32f2f]" : "border border-[#ccc]"} mt-4`}
          // style={{ ...input, border: confirmPasswordError ? "1px solid #e36b6b" : input.border }}
          />
          {confirmPasswordError ? (
            <div className="text-sm text-[#d32f2f] mt-[9px] mb-[20px]">{confirmPasswordError}</div>
          ) : <p className="text-xs text-custom-12 mb-[70px]">Must include 8 characters, at least 1 number and 1 uppercase letter</p>}
        </div>

        {error && <div style={{ color: "#c33", marginTop: 12 }}>{error}</div>}


        <button
          className="w-[242px] mx-auto transition-all duration-150 active:scale-[0.98] active:shadow-[0_4px_10px_rgba(0,0,0,0.18)] min-h-[48px] flex items-center justify-center text-white text-base rounded-[24px] bg-[#C69C6D] py-3 shadow-[0_4px_10px_rgba(0,0,0,0.18)] mt-10"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Password;
