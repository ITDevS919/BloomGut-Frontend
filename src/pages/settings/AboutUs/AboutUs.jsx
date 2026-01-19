import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();
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
        <h2 className="text-xl font-semibold">About & Feedback</h2>
      </div>

      <div className="bg-white rounded-xl p-1 shadow-sm mt-12 text-center">
        <img
          src="/src/assets/BloomGut-透明板.png"
          alt="BloomGut Logo"
          className="mx-auto w-50 h-30"
        />
        <h3 className="text-lg font-semibold mb-2">Gut Health Assistant</h3>
        <p className="text-secondary mb-4">Version 3.5.2</p>
      </div>

      <h1 className="text-lg mt-5">About Us</h1>
      <button
        type="button"
        className="bg-white rounded-xl p-4 shadow-sm mt-5 w-full text-left flex items-center justify-between"
        onClick={() => {
          navigate("/setting/about-us/company-introduction");
        }}
      >
        <div>
          <h3 className="text-base">About Company</h3>
          <p className="text-xs text-gray-500 mt-1">About BloomGut</p>
        </div>
        <ChevronRight className="text-gray-400" />
      </button>
      <button
        type="button"
        className="bg-white rounded-xl p-4 shadow-sm mt-5 w-full text-left flex items-center justify-between"
        onClick={() => {
          navigate("/setting/privacy-policy/terms-of-use?tab=privacy");
        }}
      >
        <div>
          <h3 className="text-base">User Terms</h3>
          <p className="text-xs text-gray-500 mt-1">Terms & Privacy</p>
        </div>
        <ChevronRight className="text-gray-400" />
      </button>

      <h1 className="text-lg mt-5">Contact Us</h1>
      <button
        type="button"
        className="bg-white rounded-xl p-4 shadow-sm mt-5 w-full text-left flex items-center justify-between"
        onClick={() => {
          // TODO: navigate to About Company details
          navigate("/setting/about-us/contact-us");
        }}
      >
        <div>
          <h3 className="text-base">Report/Suggest</h3>
          <p className="text-xs text-gray-500 mt-1">Share your feedback</p>
        </div>
        <ChevronRight className="text-gray-400" />
      </button>
    </div>
  );
};

export default AboutUs;
