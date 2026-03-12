import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Droplet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const Year = ({ referenceDate }) => {
  const chartRef = useRef(null);
  const dropletRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });
  const [dropletTooltip, setDropletTooltip] = useState({ visible: false, x: 0, y: 0 });
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();
  const [yearAdvice, setYearAdvice] = useState({ title: "", message: "", tip: "" });
  const [yearAdviceLoading, setYearAdviceLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(true);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [labels, setLabels] = useState(monthNames.map((_, i) => i + 1));
  const [dailyAvg, setDailyAvg] = useState(
    [2200, 2350, 2280, 2450, 2200, 1850, 2000, 2250, 2400, 2500, 2350, 2220]
  );
  const [regularity, setRegularity] = useState(
    [85, 88, 86, 90, 84, 78, 82, 86, 90, 94, 92, 89]
  );

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchYearly = async () => {
      try {
        const ref =
          referenceDate && referenceDate.toISOString
            ? referenceDate.toISOString()
            : undefined;
        setChartLoading(true);
        const res = await api.get("/trend/water/yearlySummary", {
          params: { userId: auth.user.id, referenceDate: ref },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) return;
        if (Array.isArray(payload.labels) && payload.labels.length === 12) {
          // keep numeric 1..12 labels for chart but use payload labels for tooltips
          setLabels(payload.labels.map((_, idx) => idx + 1));
        }
        if (Array.isArray(payload.dailyAvg) && payload.dailyAvg.length === 12) {
          setDailyAvg(payload.dailyAvg);
        }
        if (Array.isArray(payload.regularity) && payload.regularity.length === 12) {
          setRegularity(payload.regularity);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load yearly water summary:", err);
      } finally {
        setChartLoading(false);
      }
    };

    fetchYearly();
  }, [api, auth?.user?.id, referenceDate]);

  const data = {
    labels,
    datasets: [
      {
        label: "Daily Avg",
        data: dailyAvg,
        borderColor: "#4DD0F1",
        backgroundColor: "#4DD0F1",
        yAxisID: "y",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Regularity",
        data: regularity,
        borderColor: "#4C78A8",
        backgroundColor: "#4C78A8",
        yAxisID: "y1",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Helper function to determine status based on consistency
  const getStatus = (consistency) => {
    if (consistency < 75) return "Needs";
    if (consistency < 85) return "Fair";
    return "Good";
  };

  // Find the best performing month (highest Daily Avg and Regularity)
  const findBestMonth = () => {
    let bestIndex = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < dailyAvg.length; i++) {
      const avg = dailyAvg[i] ?? 0;
      const reg = regularity[i] ?? 0;
      const score = avg * 0.6 + reg * 40;
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    return {
      month: monthNames[bestIndex],
      index: bestIndex,
    };
  };

  const bestMonth = findBestMonth();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          font: { size: 12 },
        },
      },
      datalabels: { display: false },
      //   annotation: {
      //     annotations: {
      //       currentWeek: {
      //         type: "line",
      //         xMin: 6,
      //         xMax: 6,
      //         borderColor: "#D1D5DB",
      //         borderWidth: 2,
      //       },
      //     },
      //   },
      tooltip: {
        enabled: false,
        external: (context) => {
          const { chart, tooltip } = context;
          if (tooltip.opacity === 0) {
            setTooltip({ visible: false, x: 0, y: 0, data: null });
            return;
          }

          const dataPoints = tooltip.dataPoints || [];
          if (dataPoints.length > 0) {
            const dataIndex = dataPoints[0].dataIndex;
            const monthName = monthNames[dataIndex] || `Month ${dataIndex + 1}`;

            const chartData = chart.data;
            const dailyAvgValue = chartData.datasets[0].data[dataIndex] || 0;
            const consistency = chartData.datasets[1].data[dataIndex] || 0;
            const status = getStatus(consistency);

            const chartPosition = chart.canvas.getBoundingClientRect();
            const x = chartPosition.left + tooltip.caretX;
            const y = chartPosition.top + tooltip.caretY;

            setTooltip({
              visible: true,
              x,
              y,
              data: {
                month: monthName,
                dailyAvg: dailyAvgValue,
                consistency,
                status,
              },
            });
          }
        },
      },
    },
    scales: {
      y: {
        position: "left",
        min: 1200,
        max: 2800,
        ticks: {
          stepSize: 400,
        },
        grid: {
          color: "#E5E7EB",
          borderDash: [4, 4],
        },
      },
      y1: {
        position: "right",
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="pl-[15px] pr-[15px] ">
      <div className="w-full  rounded-[8px] bg-white p-6 shadow-md">
        {/* Header */}
        <h2 className="text-center text-lg text-primary">
          Annual Water Drinking
        </h2>
        <p className="mb-4 text-center text-sm text-gray-400">
          Yearly Intake & Regularity
        </p>

        {/* Chart */}
        <div className="relative h-72">
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
              <Line ref={chartRef} data={data} options={options} />

              {/* Tip icon */}
              <div
                ref={dropletRef}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  if (
                    !yearAdvice.title &&
                    !yearAdvice.message &&
                    !yearAdvice.tip &&
                    !yearAdviceLoading &&
                    auth?.user?.id
                  ) {
                    setYearAdviceLoading(true);
                    const ref =
                      referenceDate && referenceDate.toISOString
                        ? referenceDate.toISOString()
                        : undefined;
                    api
                      .post("/trend/water/yearlyAdvice", {
                        userId: auth.user.id,
                        referenceDate: ref,
                      })
                      .then((res) => {
                        const payload = res.data?.data ?? res.data;
                        if (payload) {
                          setYearAdvice({
                            title: payload.title ?? "",
                            message: payload.message ?? "",
                            tip: payload.tip ?? "",
                          });
                        }
                      })
                      .catch(() => {
                        setYearAdvice({
                          title: "Annual Hydration Overview",
                          message:
                            "Review your yearly intake pattern and note which months felt best.",
                          tip: "Repeat the routines from your best month and smooth out low-intake months.",
                        });
                      })
                      .finally(() => {
                        setYearAdviceLoading(false);
                      });
                  }
                  setDropletTooltip({
                    visible: true,
                    x: rect.left,
                    y: rect.top,
                  });
                }}
                onMouseLeave={() => {
                  setDropletTooltip({ visible: false, x: 0, y: 0 });
                }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 shadow-md cursor-pointer">
                  <Droplet className="h-5 w-5 text-white" />
                </div>
              </div>

              {/* Droplet Tooltip */}
              {dropletTooltip.visible && (
                <div
                  className="fixed z-50 bg-white rounded-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.16)] p-4 pointer-events-none"
                  style={{
                    left: `${dropletTooltip.x - 200}px`,
                    top: `${dropletTooltip.y}px`,
                    minWidth: "200px",
                    maxWidth: "250px",
                  }}
                >
                  <h3 className="text-base font-medium text-primary mb-2">
                    {yearAdvice.title || bestMonth.month}
                  </h3>
                  {yearAdviceLoading ? (
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
                      {yearAdvice.message && (
                        <p className="text-sm text-secondary mb-1">
                          {yearAdvice.message}
                        </p>
                      )}
                      {yearAdvice.tip && (
                        <p className="text-xs text-secondary">
                          <span className="font-medium">Tip: </span>
                          {yearAdvice.tip}
                        </p>
                      )}
                      {!yearAdvice.message && !yearAdvice.tip && (
                        <p className="text-xs text-secondary">
                          Best Performance of the Year (Stable Lifestyle)
                        </p>
                      )}
                    </>
                  )}
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
                  <h3 className="text-base font-medium text-primary mb-4">
                    {tooltip.data.month}
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: "#4DD0F1" }}
                      />
                      <span className="text-sm text-secondary">
                        Daily Avg: {tooltip.data.dailyAvg}ml
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: "#4C78A8" }}
                      />
                      <span className="text-sm text-secondary">
                        Consistency: {tooltip.data.consistency}%
                      </span>
                    </div>
                    <div className="w-full h-px bg-gray-200 my-1"></div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: "#FF6B6B" }}
                      />
                      <span className="text-sm text-secondary">
                        Status: {tooltip.data.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs italic text-custom-12">
          Tap curve for monthly, icon for tips
        </p>
      </div>
    </div>
  );
};

export default Year;
