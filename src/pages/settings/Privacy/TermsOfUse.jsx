import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useLocation } from "react-router-dom";

const TermsOfUse = () => {
  const [active, setActive] = useState("terms");
  const [agreed, setAgreed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "privacy") setActive("privacy");
    if (tab === "terms") setActive("terms");
  }, [location.search]);
  const tab = (isActive) => ({
    padding: "8px 16px",
    borderRadius: 8,
    background: isActive ? "#C69C6D" : "white",
    color: isActive ? "white" : "#4b332d",
    boxShadow: isActive
      ? "0 4px 8px rgba(0,0,0,0.06)"
      : "0 1px 2px rgba(0,0,0,0.04)",
  });
  const card = {
    background: "white",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
    marginTop: 12,
  };

  return (
    <div className="bg-ivory min-h-full p-6 text-primary font-['Noto_Sans_TC', sans-serif]">
      <style>{`
        input[type="checkbox"] {
          accent-color: #705D56;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      `}</style>
      <div className="flex items-center gap-4 mb-[42px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none" />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Terms of Use</h2>
      </div>

      <div className="flex gap-4 mb-[14px]">
        <button
          onClick={() => setActive("terms")}
          // style={tab(active === "terms")}
          className={`w-1/2 px-4 py-2 rounded-[8px] shadow-[0_6px_12px_rgba(0,0,0,0.15)] ${active === "terms" ? "bg-[#C69C6D] text-white" : "bg-white text-primary"}`}
        >
          Terms of Service
        </button>
        <button
          onClick={() => setActive("privacy")}
          // style={tab(active === "privacy")}
          className={`w-1/2 px-4 py-2 rounded-[8px] shadow-[0_6px_12px_rgba(0,0,0,0.15)] ${active === "privacy" ? "bg-[#C69C6D] text-white" : "bg-white text-primary"}`}
        >
          Privacy Policy
        </button>
      </div>

      <div style={{ color: "#9e9e9e", fontSize: "12px", marginBottom: "20px" }}>
        Last updated: February 15, 2025
      </div>

      {active === "terms" ? (
        <>
          <div className="bg-white rounded-[8px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-[20px]">
            <h3 className="text-primary font-bold text-sm">
              Terms of Service Overview
            </h3>
            <p className="mb-[9px] text-primary text-sm">
              Welcome to BloomGut Health App ("App"). By using it, you agree to
              these terms.
            </p>

            <h4 className="text-primary font-bold text-sm mb-[9px]">Usage License</h4>
            <p className="mb-[10px] text-primary text-sm">
              You may use the App but not copy, resell, distribute, or
              sublicense it.
            </p>

            <h4 className="text-primary font-bold text-sm mb-[9px]">User Content</h4>
            <p className="mb-[10px] text-primary text-sm">
              Do not upload or share content infringing rights, harmful, or
              containing viruses/malware.
            </p>

            <h4 className="text-primary font-bold text-sm mb-[9px]">
              Health Information
            </h4>
            <p className="mb-[10px] text-primary text-sm">
              BloomGut is for reference only, not medical advice or diagnosis.
            </p>
            <ul className="list-none space-y-2 text-sm text-primary">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#705D56] mt-1.5 shrink-0"></span>
                <span>User data is self-reported; accuracy not guaranteed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#705D56] mt-1.5 shrink-0"></span>
                <span>Health advice from the system is not a substitute for professional care.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#705D56] mt-1.5 shrink-0"></span>
                <span>We are not liable for any actions taken based on analysis results.</span>
              </li>
            </ul>
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              id="agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="agree" style={{ fontSize: 13 }}>
              I agree to the terms & privacy policy and will not engage in
              illegal or improper conduct.
            </label>
          </div>
        </>
      ) : (
        <>
          <div className="bg-white rounded-[8px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-[20px]">
            <div className="text-primary mb-[7px] text-sm">
              1. Data Collection
            </div>
            <p className="mb-5 text-sm">
              We collect health records, personal info (e.g., email), device
              data, and usage records to provide personalized analysis and
              service.
            </p>

            <div className="text-primary mb-[9px] text-sm">
              2. Use of Data
            </div>
            <ul className="list-none space-y-3 text-sm text-primary mb-[17px]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#705D56] mt-1.5 shrink-0"></span>
                <span>Improve and maintain services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#705D56] mt-1.5 shrink-0"></span>
                <span>Develop new features and personalization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#705D56] mt-1.5 shrink-0"></span>
                <span>Analyze usage for better experience</span>
              </li>
            </ul>

            <div className="text-primary mb-[7px] text-sm">
              3. Data Protection
            </div>
            <p className="text-sm">
              We use encryption, audits, and access control. Internet
              transmission may have risks; we'll notify you of any issues.
            </p>
          </div>

          <div className="p-2 flex items-center justify-center gap-[8px]">
            <input
              id="agree2"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="agree2" style={{ fontSize: "12px" }} className="text-secondary flex items-center justify-center">
              I agree to the Service Terms & Privacy Policy and understand the
              data use.
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default TermsOfUse;
