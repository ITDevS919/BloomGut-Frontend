import { ChevronLeft, Clock } from "lucide-react";
import { Crown } from "lucide-react";

const SubScription = () => {
  const expiry = "Sep 9, 2025";

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
        <h2 className="text-xl font-semibold">Subscription</h2>
      </div>

      <div className="max-w-sm mx-auto text-center mt-15">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 rounded-full bg-amber-100 mb-3">
            <Crown className="text-amber-500" />
          </div>
          <div className="text-lg">Subscription Successful</div>
          <div className="text-sm">Mid-tier Member</div>
          <div className="text-xs mt-3">
            Access Week/Month charts, exclusive tips & graphs
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center">
          <button className="bg-white rounded-xl px-4 py-3 shadow-md border border-gray-100 text-sm text-primary-muted w-48">
            Go to Trend Analysis
          </button>

          <button className="bg-white rounded-xl px-4 py-3 shadow-md border border-gray-100 text-sm text-primary-muted w-48">
            Return to Home
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-primary-muted mt-5">
          <Clock className="w-4 h-4 text-primary-muted" />
          <div>Membership expires: <span className="font-medium">{expiry}</span></div>
        </div>

        <div className="mt-6 text-center">
          <button className="w-48 bg-white text-gray-300 rounded-xl py-3 shadow-none border border-gray-100 cursor-not-allowed mx-auto" disabled>
            Renew Subscription
          </button>
          <div className="text-xs text-gray-400 mt-2">Renew within 7 days before expiry</div>
        </div>

        <button className="mt-6 text-sm text-amber-700 underline mx-auto">Check Subscription Status</button>
      </div>
    </div>
  );
};

export default SubScription;
