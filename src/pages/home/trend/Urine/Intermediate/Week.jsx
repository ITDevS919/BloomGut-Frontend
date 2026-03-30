import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Sun, Moon, AlertTriangle } from "lucide-react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import {
  getTrendUrineWeeklyDayNight,
  getTrendUrineWeeklyScore,
  getTrendWaterWeeklyTime,
  postTrendUrineWeeklyAdvice,
} from "@/api/http";
import Loader from "@/components/common/Loader";
import TrendInsufficientNotice from "@/components/trend/TrendInsufficientNotice";

ChartJS.register(ArcElement, Tooltip, Legend);
import Free from "../Free";
import { MdQueryBuilder } from "react-icons/md";
import Upgrade from "./Upgrade";
import { useLocation, useSearchParams } from "react-router-dom";

const Week = ({ referenceDate }) => {
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [daytimePercent, setDaytimePercent] = useState(75);
  const [nightPercent, setNightPercent] = useState(25);
  const [daytimeEpisodes, setDaytimeEpisodes] = useState(0);
  const [nightEpisodes, setNightEpisodes] = useState(0);
  const [advice, setAdvice] = useState({
    daytime: { title: "Daytime Urine", desc: "Loading…" },
    nighttime: { title: "Nighttime Urine", desc: "Loading…" },
  });
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);

  // Clarity view state (for "Clarity" tab)
  const [claritySegments, setClaritySegments] = useState({
    clearPercent: 0,
    lightYellowPercent: 0,
    darkYellowPercent: 0,
  });
  const [clarityStats, setClarityStats] = useState({
    dailyVolumeMl: 0,
    nighttimePercent: 0,
    urinationAvgPerDay: 0,
  });
  const [clarityAdvice, setClarityAdvice] = useState({
    primaryTitle: "Urine Clarity",
    primaryDesc: "Loading…",
    secondaryTitle: "",
    secondaryDesc: "",
  });
  const [clarityLoading, setClarityLoading] = useState(false);

  // Time distribution view state (for "Time" tab)
  const [timeSegments, setTimeSegments] = useState({
    morningPercent: 0,
    forenoonPercent: 0,
    afternoonPercent: 0,
    eveningPercent: 0,
    nightPercent: 0,
  });
  const [timeStats, setTimeStats] = useState({
    dailyVolumeMl: 0,
    nighttimePercent: 0,
    urinationAvgPerDay: 0,
  });
  const [timeHighlight, setTimeHighlight] = useState({
    title: "",
    desc: "",
  });
  const [timeAdvice, setTimeAdvice] = useState({
    primaryTitle: "Urine Clarity",
    primaryDesc: "",
    secondaryTitle: "",
    secondaryDesc: "",
  });
  const [timeLoading, setTimeLoading] = useState(false);

  const [urineTrendLoading, setUrineTrendLoading] = useState(true);
  const [urineTrendOk, setUrineTrendOk] = useState(false);

  useEffect(() => {
    if (!auth?.user?.id) {
      setUrineTrendLoading(false);
      setUrineTrendOk(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setUrineTrendLoading(true);
      try {
        const response = await getTrendUrineWeeklyScore(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = response.data?.data || response.data;
        if (!cancelled) {
          setUrineTrendOk(payload?.is_enough_data === true);
        }
      } catch (e) {
        if (!cancelled) setUrineTrendOk(false);
      } finally {
        if (!cancelled) setUrineTrendLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [api, auth?.user?.id, referenceDate]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    let isCancelled = false;

    const fetchDayNight = async () => {
      setChartLoading(true);
      try {
        const response = await getTrendUrineWeeklyDayNight(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;

        setDaytimePercent(payload.daytimePercent ?? 0);
        setNightPercent(payload.nightPercent ?? 0);
        setDaytimeEpisodes(payload.daytimeEpisodes ?? 0);
        setNightEpisodes(payload.nightEpisodes ?? 0);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load urine day/night distribution:", error);
      } finally {
        if (!isCancelled) {
          setChartLoading(false);
        }
      }
    };

    fetchDayNight();

    return () => {
      isCancelled = true;
    };
  }, [api, auth?.user?.id, referenceDate]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchWeeklyAdvice = async () => {
      if (!urineTrendOk) {
        setAdviceLoading(false);
        return;
      }
      setAdviceLoading(true);
      try {
        const response = await postTrendUrineWeeklyAdvice(api, {
          daytimeEpisodes,
          nightEpisodes,
          daytimePercent,
          nightPercent,
        });
        const payload = response.data?.data ?? response.data;
        if (payload?.daytime && payload?.nighttime) {
          setAdvice({
            daytime: {
              title: payload.daytime.title || "Daytime Urine",
              desc: payload.daytime.desc || "",
            },
            nighttime: {
              title: payload.nighttime.title || "Nighttime Urine",
              desc: payload.nighttime.desc || "",
            },
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load urine weekly advice:", error);
        setAdvice({
          daytime: { title: "Daytime Urine", desc: "Unable to load advice." },
          nighttime: { title: "Nighttime Urine", desc: "Unable to load advice." },
        });
      } finally {
        setAdviceLoading(false);
      }
    };

    fetchWeeklyAdvice();
  }, [
    api,
    auth?.user?.id,
    urineTrendOk,
    daytimeEpisodes,
    nightEpisodes,
    daytimePercent,
    nightPercent,
  ]);

  const dayNightData = {
    labels: ["Daytime", "Nighttime"],
    datasets: [
      {
        data: [daytimePercent, nightPercent],
        backgroundColor: ["#FCD34D", "#818CF8"],
        borderColor: "#FFFFFF",
        borderWidth: 1,
        cutout: "70%",
      },
    ],
  };

  const commonDonutOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
      datalabels: { display: true, fomatValue: (value) => `${value}%`, color: "white" },
    },
  };

  // Fetch clarity distribution + advice (derived from weeklyScore + existing weekly day/night data)
  useEffect(() => {
    if (!auth?.user?.id) return;

    let isCancelled = false;

    const fetchWeeklyClarity = async () => {
      if (!urineTrendOk) {
        setClaritySegments({
          clearPercent: 0,
          lightYellowPercent: 0,
          darkYellowPercent: 0,
        });
        setClarityStats({
          dailyVolumeMl: 0,
          nighttimePercent: 0,
          urinationAvgPerDay: 0,
        });
        setClarityAdvice({
          primaryTitle: "",
          primaryDesc: "",
          secondaryTitle: "",
          secondaryDesc: "",
        });
        setClarityLoading(false);
        return;
      }
      setClarityLoading(true);
      try {
        const response = await getTrendUrineWeeklyScore(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.series)
            ? payload.series
            : [];

        const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const baseDots = dayLabels.map((d) => ({
          day: d,
          status: "clear",
          score: 0,
        }));

        rows.forEach((item) => {
          const jsDay = typeof item.day === "number" ? item.day : 0;
          if (jsDay < 0 || jsDay > 6) return;
          const status =
            item.score >= 66 ? "clear" : item.score >= 33 ? "yellow" : "abnormal";
          baseDots[jsDay] = {
            day: dayLabels[jsDay],
            status,
            score: item.score,
          };
        });

        let clarityTotal = 0;
        let clear = 0;
        let yellow = 0;
        let abnormal = 0;

        baseDots.forEach((item) => {
          clarityTotal += item.score;
          if (item.status === "clear") clear += 1;
          else if (item.status === "yellow") yellow += 1;
          else abnormal += 1;
        });

        const totalDays = baseDots.length || 1;
        const clearPercent = Math.round((clear / totalDays) * 100);
        const lightYellowPercent = Math.round((yellow / totalDays) * 100);
        const darkYellowPercent = Math.round((abnormal / totalDays) * 100);

        setClaritySegments({
          clearPercent,
          lightYellowPercent,
          darkYellowPercent,
        });

        const totalEpisodes = daytimeEpisodes + nightEpisodes;
        const urinationAvgPerDay = totalEpisodes ? +(totalEpisodes / 7).toFixed(1) : 0;

        setClarityStats({
          // Approximate daily volume from total weekly episodes (assume ~250ml per void)
          dailyVolumeMl: totalEpisodes ? Math.round((totalEpisodes * 250) / 7) : 0,
          nighttimePercent: nightPercent,
          urinationAvgPerDay,
        });

        const clarityRate = Math.round(
          (clarityTotal / (totalDays * 100 || 1)) * 100
        );

        const primaryTitle =
          clarityRate >= 60 ? "Urine Clarity Good" : "Urine Clarity Needs Attention";

        const primaryDesc =
          clarityRate >= 60
            ? "Mostly clear/light yellow, indicates adequate hydration."
            : "Frequent dark yellow episodes, consider increasing daily water intake.";

        const secondaryTitle =
          darkYellowPercent > 0
            ? `Mild Dehydration Alert ${darkYellowPercent}%`
            : "";

        const secondaryDesc =
          darkYellowPercent > 0
            ? "Occasional dark yellow urine, increase water intake."
            : "";

        setClarityAdvice({
          primaryTitle,
          primaryDesc,
          secondaryTitle,
          secondaryDesc,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load weekly urine clarity:", error);
      } finally {
        if (!isCancelled) {
          setClarityLoading(false);
        }
      }
    };

    fetchWeeklyClarity();

    return () => {
      isCancelled = true;
    };
  }, [
    api,
    auth?.user?.id,
    referenceDate,
    daytimeEpisodes,
    nightEpisodes,
    nightPercent,
    urineTrendOk,
  ]);

  // Fetch time distribution + advice
  useEffect(() => {
    if (!auth?.user?.id) return;

    let isCancelled = false;

    const fetchWeeklyTime = async () => {
      if (!urineTrendOk) {
        setTimeSegments({
          morningPercent: 0,
          forenoonPercent: 0,
          afternoonPercent: 0,
          eveningPercent: 0,
          nightPercent: 0,
        });
        setTimeStats({
          dailyVolumeMl: 0,
          nighttimePercent: 0,
          urinationAvgPerDay: 0,
        });
        setTimeHighlight({ title: "", desc: "" });
        setTimeAdvice({
          primaryTitle: "",
          primaryDesc: "",
          secondaryTitle: "",
          secondaryDesc: "",
        });
        setTimeLoading(false);
        return;
      }
      setTimeLoading(true);
      try {
        const response = await getTrendWaterWeeklyTime(api, {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;

        const segments = {
          morningPercent: payload.morningPercent ?? 0,
          forenoonPercent: payload.forenoonPercent ?? 0,
          afternoonPercent: payload.afternoonPercent ?? 0,
          eveningPercent: payload.eveningPercent ?? 0,
          nightPercent: payload.nightPercent ?? 0,
        };

        setTimeSegments(segments);

        setTimeStats({
          dailyVolumeMl: payload.dailyVolumeMl ?? payload.avgDailyVolumeMl ?? 0,
          nighttimePercent: payload.nighttimePercent ?? 0,
          urinationAvgPerDay: payload.urinationAvgPerDay ?? payload.urinationAvg ?? 0,
        });

        // Determine main time block highlight (largest share)
        const entries = Object.entries(segments);
        const top = entries.reduce(
          (max, [key, value]) => (value > max.value ? { key, value } : max),
          { key: "morningPercent", value: 0 }
        );

        const labelMap = {
          morningPercent: "Morning 6–9 AM",
          forenoonPercent: "Forenoon 9–12 AM",
          afternoonPercent: "Afternoon 12–6 PM",
          eveningPercent: "Evening 6–10 PM",
          nightPercent: "Night 10 PM–6 AM",
        };

        const defaultDescMap = {
          morningPercent: "Moderate urine shows normal night metabolism.",
          forenoonPercent: "Balanced daytime urination reflects regular hydration.",
          afternoonPercent: "Afternoon urination suggests stable daytime intake.",
          eveningPercent: "Pay attention to late-evening urination affecting sleep.",
          nightPercent: "Higher night urination may disturb sleep; reduce fluids before bed.",
        };

        setTimeHighlight({
          title: labelMap[top.key],
          desc: payload.highlightDesc || defaultDescMap[top.key],
        });

        setTimeAdvice({
          primaryTitle: payload.primaryTitle || "Urine Clarity Good",
          primaryDesc:
            payload.primaryDesc ||
            "Daytime volume balanced, shows regular hydration.",
          secondaryTitle:
            payload.secondaryTitle ||
            (payload.nighttimeFrequentDays != null
              ? `Nighttime Frequent – ${payload.nighttimeFrequentDays} Days`
              : "Nighttime Frequent"),
          secondaryDesc:
            payload.secondaryDesc ||
            "Frequent at night. Reduce fluids before bed for better sleep.",
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load weekly urine time distribution:", error);
      } finally {
        if (!isCancelled) {
          setTimeLoading(false);
        }
      }
    };

    fetchWeeklyTime();

    return () => {
      isCancelled = true;
    };
  }, [api, auth?.user?.id, referenceDate, urineTrendOk]);

  const [active, setActive] = useState("Day/Night");
  const tabs = ["Day/Night", "Clarity", "Time"];


  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  const location = useLocation();
  const isSubscribed = location.state?.subscribed || false;
  return (
    <>
      <Free showUpgrade={false} />
      <div className="flex items-center justify-center gap-4 sm:gap-10 text-sm mt-[30px] flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={
              active === tab
                ? "rounded-[8px] bg-white px-3 py-1.5 shadow-sm text-secondary "
                : "text-secondary hover:text-secondary"
            }
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="w-full space-y-4 px-4 py-6">
        {urineTrendLoading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : (
          <>
            {!urineTrendOk && <TrendInsufficientNotice className="mb-3" />}
            <div className={!urineTrendOk ? "opacity-40 grayscale pointer-events-none" : ""}>
              {active === "Day/Night" && (
                <>
                  {/* Donut card */}
                  <div className="rounded-[27px] bg-white px-4 py-5 sm:p-5 shadow-md">
                    <div className="relative mx-auto h-40 w-40 sm:h-44 sm:w-44">
                      {chartLoading ? (
                        <div className="flex h-full items-center justify-center">
                          <Loader />
                        </div>
                      ) : (
                        <>
                          <Doughnut data={dayNightData} options={commonDonutOptions} />

                          {/* Center content */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span>
                              <MdQueryBuilder className="text-custom-12" />
                            </span>
                            <span className="text-xs text-custom-12 flex items-center gap-1">
                              Day/Night
                            </span>
                            <span className="text-xs text-custom-12">
                              Block Details
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex justify-center gap-6 text-xs text-gray-600">
                      <LegendDot color="bg-yellow-400" label="Daytime" />
                      <LegendDot color="bg-indigo-400" label="Nighttime" />
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                    {chartLoading ? (
                      <div className="col-span-3 flex items-center justify-center text-xs text-secondary">
                        <Loader />
                      </div>
                    ) : (
                      <>
                        <StatCard
                          title="Episodes"
                          value={`${daytimeEpisodes + nightEpisodes}/week`}
                        />
                        <StatCard title="Nighttime %" value={`${nightPercent}%`} />
                        <StatCard
                          title="Day/Night"
                          value={`${daytimeEpisodes}:${nightEpisodes}`}
                        />
                      </>
                    )}
                  </div>

                  {/* Analysis & Advice (AI) */}
                  <div className="bg-white rounded-[27px] shadow-md px-4 py-6 sm:p-6">
                    <div className="space-y-3">
                      <h3 className="text-base font-medium text-primary">Analysis & Advice</h3>
                      {adviceLoading ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader />
                        </div>
                      ) : (
                        <>
                          <AdviceCard
                            icon={<Sun className="h-4 w-4 text-yellow-500" />}
                            title={advice.daytime.title}
                            desc={advice.daytime.desc}
                            bg="bg-yellow-50"
                          />
                          <AdviceCard
                            icon={<Moon className="h-4 w-4 text-indigo-500" />}
                            title={advice.nighttime.title}
                            desc={advice.nighttime.desc}
                            bg="bg-indigo-50"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {active === "Clarity" && (
                <>
                  {/* Clarity donut */}
                  <div className="rounded-[27px] bg-white px-4 py-5 sm:p-5 shadow-md">
                    <div className="relative mx-auto h-40 w-40 sm:h-44 sm:w-44">
                      {clarityLoading ? (
                        <div className="flex h-full items-center justify-center">
                          <Loader />
                        </div>
                      ) : (
                        <>
                          <Doughnut
                            data={{
                              labels: ["Clear", "Light Yellow", "Dark Yellow"],
                              datasets: [
                                {
                                  data: [
                                    claritySegments.clearPercent,
                                    claritySegments.lightYellowPercent,
                                    claritySegments.darkYellowPercent,
                                  ],
                                  backgroundColor: ["#4ade80", "#fde68a", "#f97316"],
                                  borderColor: "#FFFFFF",
                                  borderWidth: 1,
                                  cutout: "70%",
                                },
                              ],
                            }}
                            options={commonDonutOptions}
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span>
                              <MdQueryBuilder className="text-custom-12" />
                            </span>
                            <span className="text-xs text-custom-12 flex items-center gap-1">
                              Clarity
                            </span>
                            <span className="text-xs text-custom-12">
                              Block Details
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex justify-center gap-4 text-xs text-gray-600">
                      <LegendDot color="bg-emerald-400" label="Clear" />
                      <LegendDot color="bg-yellow-300" label="Light Yellow" />
                      <LegendDot color="bg-orange-400" label="Dark Yellow" />
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                    {clarityLoading ? (
                      <div className="col-span-3 flex items-center justify-center text-xs text-secondary">
                        <Loader />
                      </div>
                    ) : (
                      <>
                        <StatCard
                          title="Daily Volume"
                          value={`${clarityStats.dailyVolumeMl}ml`}
                        />
                        <StatCard
                          title="Nighttime %"
                          value={`${clarityStats.nighttimePercent}%`}
                        />
                        <StatCard
                          title="Urination Avg"
                          value={`${clarityStats.urinationAvgPerDay}/day`}
                        />
                      </>
                    )}
                  </div>

                  {/* Analysis & Advice (Clarity) */}
                  <div className="bg-white rounded-[27px] shadow-md p-6">
                    <div className="space-y-3">
                      <h3 className="text-base font-medium text-primary">Analysis & Advice</h3>
                      {clarityLoading ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader />
                        </div>
                      ) : (
                        <>
                          <AdviceCard
                            icon={<Sun className="h-4 w-4 text-emerald-500" />}
                            title={clarityAdvice.primaryTitle}
                            desc={clarityAdvice.primaryDesc}
                            bg="bg-emerald-50"
                          />
                          {clarityAdvice.secondaryTitle && (
                            <AdviceCard
                              icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
                              title={clarityAdvice.secondaryTitle}
                              desc={clarityAdvice.secondaryDesc}
                              bg="bg-amber-50"
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {active === "Time" && (
                <>
                  {/* Time distribution donut */}
                  <div className="rounded-[27px] bg-white px-4 py-5 sm:p-5 shadow-md">
                    <div className="relative mx-auto h-40 w-40 sm:h-44 sm:w-44">
                      {timeLoading ? (
                        <div className="flex h-full items-center justify-center">
                          <Loader />
                        </div>
                      ) : (
                        <>
                          <Doughnut
                            data={{
                              labels: [
                                "Morning 6–9",
                                "Forenoon 9–12",
                                "Afternoon 12–6",
                                "Evening 6–10",
                                "Night 10–6",
                              ],
                              datasets: [
                                {
                                  data: [
                                    timeSegments.morningPercent,
                                    timeSegments.forenoonPercent,
                                    timeSegments.afternoonPercent,
                                    timeSegments.eveningPercent,
                                    timeSegments.nightPercent,
                                  ],
                                  backgroundColor: [
                                    "#4ade80",
                                    "#60a5fa",
                                    "#fbbf24",
                                    "#a855f7",
                                    "#f97316",
                                  ],
                                  borderColor: "#FFFFFF",
                                  borderWidth: 1,
                                  cutout: "70%",
                                },
                              ],
                            }}
                            options={commonDonutOptions}
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span>
                              <MdQueryBuilder className="text-custom-12" />
                            </span>
                            <span className="text-xs text-custom-12 flex items-center gap-1">
                              Time Distribution
                            </span>
                            <span className="text-xs text-custom-12">
                              Block Details
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap justify-center gap-3 text-[11px] text-gray-600">
                      <LegendDot color="bg-emerald-400" label="Morning 6–9 AM" />
                      <LegendDot color="bg-sky-400" label="Forenoon 9–12 AM" />
                      <LegendDot color="bg-amber-400" label="Afternoon 12–6 PM" />
                      <LegendDot color="bg-violet-400" label="Evening 6–10 PM" />
                      <LegendDot color="bg-orange-500" label="Night 10 PM–6 AM" />
                    </div>
                  </div>

                  {/* Highlight card under chart */}
                  <div className="rounded-[10px] bg-[#f0f9ff] p-4 text-sm mb-3 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
                    <p className="text-primary font-medium mb-1">{timeHighlight.title}</p>
                    <p className="text-secondary text-xs">{timeHighlight.desc}</p>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {timeLoading ? (
                      <div className="col-span-3 flex items-center justify-center text-xs text-secondary">
                        <Loader />
                      </div>
                    ) : (
                      <>
                        <StatCard
                          title="Daily Volume"
                          value={`${timeStats.dailyVolumeMl}ml`}
                        />
                        <StatCard
                          title="Nighttime %"
                          value={`${timeStats.nighttimePercent}%`}
                        />
                        <StatCard
                          title="Urination Avg"
                          value={`${timeStats.urinationAvgPerDay}/day`}
                        />
                      </>
                    )}
                  </div>

                  {/* Analysis & Advice (Time) */}
                  <div className="bg-white rounded-[27px] shadow-md p-6">
                    <div className="space-y-3">
                      <h3 className="text-base font-medium text-primary">Analysis and</h3>
                      {timeLoading ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader />
                        </div>
                      ) : (
                        <>
                          <AdviceCard
                            icon={<Sun className="h-4 w-4 text-amber-500" />}
                            title={timeAdvice.primaryTitle}
                            desc={timeAdvice.primaryDesc}
                            bg="bg-amber-50"
                          />
                          {timeAdvice.secondaryTitle && (
                            <AdviceCard
                              icon={<Moon className="h-4 w-4 text-indigo-500" />}
                              title={timeAdvice.secondaryTitle}
                              desc={timeAdvice.secondaryDesc}
                              bg="bg-indigo-50"
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="text-center text-sm text-custom-12 italic mt-5">
                For reference only. Consult a doctor if needed.
              </div>
            </div>
            <Upgrade />
          </>
        )}
      </div>
    </>
  );
};

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-3 w-3 rounded ${color}`} />
      <span>{label}</span>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-[10px] bg-white p-3 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <p className="text-sm text-secondary">{title}</p>
      <p className="mt-[6px] text-[#f09129]">{value}</p>
    </div>
  );
}

function AdviceCard({ icon, title, desc, bg }) {
  return (
    <div className={`rounded-[8px] p-4 ${bg} shadow-[0_2px_4px_rgba(0,0,0,0.08)]`}>
      <div className="flex items-center gap-2 text-base text-secondary">
        {icon}
        {title}
      </div>
      <p className="mt-1 text-sm text-secondary">{desc}</p>
    </div>
  );
}

export default Week;
