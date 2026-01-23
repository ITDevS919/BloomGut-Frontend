import { ChevronLeft } from "lucide-react";
import logo from "@/assets/logo.png";

const CompanyIntroduction = () => {
  return (
    <div className="bg-ivory min-h-full p-6 text-primary font-['Noto_Sans_TC', sans-serif]">
      <div className="flex items-center gap-4 mb-[66px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none cursor-pointer " />
        </button>
        <h2 className="text-lg font-['Noto_Sans_TC', sans-serif]">Company Introduction</h2>
      </div>

      <div className="bg-white rounded-[8px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex gap-4 items-center mb-[20px]">
        <div>
          <img
            src={logo}
            alt="logo"
            width="66px"
            height="66px"
            className="rounded-[6px]"
          />
        </div>
        <div>
          <h1 className="font-bold text-lg text-primary mb-[8px]">BloomGut Health</h1>
          <p className="text-sm text-secondary">
            Personalized health records
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[8px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-5">
        <h1 className="text-primary text-lg">About Us</h1>
        <p className="text-secondary text-sm">
          BloomGut is a mobile web app for gut health management. By tracking
          diet, bowel, urine, and water intake, it helps users see health trends
          and get personalized advice.
        </p>
      </div>

      <div className="bg-white rounded-[8px] p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-5">
        <h1 className="text-primary text-lg">Our Mission</h1>
        <p className="text-secondary text-sm">
          We help users build self-observation habits, spot subtle body changes,
          and adjust daily routines. We also prioritize data privacy and
          security.
        </p>
      </div>

      <div className="bg-white rounded-[8px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
        <h3 className="text-base text-primary mb-2">Contact Information</h3>
        <div className="text-sm text-secondary">
          <div>
            Email: <a href="mailto:contact@smartech.com" className="text-primary underline">contact@smartech.com</a>
          </div>
          <div className="mt-1">
            Official Website: <a href="https://www.smartech.com" target="_blank" rel="noreferrer" className="text-primary underline">www.smartech.com</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyIntroduction;
