import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Sun, AlertTriangle, Moon, Clock } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import { getTrendWaterMonthlyWeeks } from "@/api/http";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Month = ({ referenceDate }) => {
  const chartRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();
  const [labels, setLabels] = useState(["Week 1", "Week 2", "Week 3", "Week 4"]);
  const [weeks, setWeeks] = useState([
    {
      label: "Week 1",
      morningMl: 260,
      noonMl: 230,
      afternoonMl: 200,
      eveningMl: 170,
      totalMl: 860,
      avgDailyMl: 270,
      morningPercent: 0,
      noonPercent: 0,
      afternoonPercent: 0,
      eveningPercent: 0,
    },
    {
      label: "Week 2",
      morningMl: 320,
      noonMl: 300,
      afternoonMl: 220,
      eveningMl: 150,
      totalMl: 990,
      avgDailyMl: 300,
      morningPercent: 0,
      noonPercent: 0,
      afternoonPercent: 0,
      eveningPercent: 0,
    },
    {
      label: "Week 3",
      morningMl: 230,
      noonMl: 210,
      afternoonMl: 260,
      eveningMl: 180,
      totalMl: 880,
      avgDailyMl: 255,
      morningPercent: 0,
      noonPercent: 0,
      afternoonPercent: 0,
      eveningPercent: 0,
    },
    {
      label: "Week 4",
      morningMl: 240,
      noonMl: 230,
      afternoonMl: 250,
      eveningMl: 170,
      totalMl: 890,
      avgDailyMl: 265,
      morningPercent: 0,
      noonPercent: 0,
      afternoonPercent: 0,
      eveningPercent: 0,
    },
  ]);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(null);
  const [aiAdviceByWeek, setAiAdviceByWeek] = useState({});
  const [aiLoadingWeek, setAiLoadingWeek] = useState(null);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchMonthlyWeeks = async () => {
      try {
        setChartLoading(true);
        const ref =
          referenceDate && referenceDate.toISOString
            ? referenceDate.toISOString()
            : undefined;
        const res = await getTrendWaterMonthlyWeeks(api, {
          params: { userId: auth.user.id, referenceDate: ref },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) return;
        if (Array.isArray(payload.labels) && payload.labels.length === 4) {
          setLabels(payload.labels);
        }
        if (Array.isArray(payload.weeks) && payload.weeks.length) {
          setWeeks(
            payload.weeks.map((w, idx) => ({
              label: w.weekLabel ?? labels[idx] ?? `Week ${idx + 1}`,
              morningMl: w.morningMl ?? 0,
              noonMl: w.noonMl ?? 0,
              afternoonMl: w.afternoonMl ?? 0,
              eveningMl: w.eveningMl ?? 0,
              totalMl: w.totalMl ?? 0,
              avgDailyMl: w.avgDailyMl ?? 0,
              morningPercent: w.morningPercent ?? 0,
              noonPercent: w.noonPercent ?? 0,
              afternoonPercent: w.afternoonPercent ?? 0,
              eveningPercent: w.eveningPercent ?? 0,
            }))
          );
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load monthly water week distribution:", err);
      } finally {
        setChartLoading(false);
      }
    };

    fetchMonthlyWeeks();
  }, [api, auth?.user?.id, referenceDate]);

  const morningData = useMemo(
    () => weeks.map((w) => w.morningMl),
    [weeks]
  );
  const noonData = useMemo(
    () => weeks.map((w) => w.noonMl),
    [weeks]
  );
  const afternoonData = useMemo(
    () => weeks.map((w) => w.afternoonMl),
    [weeks]
  );
  const eveningData = useMemo(
    () => weeks.map((w) => w.eveningMl),
    [weeks]
  );
  const trendData = useMemo(
    () => weeks.map((w) => w.avgDailyMl),
    [weeks]
  );

  const data = {
    labels,
    datasets: [
      {
        type: "bar",
        label: "Morning",
        data: morningData,
        backgroundColor: "#BAE6FD",
        borderRadius: 6,
      },
      {
        type: "bar",
        label: "Noon",
        data: noonData,
        backgroundColor: "#6AA8CF",
        borderRadius: 6,
      },
      {
        type: "bar",
        label: "Afternoon",
        data: afternoonData,
        backgroundColor: "#2C7DA0",
        borderRadius: 6,
      },
      {
        type: "bar",
        label: "Evening",
        data: eveningData,
        backgroundColor: "#2E5578",
        borderRadius: 6,
      },
      {
        type: "line",
        label: "Monthly Trend (avg ml/day)",
        data: trendData,
        borderColor: "#60C7F2",
        backgroundColor: "#60C7F2",
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#8FD3F4",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          font: { size: 11 },
        },
      },

      datalabels: {
        display: false,
        color: "#6B7280",
        font: {
          size: 10,
          weight: "600",
        },

        // Default for bars
        anchor: "end",
        align: "top",
        offset: 4,

        formatter: (value) => value,
      },

      tooltip: {
        enabled: false,
        external: (context) => {
          const { chart, tooltip } = context;
          if (tooltip.opacity === 0) {
            setTooltip({ visible: false, x: 0, y: 0, data: null });
            return;
          }

          // Check if hovering over the line dataset
          const hoveredDataset = tooltip.dataPoints?.[0];
          if (hoveredDataset && hoveredDataset.datasetIndex === 4) { // Line dataset is index 4
            const dataIndex = hoveredDataset.dataIndex;
            const chartData = chart.data;
            const weekLabel = chartData.labels[dataIndex];

            const morning = chartData.datasets[0].data[dataIndex];
            const noon = chartData.datasets[1].data[dataIndex];
            const afternoon = chartData.datasets[2].data[dataIndex];

            const chartPosition = chart.canvas.getBoundingClientRect();
            const x = chartPosition.left + tooltip.caretX;
            const y = chartPosition.top + tooltip.caretY;

            setTooltip({
              visible: true,
              x,
              y,
              data: {
                week: weekLabel,
                morning,
                noon,
                afternoon,
              },
            });

            // Trigger AI advice fetch for the hovered week
            const week = weeks[dataIndex];
            if (week) {
              const existing = aiAdviceByWeek[dataIndex];
              if (!existing && aiLoadingWeek !== dataIndex) {
                const totalMl =
                  week.totalMl ||
                  week.morningMl + week.noonMl + week.afternoonMl + week.eveningMl;
                setAiLoadingWeek(dataIndex);
                api
                  .post("/trend/water/weeklyAdvice", {
                    morningMl: week.morningMl,
                    noonMl: week.noonMl,
                    afternoonMl: week.afternoonMl,
                    eveningMl: week.eveningMl,
                    totalMl,
                    morningPercent: week.morningPercent ?? 0,
                    noonPercent: week.noonPercent ?? 0,
                    afternoonPercent: week.afternoonPercent ?? 0,
                    eveningPercent: week.eveningPercent ?? 0,
                  })
                  .then((res) => {
                    const payload = res.data?.data ?? res.data;
                    if (payload) {
                      setAiAdviceByWeek((prev) => ({
                        ...prev,
                        [dataIndex]: {
                          message: payload.message ?? "",
                          tip: payload.tip ?? "",
                        },
                      }));
                    }
                  })
                  .catch(() => {
                    setAiAdviceByWeek((prev) => ({
                      ...prev,
                      [dataIndex]: {
                        message: "Review this week's intake pattern.",
                        tip: "Aim for more balanced intake across the day.",
                      },
                    }));
                  })
                  .finally(() => {
                    setAiLoadingWeek((prev) => (prev === dataIndex ? null : prev));
                  });
              }
              setSelectedWeekIndex(dataIndex);
            }
          } else {
            setTooltip({ visible: false, x: 0, y: 0, data: null });
            setSelectedWeekIndex(null);
          }
        },
      },
    },

    scales: {
      y: {
        min: 0,
        max: 3000,
        ticks: { stepSize: 90 },
      },
    },
  };
  return (
    <div className="pl-[15px] pr-[15px] mt-[38px]">
      <div className="w-full rounded-[20px] bg-white p-5 shadow-[2px_0_10px_rgba(0,0,0,0.15)] mb-[54px]">
      {/* Header */}
      <h2 className="text-center text-base text-primary mb-[13px]">
        Weekly Intake Analysis
      </h2>
      <p className="mb-4 text-center text-xs text-gray-400">Monthly Trend</p>

      {/* Chart */}
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

            {/* Custom Tooltip */}
            {tooltip.visible && tooltip.data && (
              <div
                className="fixed z-50 bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.16)] p-4 pointer-events-none"
                style={{
                  left: `${tooltip.x}px`,
                  top: `${tooltip.y - 150}px`,
                  transform: "translateX(-50%)",
                  minWidth: "200px",
                }}
              >
                <h3 className="text-base font-medium text-primary mb-4">
                  {tooltip.data.week}
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
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Icons */}
      <div className="mt-4 flex justify-center gap-4">
        <IconBtn icon={Sun} color="text-yellow-400" />
        <IconBtn icon={AlertTriangle} color="text-orange-500" />
        <IconBtn icon={Moon} color="text-blue-300" />
        <IconBtn icon={Clock} color="text-gray-500" />
      </div>

      {/* AI Weekly Advice card (for selected week) */}
      {selectedWeekIndex != null && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-start gap-3 rounded-[20px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.16)] px-5 py-4 w-[300px]">
            <div className="mt-1">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="text-sm text-secondary">
              <div className="font-medium text-primary mb-1">
                {labels[selectedWeekIndex] ?? `Week ${selectedWeekIndex + 1}`}
              </div>
              {aiLoadingWeek === selectedWeekIndex ? (
                <div className="flex items-center justify-center py-2">
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
                  {aiAdviceByWeek[selectedWeekIndex]?.message && (
                    <p className="text-xs text-secondary mb-1">
                      {aiAdviceByWeek[selectedWeekIndex].message}
                    </p>
                  )}
                  {aiAdviceByWeek[selectedWeekIndex]?.tip && (
                    <p className="text-xs text-custom-12">
                      <span className="font-medium">Tip: </span>
                      {aiAdviceByWeek[selectedWeekIndex].tip}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="mt-5 text-center text-xs text-custom-12 italic">
        Hover trend line for weekly tips
      </p>
      </div>
    </div>
  );
};

function IconBtn({ icon: Icon, color = "text-gray-600" }) {
  return (
    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-shadow">
      <Icon className={`h-4 w-4 ${color}`} />
    </button>
  );
}

export default Month;
