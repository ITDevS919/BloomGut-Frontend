import { ChevronLeft } from "lucide-react";

const CompanyIntroduction = () => {
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
        <h2 className="text-xl font-semibold">Company Introduction</h2>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm flex gap-14 items-center mb-4">
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 8,
            background: "#f2efe9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/src/assets/Images/stool-types/stool-1.png"
            alt="logo"
            style={{
              width: 44,
              height: 44,
              objectFit: "cover",
              borderRadius: 6,
            }}
          />
        </div>
        <div>
          <h1 className="font-bold">BloomGut Health</h1>
          <p className="text-sm text-gray-500 mt-1">
            Personalized health records
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
        <h1 className="text-primary font-semibold">About Us</h1>
        <p className="text-justify text-x2 sm">
          BloomGut is a mobile web app for gut health management. By tracking
          diet, bowel, urine, and water intake, it helps users see health trends
          and get personalized advice.
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
        <h1 className="text-primary font-semibold">Our Mission</h1>
        <p className="text-justify text-x2 sm">
          We help users build self-observation habits, spot subtle body changes,
          and adjust daily routines. We also prioritize data privacy and
          security.
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-base font-semibold mb-2">Contact Information</h3>
        <div className="text-sm text-gray-600">
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
