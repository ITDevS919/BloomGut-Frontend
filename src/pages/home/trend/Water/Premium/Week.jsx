import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { MessageCircle } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Week = ({ referenceDate }) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();
  const chartRef = useRef(null);
  const messageCircleRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });
  const [messageTooltip, setMessageTooltip] = useState({ visible: false, x: 0, y: 0 });
  const [labels, setLabels] = useState(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  const [dailyMl, setDailyMl] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [timeShare, setTimeShare] = useState({
    morning: 0.25,
    noon: 0.25,
    afternoon: 0.25,
    evening: 0.25,
  });
  const [advice, setAdvice] = useState({ message: "", tip: "" });
  const [chartLoading, setChartLoading] = useState(true);
  const dayNames = {
    "Mon": "Monday",
    "Tue": "Tuesday",
    "Wed": "Wednesday",
    "Thu": "Thursday",
    "Fri": "Friday",
    "Sat": "Saturday",
    "Sun": "Sunday",
  };

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchData = async () => {
      setChartLoading(true);
      try {
        const ref =
          referenceDate && referenceDate.toISOString
            ? referenceDate.toISOString()
            : undefined;
        const [dailyRes, weeklyTimeRes] = await Promise.all([
          api.get("/trend/water/dailyMl", {
            params: { userId: auth.user.id, referenceDate: ref },
          }),
          api.get("/trend/water/weeklyTime", {
            params: { userId: auth.user.id, referenceDate: ref },
          }),
        ]);

        const dailyPayload = dailyRes.data?.data || dailyRes.data;
        if (dailyPayload?.days && dailyPayload?.mlPerDay) {
          setLabels(dailyPayload.days);
          setDailyMl(dailyPayload.mlPerDay);
        }

        const weeklyPayload = weeklyTimeRes.data?.data || weeklyTimeRes.data;
        if (weeklyPayload) {
          const morning = weeklyPayload.morningMl ?? 0;
          const noon = weeklyPayload.noonMl ?? 0;
          const afternoon = weeklyPayload.afternoonMl ?? 0;
          const evening = weeklyPayload.eveningMl ?? 0;
          const total = morning + noon + afternoon + evening;
          if (total > 0) {
            setTimeShare({
              morning: morning / total,
              noon: noon / total,
              afternoon: afternoon / total,
              evening: evening / total,
            });
          }

          try {
            const adviceRes = await api.post("/trend/water/weeklyAdvice", {
              morningMl: morning,
              noonMl: noon,
              afternoonMl: afternoon,
              eveningMl: evening,
              totalMl: total,
              morningPercent: weeklyPayload.morningPercent ?? 0,
              noonPercent: weeklyPayload.noonPercent ?? 0,
              afternoonPercent: weeklyPayload.afternoonPercent ?? 0,
              eveningPercent: weeklyPayload.eveningPercent ?? 0,
            });
            const advicePayload = adviceRes.data?.data ?? adviceRes.data;
            if (advicePayload?.message != null || advicePayload?.tip != null) {
              setAdvice({
                message: advicePayload.message ?? "",
                tip: advicePayload.tip ?? "",
              });
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Failed to load premium weekly water advice:", error);
            setAdvice({
              message: "Review your weekly water distribution.",
              tip: "Spread intake across the day.",
            });
          } finally {
            // no loading state
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load weekly water trend for premium view:", err);
      } finally {
        setChartLoading(false);
      }
    };

    fetchData();
  }, [api, auth?.user?.id, referenceDate]);

  const morningData = useMemo(
    () => labels.map((_, idx) => Math.round((dailyMl[idx] || 0) * timeShare.morning)),
    [labels, dailyMl, timeShare.morning]
  );
  const noonData = useMemo(
    () => labels.map((_, idx) => Math.round((dailyMl[idx] || 0) * timeShare.noon)),
    [labels, dailyMl, timeShare.noon]
  );
  const afternoonData = useMemo(
    () => labels.map((_, idx) => Math.round((dailyMl[idx] || 0) * timeShare.afternoon)),
    [labels, dailyMl, timeShare.afternoon]
  );
  const eveningData = useMemo(
    () => labels.map((_, idx) => Math.round((dailyMl[idx] || 0) * timeShare.evening)),
    [labels, dailyMl, timeShare.evening]
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Morning",
          data: morningData,
          backgroundColor: "#BAE6FD",
        },
        {
          label: "Noon",
          data: noonData,
          backgroundColor: "#6AA8CF",
        },
        {
          label: "Afternoon",
          data: afternoonData,
          backgroundColor: "#2C7DA0",
        },
        {
          label: "Evening",
          data: eveningData,
          backgroundColor: "#1E3A8A",
        },
      ],
    }),
    [labels, morningData, noonData, afternoonData, eveningData]
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          font: { size: 11 },
        },
      },
      datalabels: { display: false },
      tooltip: {
        enabled: false,
        external: (context) => {
          const { chart, tooltip } = context;
          if (tooltip.opacity === 0) {
            setTooltip({ visible: false, x: 0, y: 0, data: null });
            return;
          }

          const dataIndex = tooltip.dataPoints?.[0]?.dataIndex;
          if (dataIndex !== undefined) {
            const chartData = chart.data;
            const dayLabel = chartData.labels[dataIndex];
            const dayName = dayNames[dayLabel] || dayLabel;

            const morning = chartData.datasets[0].data[dataIndex] || 0;
            const noon = chartData.datasets[1].data[dataIndex] || 0;
            const afternoon = chartData.datasets[2].data[dataIndex] || 0;
            const evening = chartData.datasets[3].data[dataIndex] || 0;

            const chartPosition = chart.canvas.getBoundingClientRect();
            const x = chartPosition.left + tooltip.caretX;
            const y = chartPosition.top + tooltip.caretY;

            setTooltip({
              visible: true,
              x,
              y,
              data: {
                day: dayName,
                morning,
                noon,
                afternoon,
                evening,
              },
            });
          }
        },
      },
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: {
        stacked: true,
        min: 0,
        max: 3000,
        ticks: { stepSize: 300 },
        grid: { color: "#E5E7EB", borderDash: [4, 4] },
      },
    },
  };

  return (
    <div className="pl-[15px] pr-[15px] mt-[38px]">
      <div className="w-full rounded-[20px] bg-white p-5 shadow-[2px_0_10px_rgba(0,0,0,0.15)] mb-10">
        {/* Header */}
        <h2 className="text-center text-base text-primary mb-[9px]">
          Daily Intake
        </h2>
        <p className="mb-4 text-center text-xs text-custom-12">Weekly Tracker</p>

        {/* Chart wrapper (IMPORTANT) */}
        <div className="relative h-60">
          {chartLoading ? (
            <div className="flex h-full items-center justify-center">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24px"
                height="30px"
                viewBox="0 0 24 30"
                style={{ enableBackground: "new 0 0 50 50" }}
                xmlSpace="preserve"
              >
                <rect x="0" y="0" width="4" height="10" fill="#ef4444">
                  <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 20; 0 0"
                    begin="0"
                    dur="0.6s"
                    repeatCount="indefinite"
                  />
                </rect>
                <rect x="10" y="0" width="4" height="10" fill="#ef4444">
                  <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 20; 0 0"
                    begin="0.2s"
                    dur="0.6s"
                    repeatCount="indefinite"
                  />
                </rect>
                <rect x="20" y="0" width="4" height="10" fill="#ef4444">
                  <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 20; 0 0"
                    begin="0.4s"
                    dur="0.6s"
                    repeatCount="indefinite"
                  />
                </rect>
              </svg>
            </div>
          ) : (
            <>
              <Bar ref={chartRef} data={data} options={options} />

              {/* Message icon overlay */}
              <button
                ref={messageCircleRef}
                className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50"
                aria-label="Tips"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMessageTooltip({
                    visible: true,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  });
                }}
                onMouseLeave={() => {
                  setMessageTooltip({ visible: false, x: 0, y: 0 });
                }}
              >
                <MessageCircle className="h-5 w-5 text-blue-500" />
              </button>

              {/* Message Circle Tooltip */}
              {messageTooltip.visible && (
                <div
                  className="fixed z-50 bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.16)] p-4 pointer-events-none"
                  style={{
                    left: `${messageTooltip.x - 100}px`,
                    top: `${messageTooltip.y - 100}px`,
                    transform: "translateX(-50%)",
                    minWidth: "200px",
                    maxWidth: "250px",
                  }}
                >
                  <h3 className="text-base font-medium text-primary mb-2">
                    Weekly Tip
                  </h3>
                  <>
                    {advice.message && (
                      <p className="text-sm text-secondary leading-relaxed mb-1">
                        {advice.message}
                      </p>
                    )}
                    {advice.tip && (
                      <p className="text-xs text-custom-12">
                        <span className="font-medium">Tip: </span>
                        {advice.tip}
                      </p>
                    )}
                    {!advice.message && !advice.tip && (
                      <p className="text-sm text-secondary leading-relaxed">
                        Weekly water tips will appear here once available.
                      </p>
                    )}
                  </>
                </div>
              )}

              {/* Custom Tooltip */}
              {tooltip.visible && tooltip.data && (
                <div
                  className="fixed z-50 bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.16)] p-4 pointer-events-none"
                  style={{
                    left: `${tooltip.x}px`,
                    top: `${tooltip.y - 180}px`,
                    transform: "translateX(-50%)",
                    minWidth: "200px",
                  }}
                >
                  <h3 className="text-base font-mdedium text-primary mb-4">
                    {tooltip.data.day}
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: "#BAE6FD" }}
                      />
                      <span className="text-sm text-secondary">
                        Morning: {tooltip.data.morning} ml
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: "#6AA8CF" }}
                      />
                      <span className="text-sm text-secondary">
                        Noon: {tooltip.data.noon} ml
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: "#2C7DA0" }}
                      />
                      <span className="text-sm text-secondary">
                        Afternoon: {tooltip.data.afternoon} ml
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: "#1E3A8A" }}
                      />
                      <span className="text-sm text-secondary">
                        Evening: {tooltip.data.evening} ml
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer text */}
        <p className="mt-[34px] italic text-center text-xs text-custom-12">
          Tap icon for tips
        </p>
      </div>

      <div className="flex items-center justify-center mb-[27px]">
        <button
          className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary"
          onClick={() => navigate("/trend-analysis?plan=intermediate", { state: { trendType: "water", viewMode: "month" } })}
        >
          OverView
        </button>
      </div>
    </div>
  );
};

export default Week;
