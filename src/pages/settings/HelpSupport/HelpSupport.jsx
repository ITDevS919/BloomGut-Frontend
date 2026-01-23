import { useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HelpSupport = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    "No verification email received ?",
    "Reset forgotten password?",
    "How to edit or delete records?",
    "Health trend not updating ?",
    "CSV/Excel files won't open ?",
    "Restore deleted data ?",
    "Data loss after phone change/reinstall ?",
    "Features not unlocked after upgrade?",
    "One-time or auto subscription ?",
  ];

  const answers = [
    [
      "Please check your spam/junk folder.",
      "Confirm the email address used for registration.",
      "If still not received, request resend from settings.",
    ],
    [
      "Use the 'Forgot password' flow on the login screen.",
      "If you don't receive reset email, check spam folder.",
    ],
    [
      "Open the Records screen and tap the item to edit.",
      "Swipe left on an item to reveal delete action (if enabled).",
    ],
    [
      "Confirm the latest record is added.",
      "Check inter",
      "Clear cache and log in again.",
    ],
    [
      "Ensure the CSV/Excel file is not corrupted.",
      "Try opening with another spreadsheet app.",
    ],
    [
      "Check if the data exists on another device or backup.",
      "Contact support if you cannot restore deleted data.",
    ],
    [
      "Make sure you restored from your cloud backup.",
      "If phone changed, re-login with the same account.",
    ],
    [
      "Verify purchase on the account page.",
      "Contact support with receipt if features remain locked.",
    ],
    [
      "One-time purchases do not auto-renew.",
      "Subscriptions renew automatically until canceled.",
    ],
  ];

  const navigate = useNavigate();
  return (
    <div className="bg-ivory min-h-full p-6 text-primary font-['Noto_Sans_TC', sans-serif]">
      <div className="flex items-center gap-4 mb-[59px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Help & Support</h2>
      </div>

      <div className="">
        <h3 className="text-lg font-bold text-primary mb-[20px]">Frequently Asked</h3>

        <style>{`
          .faq-item{background:#fff;border-radius:10px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 6px 12px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.04)}
          .faq-text{color:#3b3b3b}
          .faq-panel{background:transparent;padding:10px 14px 18px 14px;color:#555}
          .contact-box{background:#eae6e0;padding:22px;border-radius:10px;margin-top:18px;text-align:center}
          .contact-cta{background:#C69C6D;color:#fff;padding:8px 22px;border-radius:8px;display:inline-block;margin-top:12px;box-shadow:0 6px 0 rgba(0,0,0,0.06)}
        `}</style>

        <div className="mb-[37px]">
          {faqs.map((q, i) => (
            <div key={q} className="bg-white rounded-[8px] border border-[#d3d3d3] mb-[8px]">
              <style>{`
                .faq-card{background:transparent}
                .faq-card .card-inner{background:#fff;border-radius:10px;box-shadow:0 6px 12px rgba(0,0,0,0.04);overflow:hidden;border:1px solid rgba(0,0,0,0.04)}
                .faq-header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;cursor:pointer}
                .faq-title{font-size:14px;}
                .faq-body{background:#fff;padding:10px 14px 16px 18px}
                .faq-list{margin:0;padding:0}
                .faq-list li{list-style:none;margin:8px 0;padding-left:18px;position:relative;}
                .faq-list li:before{content:'';position:absolute;left:0;top:8px;width:6px;height:6px;border-radius:50%;background:#8a5a34}
                .chev{color:#b7b0a6}
              `}</style>

              <div className="card-inner">
                <button
                  type="button"
                  className="faq-header w-full"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                >
                  <span className="text-sm text-primary">{q}</span>
                  <ChevronDown className={`text-primary w-[16px] h-[16px] transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>

                {openIndex === i && (
                  <div className="px-6">
                    <ul className="faq-list text-primary text-sm">
                      {answers[i] && answers[i].map((a, idx) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="contact-box text-primary">
          <div className="text-sm mb-[8px]">Need more help?</div>
          <div className="text-xs mb-[29px]">Our customer service is here to assist you</div>
          <button
            type="button"
            className="px-6 py-2 rounded-lg bg-[#C69C6D] text-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] w-[169px] text-center flex items-center justify-center mx-auto mt-3"
            onClick={() => navigate("/settings/about/contact-us")}
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
