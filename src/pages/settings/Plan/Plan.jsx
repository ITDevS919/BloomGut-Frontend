import { ChevronLeft } from "lucide-react";
import { Crown, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    key: "free",
    label: "FREE",
    price: "$0",
    priceSub: "Suitable for trial users",
    features: [
      "Weekly 7-day view",
      "Health input (bowel, diet, water, urine)",
      "Basic trend graphs (4 modules)",
    ],
    buttonStyle: "use",
  },
  {
    key: "standard",
    label: "STANDARD★",
    badge: "Hot",
    price: "$99 / Month",
    altPrice: "$250 / Quarter",
    priceSub: "Perfect for health tracking",
    features: [
      "Weekly/Monthly advanced views",
      "7-day gut chart with tips",
      "Monthly nutrition stats",
      "Auto trend analysis from records",
    ],
    buttonStyle: "subscribe-filled",
    accent: true,
  },
  {
    key: "pro",
    label: "PRO",
    price: "NT$899 / Year",
    altPrice: "NT$499 / 6 mo",
    priceSub: "Suitable for In-depth Analysis",
    features: [
      "Week/Month/Year views",
      "All advanced charts + multi-chart comparison",
      "Correlation analysis (bowel, diet, water, urine)",
      "AI personalized health advice",
      "All intermediate member features",
    ],
    buttonStyle: "subscribe-outline",
  },
];

const Plan = () => {

    const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStart - endX;
    if (diff > 50 && active < plans.length - 1) setActive(active + 1);
    if (diff < -50 && active > 0) setActive(active - 1);
    setTouchStart(null);
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
        <h2 className="text-xl font-semibold">Plans</h2>
      </div>

      <div className="max-w-sm mx-auto text-center">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 rounded-full bg-ivory-100 mb-3">
            <Crown className="text-[#cfa76f]" />
          </div>
          <div className="text-xl text-[#5D4037]">Upgrade Plan</div>
          <div className="text-sm text-[#705D56]">
            Unlock full health analysis & tracking
          </div>
        </div>

        <style>{`
          .slider-viewport{overflow:hidden}
          .slider-track{display:flex;transition:transform 300ms ease}
          .slide{flex:0 0 100%;padding:0 6px;box-sizing:border-box}
          .plan-card{background:#fff;border-radius:12px;padding:20px 18px;box-shadow:0 8px 18px rgba(0,0,0,0.06);border:1px solid rgba(0,0,0,0.04);position:relative}
          .plan-card.accent{border-color:#f2b57a}
          .plan-header{display:flex;justify-content:space-between;align-items:center}
          .badge{background:#f6b87a;color:#fff;font-size:12px;padding:6px 10px;border-radius:12px;position:absolute;top:-8px;right:12px}
          .price{font-size:24px;font-weight:700;color:#5D4037}
          .price-sub{font-size:12px;color:#705D56}
          .alt-price{display:inline-block;background:#fff;border-radius:8px;padding:8px 12px;margin-right:8px;border:1px solid rgba(0,0,0,0.06);box-shadow:0 6px 0 rgba(0,0,0,0.04)}
          .feature-item{display:flex;align-items:center;gap:12px;padding:14px 0;color:#555}
          .feature-check{width:20px;height:20px;border-radius:6px;background:#f8efe4;display:flex;align-items:center;justify-content:center;color:#cfa76f;flex:0 0 20px}
          .feature-text{font-size:14px;color:#4b4b4b;text-align:left}
          .use-btn{background:#fff;border-radius:12px;padding:12px 30px;border:1px solid rgba(0,0,0,0.06);box-shadow:0 2px 6px rgba(0,0,0,0.06);color:#6b5d52;font-weight:500}
          .subscribe-filled{background:#f0a95a;color:#fff;border:none;box-shadow:0 6px 0 rgba(0,0,0,0.06);border-radius:12px;padding:12px 30px}
          .subscribe-outline{background:#fff;border-radius:12px;padding:12px 30px;border:1px solid rgba(0,0,0,0.06)}
          .dots{display:flex;gap:10px;justify-content:center;margin-top:14px}
          .dot{width:8px;height:8px;border-radius:50%;background:#d9d0c6;cursor:pointer}
          .dot.active{background:#8a5a34}
        `}</style>

        <div className="slider-viewport" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="slider-track" style={{ transform: `translateX(-${active * 100}%)` }}>
            {plans.map((p, i) => (
              <div className="slide" key={p.key}>
                <div className={`plan-card ${p.accent ? "accent" : ""}`}>
                  <div className="plan-header">
                    <div></div>
                    <div className="text-xs text-[#5D4037]">{p.label}</div>
                  </div>

                  {p.badge && <div className="badge">{p.badge}</div>}

                  <div className="py-4">
                    <div className="price">{p.price}</div>
                    {p.altPrice && (
                      <div className="mt-2">
                        <span className="alt-price">{p.altPrice}</span>
                      </div>
                    )}
                    <div className="price-sub mt-2">{p.priceSub}</div>
                  </div>

                  <div className="mt-4 text-left">
                    {p.features.map((f, idx) => (
                      <div className="feature-item" key={idx}>
                        <span className="feature-check">
                          <Check size={12} />
                        </span>
                        <div className="feature-text">{f}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-center">
                    {p.buttonStyle === "subscribe-filled" ? (
                      <button type="button" className="subscribe-filled" onClick={() => navigate("/setting/upgrade-plan/subscription")}>
                        Subscribe
                      </button>
                    ) : p.buttonStyle === "subscribe-outline" ? (
                      <button type="button" className="subscribe-outline">
                        Subscribe
                      </button>
                    ) : (
                      <button type="button" className="use-btn">
                        Use
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dots">
          {plans.map((p, i) => (
            <span
              key={p.key}
              className={`dot ${active === i ? "active" : ""}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        <div className="text-xs text-gray-400 mt-4">
          Selecting indicates agreement to
        </div>
      </div>
    </div>
  );
};

export default Plan;
