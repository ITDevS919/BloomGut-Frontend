import { useState } from "react";
import { ChevronLeft } from "lucide-react";

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
    const base = "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm";
    switch (id) {
      case "google":
        return <div className={`${base} bg-red-500`}>G</div>;
      case "facebook":
        return <div className={`${base} bg-blue-600`}>f</div>;
      case "line":
        return <div className={`${base} bg-green-500`}>L</div>;
      case "twitter":
        return <div className={`${base} bg-sky-500`}>t</div>;
      case "apple":
        return <div className={`${base} bg-gray-700`}></div>;
      default:
        return <div className={`${base} bg-gray-400`}>?</div>;
    }
  };

  return (
    <div className="bg-ivory min-h-full p-6 text-secondary">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          className="text-primary text-xl leading-none"
          aria-label="back"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="text-primary text-xl leading-none" />
        </button>
        <h2 className="text-xl font-semibold">Binding</h2>
      </div>

      <div className="mt-15">
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          Binding third-party services allows you to log in with these accounts and enjoy convenient cross-account features.
        </div>

        <h3 className="text-sm font-semibold text-brown mb-3">Bound Services</h3>
        <div className="space-y-3 mb-6">
          {boundServices.map((s) => (
            <div key={s.id} className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                {renderIcon(s.id)}
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.subtitle}</div>
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-md border bg-white text-gray-700"
                onClick={() => toggle(s.id)}
              >
                Connect
              </button>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-brown mb-3">Available Services</h3>
        <div className="space-y-3">
          {availableServices.map((s) => (
            <div key={s.id} className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                {renderIcon(s.id)}
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.subtitle}</div>
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-md bg-[#cfa76f] text-white shadow-sm"
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
