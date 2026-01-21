import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-ivory min-h-full p-6 text-primary font-['Noto_Sans_TC', sans-serif]">
      <div className="flex items-center gap-4 mb-[86px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none" />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">About & Feedback</h2>
      </div>

      <div className="bg-white rounded-[8px] p-2 shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-center text-primary mb-[20px]">
        <div className="flex justify-center">
          <img
            src={logo}
            alt="BloomGut Logo"
            width={80}
            className="mx-auto mt-5"
          />
        </div>
        <h3 className="text-xs mt-3 text-secondary">Gut Health Assistant</h3>
        <p className="text-custom-12 text-xs mb-[12px]">Version 3.5.2</p>
      </div>

      <h1 className="text-base text-primary mb-[12px]">About Us</h1>
      <div className="bg-white rounded-[8px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] w-full text-left flex items-center justify-between mb-[16px]">
        <div>
          <h3 className="text-sm text-primary mb-[8px]">About Company</h3>
          <p className="text-xs text-custom-12">About BloomGut</p>
        </div>
        <ChevronRight className="text-primary w-[16px] h-[16px]" onClick={() => {
          navigate("/setting/about-us/company-introduction");
        }} />
      </div>
      <div
        className="bg-white rounded-[8px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] w-full text-left flex items-center justify-between mb-[20px]"
      >
        <div>
          <h3 className="text-sm text-primary mb-[8px]">User Terms</h3>
          <p className="text-xs text-custom-12">Terms & Privacy</p>
        </div>
        <ChevronRight className="text-primary w-[16px] h-[16px]" onClick={() => {
          navigate("/setting/privacy-policy/terms-of-use?tab=privacy");
        }}
        />
      </div>

      <h1 className="text-base mb-[12px]">Contact Us</h1>
      <div
        className="bg-white rounded-[8px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mt-3 w-full text-left flex items-center justify-between"
      >
        <div>
          <h3 className="text-base text-primary mb-[8px]">Report/Suggest</h3>
          <p className="text-xs text-custom-12">Share your feedback</p>
        </div>
        <ChevronRight className="text-primary w-[16px] h-[16px]" onClick={() => {
          // TODO: navigate to About Company details
          navigate("/setting/about-us/contact-us");
        }} />
      </div>
    </div>
  );
};

export default AboutUs;
