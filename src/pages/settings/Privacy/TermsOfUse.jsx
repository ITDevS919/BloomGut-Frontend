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

  const tabsWrap = { display: "flex", gap: 8, marginBottom: 8 };
  const tab = (isActive) => ({
    padding: "8px 16px",
    borderRadius: 8,
    background: isActive ? "#cfa76f" : "white",
    color: isActive ? "white" : "#4b332d",
    fontWeight: 600,
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
    <div className="bg-ivory min-h-full p-6 text-secondary">
      <div className="flex items-center gap-4 mb-10">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-xl leading-none" />
        </button>
        <h2 className="text-xl font-semibold">Terms of Use</h2>
      </div>

      <div style={tabsWrap}>
        <button
          onClick={() => setActive("terms")}
          style={tab(active === "terms")}
          className="w-1/2"
        >
          Terms of Service
        </button>
        <button
          onClick={() => setActive("privacy")}
          style={tab(active === "privacy")}
          className="w-1/2 shadow-sm"
        >
          Privacy Policy
        </button>
      </div>

      <div style={{ color: "#8b7a73", fontSize: 12, marginBottom: 8 }}>
        Last updated: February 15, 2025
      </div>

      {active === "terms" ? (
        <>
          <div style={card}>
            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>
              Terms of Service Overview
            </h3>
            <p style={{ marginBottom: 12 }}>
              Welcome to BloomGut Health App ("App"). By using it, you agree to
              these terms.
            </p>

            <h4 style={{ fontWeight: 700, marginBottom: 6 }}>Usage License</h4>
            <p style={{ marginBottom: 12 }}>
              You may use the App but not copy, resell, distribute, or
              sublicense it.
            </p>

            <h4 style={{ fontWeight: 700, marginBottom: 6 }}>User Content</h4>
            <p style={{ marginBottom: 12 }}>
              Do not upload or share content infringing rights, harmful, or
              containing viruses/malware.
            </p>

            <h4 style={{ fontWeight: 700, marginBottom: 6 }}>
              Health Information
            </h4>
            <p style={{ marginBottom: 8 }}>
              BloomGut is for reference only, not medical advice or diagnosis.
            </p>
            <ul style={{ marginLeft: 18 }}>
              <li>User data is self-reported; accuracy not guaranteed.</li>
              <li>
                Health advice from the system is not a substitute for
                professional care.
              </li>
              <li>
                We are not liable for any actions taken based on analysis
                results.
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
          <div style={card}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              1. Data Collection
            </div>
            <p style={{ marginBottom: 8 }}>
              We collect health records, personal info (e.g., email), device
              data, and usage records to provide personalized analysis and
              service.
            </p>

            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              2. Use of Data
            </div>
            <ul style={{ marginLeft: 18, marginBottom: 8 }}>
              <li>Improve and maintain services</li>
              <li>Develop new features and personalization</li>
              <li>Analyze usage for better experience</li>
            </ul>

            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              3. Data Protection
            </div>
            <p>
              We use encryption, audits, and access control. Internet
              transmission may have risks; we'll notify you of any issues.
            </p>
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
              id="agree2"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="agree2" style={{ fontSize: 13 }}>
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
