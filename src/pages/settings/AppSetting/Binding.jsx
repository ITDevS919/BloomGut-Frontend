import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook, FaLine, FaSquareTwitter, FaTwitter, FaXTwitter } from "react-icons/fa6";
import { FaTwitterSquare } from "react-icons/fa";

const initialServices = [
  { id: "google", name: "Google", bound: false, subtitle: "Bound: user@gmail.com" },
  { id: "facebook", name: "Facebook", bound: false, subtitle: "Bound: Username" },
  { id: "line", name: "LINE", bound: true, subtitle: "Link your LINE account for" },
  { id: "twitter", name: "Twitter", bound: true, subtitle: "Link your Twitter account for" },
  { id: "apple", name: "Apple", bound: true, subtitle: "Sign in with Apple for privacy" },
];

const Binding = () => {
  const [services, setServices] = useState(initialServices);

  const toggle = (id) => {
    setServices((s) => s.map((svc) => (svc.id === id ? { ...svc, bound: !svc.bound } : svc)));
  };

  const boundServices = services.filter((s) => !s.bound);
  const availableServices = services.filter((s) => s.bound);

  const renderIcon = (id) => {
    const base = "w-[24px] h-[24px] flex items-center justify-center rounded-full font-bold text-sm ml-3";
    switch (id) {
      case "google":
        return <FcGoogle className={`${base}`} />;
      case "facebook":
        return <FaFacebook className={`${base}`} color="#365999" />
      case "line":
        return <FaLine className={`${base} text-white bg-[#3fb96e]`} />;
      case "twitter":
        return <FaSquareTwitter className={`${base} text-white bg-[#1da1f2]`} />;
      case "apple":
        return <FaApple className={`${base} text-whitebg-gray-700`} />;
      default:
        return <div className={`${base} bg-gray-400`}>?</div>;
    }
  };

  return (
    <div className="bg-ivory min-h-full p-6 text-primary font-['Roboto', sans-serif]">
      <div className="flex items-center gap-4 mb-[43px]">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-[40px] leading-none" />
        </button>
        <h2 className="text-lg">Binding</h2>
      </div>

      <div className="">
        <div className="bg-white rounded-[8px] px-4 py-3 mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-sm text-secondary mb-[17px]">
          Binding third-party services allows you to log in with these accounts and enjoy convenient cross-platform services.
        </div>

        <h3 className="text-sm font-bold text-primary mb-[11px]">Bound Services</h3>
        <div className="space-y-3 mb-[17px]">
          {boundServices.map((s) => (
            <div key={s.id} className="bg-white rounded-[8px] px-4 py-3 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-[20px]">
              <div className="flex items-center gap-3">
                {renderIcon(s.id)}
                <div>
                  <div className="text-sm text-primary">{s.name}</div>
                  <div className="text-xs text-custom-12">{s.subtitle}</div>
                </div>
              </div>
              <button
                className="px-4 py-2 border border-[#ccc] text-sm rounded-[8px] shadow-sm bg-white text-primary"
                onClick={() => toggle(s.id)}
              >
                Connect
              </button>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-bold text-primary mb-[13px]">Available Services</h3>
        <div className="space-y-3">
          {availableServices.map((s) => (
            <div key={s.id} className="bg-white rounded-[8px] px-4 py-3 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.08)] mb-[20px]">
              <div className="flex items-center gap-3">
                {renderIcon(s.id)}
                <div>
                  <div className="text-sm text-primary">{s.name}</div>
                  <div className="text-xs text-custom-12">{s.subtitle}</div>
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-[8px] shadow-sm bg-[#C69C6D] text-white text-sm"
                onClick={() => toggle(s.id)}
              >
                Disconnect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Binding;
