import Free from "../Free";
import DateRangeSelector from "@/components/custom/DateRangeSelector";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import Upgrade from "./Upgrade";
import DateRangeSelectorYellowUpdate from "@/components/custom/DateRangeSelectorYellow(Update)";
import DateRangeSelectorYellow from "@/components/custom/DateRangeSelectorYellow";

ChartJS.register(ArcElement, Tooltip, Legend);

function Stat({ label, value, valueColor = "text-gray-800" }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[8px] border border-gray-200 px-3 py-1.5">
      <span className="text-primary">{label}</span>
      <span className={`font-medium ${valueColor}`}>{value}</span>
    </div>
  );
}

function Progress({ value, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-3 flex-1 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm text-gray-600">{value}%</span>
    </div>
  );
}

const Intermediate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [monthlyLoading, setMonthlyLoading] = useState(false);

  const [weeklyData, setWeeklyData] = useState({
    labels: ["Hard", "Firm", "Normal", "Soft"],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: [
          "#8B5E3C", // Hard
          "#C07A2D", // Firm
          "#F2B24C", // Normal
          "#FFD11A", // Soft
        ],
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  });

  const weeklyoptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // we build our own legend
      },
      datalabels: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
  };

  const [monthlyTime, setMonthlyTime] = useState({
    morningPercent: 58,
    noonPercent: 32,
    eveningPercent: 10,
  });

  const monthlyData = {
    datasets: [
      {
        data: [
          monthlyTime.morningPercent,
          monthlyTime.noonPercent,
          monthlyTime.eveningPercent,
        ],
        backgroundColor: [
          "#C4B0F0", // Morning (purple)
          "#63C174", // Green
          "#FFD43B", // Yellow
        ],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const monthlyOptions = {
    plugins: {
      tooltip: { enabled: false },
      datalabels: {
        display: false,
      },
    },
  };

  const [viewMode, setViewMode] = useState(location.state?.viewMode || "week");
  const [referenceDate, setReferenceDate] = useState(new Date());
  const isSubscribed = location.state?.subscribed || false;

  useEffect(() => {
    // Update viewMode if it's passed via navigation state
    if (location.state?.viewMode) {
      setViewMode(location.state.viewMode);
    }
  }, [location.state]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    let isCancelled = false;

    const fetchWeeklySummary = async () => {
      try {
        setWeeklyLoading(true);
        const response = await api.get("/trend/bowel/weeklySummary", {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate.toISOString(),
          },
        });
        const payload = response.data?.data || response.data;
        if (!payload || !Array.isArray(payload.typeDistribution)) return;

        const types = payload.typeDistribution;
        const t1 = types[0] || 0;
        const t2 = types[1] || 0;
        const t3 = types[2] || 0;
        const t4 = types[3] || 0;
        const t5 = types[4] || 0;

        const hard = t1;
        const firm = t2;
        const normal = t3;
        const soft = t4 + t5;

        setWeeklyData((prev) => ({
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data: [hard, firm, normal, soft],
            },
          ],
        }));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load bowel weekly stats:", error);
      } finally {
        if (!isCancelled) {
          setWeeklyLoading(false);
        }
      }
    };
    const fetchMonthlyTime = async () => {
      try {
        setMonthlyLoading(true);
        const response = await api.get("/trend/bowel/monthlyTime", {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate.toISOString(),
          },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;
        setMonthlyTime({
          morningPercent: payload.morningPercent ?? 0,
          noonPercent: payload.noonPercent ?? 0,
          eveningPercent: payload.eveningPercent ?? 0,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          "Failed to load bowel monthly time distribution:",
          error
        );
      } finally {
        if (!isCancelled) {
          setMonthlyLoading(false);
        }
      }
    };

    fetchWeeklySummary();
    fetchMonthlyTime();

    return () => {
      isCancelled = true;
    };
  }, [api, auth?.user?.id, referenceDate]);

  return (
    <div>
      {/* Date Range Selector Header */}
      <DateRangeSelector
        setViewMode={setViewMode}
        initialViewMode={viewMode}
        onDateChange={(date) => setReferenceDate(date)}
      />
      <Free showUpgrade={false} referenceDate={referenceDate} />
      <div className="pl-[15px] pr-[15px]">
        {/* Content */}

        {/* Weekly Stats */}
        {viewMode === "week" && (
          <>
            <div className="text-base pl-[15px] font-medium mb-5 text-primary">
              Weekly Stats
            </div>
            <div className="flex items-center gap-6 rounded-[27px] bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.08)] mb-[20px]">
              {weeklyLoading ? (
                <div className="flex flex-1 items-center justify-center py-8">
                  <div className="h-6 w-6 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* Pie */}
                  <div className="w-40 h-40">
                    <Pie data={weeklyData} options={weeklyoptions} />
                  </div>

                  {/* Legend */}
                  <div className="space-y-3 text-sm">
                    {weeklyData.labels.map((label, i) => (
                      <div key={label} className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor:
                              weeklyData.datasets[0].backgroundColor[i],
                          }}
                        />
                        <span className="text-secondary">
                          {label} ({weeklyData.datasets[0].data[i]}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center justify-center text-xs text-custom-12 pb-[46px]">
              Data for reference only
            </div>
          </>
        )}
        {viewMode === "month" && (
          <>
            <div className="text-base pl-[15px] font-medium mb-5 text-primary">
              Stool Time %
            </div>
            <div className="rounded-[27px] bg-white p-6 shadow-md">
              {monthlyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <h2 className="text-primary mb-4">Monthly</h2>
                  <div className="flex items-center gap-6">
                    {/* Donut */}
                    <div className="relative w-36 h-36">
                      <Doughnut data={monthlyData} options={monthlyOptions} />

                      {/* Center text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-semibold text-gray-900">
                          {monthlyTime.morningPercent}%
                        </span>
                        <span className="text-xs text-gray-500">Morning</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 text-sm">
                      <Stat
                        label="Avg Time"
                        value="8 AM"
                        valueColor="text-green-600"
                      />
                      <Stat
                        label="Most"
                        value="Thu"
                        valueColor="text-green-600"
                      />
                      <Stat
                        label="Regularity"
                        value="Good"
                        valueColor="text-green-600"
                      />
                    </div>
                  </div>
                  {/* Progress Bars */}
                  <div className="text-x2 mb-3 text-primary mt-5">
                    Stool Time %
                  </div>
                  <div className="space-y-3">
                    <Progress
                      value={monthlyTime.morningPercent}
                      color="bg-[#C4B0F0]"
                    />
                    <Progress
                      value={monthlyTime.noonPercent}
                      color="bg-[#63C174]"
                    />
                    <Progress
                      value={monthlyTime.eveningPercent}
                      color="bg-[#FFD43B]"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-center text-xs text-custom-12 mt-[20px] mb-[43px]">
              Data for reference only
            </div>

            {plan !== "premium" && plan !== "pro" && !isSubscribed && <Upgrade />}
            {(plan === "premium" || plan === "pro" || isSubscribed) && (
              <div className="flex items-center justify-center mb-[47px]">
                <button
                  className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary"
                  onClick={() => navigate("/trend-analysis?plan=premium", { state: { trendType: "bowel" } })}
                >
                  In-depth Analysis
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default Intermediate;
