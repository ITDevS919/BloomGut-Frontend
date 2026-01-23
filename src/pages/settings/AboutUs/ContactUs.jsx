import { useState } from "react";
import { ChevronLeft } from "lucide-react";

const types = ["Report", "Subscription", "Suggest", "Others"];

const typeOptions = {
  Report: [
    "Function Error",
    "Slow Loading",
    "Interface Display Issue",
    "Login Issue",
    "Incorrect Data Display",
  ],
  Subscription: [
    "Payment Failed",
    "Subscription Canceled",
    "Billing Issue",
    "Plan Change",
    "Permission Issue",
    "Paid Features Not Unlocked",
    "Duplicate Charge or No Refund",
    "Upgrade Failed/Downgrade Error",
  ],
  Suggest: [
    "New Feature Request",
    "Existing Feature Improvement",
    "User Experience Optimization",
    "Improvement of Operation Process",
    "Enhanced Notification",
  ],
  Others: ["Account Related", "General Suggestions", "Uncategorized/Other"],
};

const ContactUs = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState("");
  const [occurTime, setOccurTime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [contact, setContact] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div className="bg-ivory min-h-full p-6 text-primary font-['Noto_Sans_TC', sans-serif]">
      <style>{`
        .contact-type-btn{background:#fff;padding:10px 18px;border-radius:12px;box-shadow:0 6px 12px rgba(0,0,0,0.06);}
        .contact-type-btn.selected{border:1px solid #705d56}
        .submit-btn{background:#C69C6D;color:#fff;padding:12px 0;rounded-lg;shadow-[0_4px_12px_rgba(0,0,0,0.08)];}
      `}</style>
      <div className="flex items-center gap-4 mb-[45px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Contact Us</h2>
      </div>

      <div className="">
        <div className="text-sm text-secondary mb-[11px]">
          Please select the type of issue you want to provide feedback on, so we
          can serve you better
        </div>

        <div className="grid grid-cols-2 gap-3 mb-[29px]">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
              className={`bg-white text-secondary text-sm px-4 py-2 rounded-[8px] shadow-sm ${selectedType === t ? "border border-[#705d56]" : ""
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mb-[29px]">
          <style>{`
            .option-list{display:flex;flex-direction:column;gap:10px}
            .option-item{background:#fff;padding:12px 14px;border-radius:12px;box-shadow:0 6px 12px rgba(0,0,0,0.06);display:flex;align-items:center;gap:12px}
            .option-radio{width:18px;height:18px;border-radius:50%;border:2px solid #d8d2c8;display:inline-block;flex:0 0 18px;position:relative}
            .option-radio.selected{border-color:#C69C6D;background:#fff}
            .option-radio.selected:after{content:'';position:absolute;left:4px;top:3px;width:6px;height:6px;background:#C69C6D;border-radius:50%}
            .option-label{font-size:14px;color:#333}
          `}</style>

          <div className="option-list">
            {typeOptions[selectedType] && typeOptions[selectedType].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedOption(opt)}
                className="option-item text-left"
                aria-pressed={selectedOption === opt}
              >
                <span className={`option-radio ${selectedOption === opt ? 'selected' : ''}`}></span>
                <span className="option-label">{opt}</span>
              </button>
            ))}
          </div>
        </div>

        <label className="text-sm text-secondary mb-[11px] block">
          <span className="text-red-600 mr-1">*</span>Issue Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue...."
          className="w-full h-28 p-3 rounded-[8px] border border-[#ccc] mb-[20px] bg-white resize-none placeholder-custom-12"
        />

        <label className="text-sm text-secondary mb-[6px] block">
          <span className="text-[#de2f2f] mr-1">*</span>Occurrence Time
        </label>
        <input
          // value={occurTime}
          onChange={(e) => setOccurTime(e.target.value)}
          placeholder="2025-04-25 14:30"
          className="w-full p-3 rounded-[8px] border border-[#ccc] mb-[20px] bg-white placeholder-custom-12 text-primary"
        />

        <label className="text-sm text-secondary mb-[6px] block">
          <span className="text-[#de2f2f] mr-1">*</span>Contact Information
        </label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Email"
          className="w-full p-3 rounded-[8px] border border-[#ccc] mb-[20px] bg-white placeholder-custom-12 text-primary mb-[29px]"
        />

        <button className="px-6 py-2 rounded-lg bg-[#C69C6D] text-white shadow-[0_6px_12px_rgba(0,0,0,0.15)] w-[242px] text-center flex items-center justify-center mx-auto mt-3">
          Submit
        </button>
      </div>
    </div>
  );
};

export default ContactUs;
