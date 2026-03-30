import { FaPoop } from "react-icons/fa";
import { FaUtensils } from "react-icons/fa";
import { FaGlassWhiskey } from "react-icons/fa";
import { MdWaterDrop } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa6";

import { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import {
  getRecordBowelRecent,
  getRecordUrineRecent,
  getTrendBowelDailyCount,
  getTrendBowelWeeklySummary,
  getTrendDietDailySummary,
  getTrendUrineWeeklyScore,
  getTrendWaterDailyMl,
} from "@/api/http";

const DOT_GREY = "#dfe1db";

/** Stool color picker labels (see stool page) → hex */
const BOWEL_STOOL_COLOR_HEX = {
  brown: "#8b4513",
  black: "#000000",
  yellow: "#daa520",
  red: "#990000",
  green: "#556b2f",
};

/** Bristol-style fallback when color is missing */
const BRISTOL_TYPE_COLORS = ["#9AD0A1", "#D4AE7C", "#E0B85C", "#B5652E", "#9CA3AF"];

const shapeToBristolIndex = (shape) => {
  const value = String(shape || "").toLowerCase();
  if (value.includes("hard")) return 0;
  if (value.includes("lumpy")) return 1;
  if (value.includes("firm")) return 2;
  if (value.includes("smooth")) return 3;
  if (value.includes("soft") || value.includes("mushy") || value.includes("watery")) return 4;
  return 2;
};

const hexForBowelRecord = (record) => {
  const raw = String(record?.color || "").trim().toLowerCase();
  if (raw) {
    if (BOWEL_STOOL_COLOR_HEX[raw]) return BOWEL_STOOL_COLOR_HEX[raw];
    const key = Object.keys(BOWEL_STOOL_COLOR_HEX).find((k) => raw.includes(k));
    if (key) return BOWEL_STOOL_COLOR_HEX[key];
  }
  const idx = shapeToBristolIndex(record?.shape);
  return BRISTOL_TYPE_COLORS[idx] ?? "#9ca3af";
};

/** Urine color slider labels (see UrineRecord) → hex */
const URINE_COLOR_HEX = {
  transparent: "#d0e8f2",
  "pale yellow": "#fff9c4",
  "light yellow": "#ffeb3b",
  "dark yellow": "#fbc02d",
  "deep yellow": "#f9a825",
  "amber/brown": "#6d4c41",
  amber: "#6d4c41",
};

const hexForUrineRecord = (record) => {
  const raw = String(record?.color || "").trim().toLowerCase();
  if (raw) {
    if (URINE_COLOR_HEX[raw]) return URINE_COLOR_HEX[raw];
    if (raw.includes("amber")) return URINE_COLOR_HEX["amber/brown"];
    if (raw.includes("pale")) return URINE_COLOR_HEX["pale yellow"];
    if (raw.includes("deep") || raw.includes("dark")) return URINE_COLOR_HEX["dark yellow"];
    if (raw.includes("light")) return URINE_COLOR_HEX["light yellow"];
    if (raw.includes("transparent")) return URINE_COLOR_HEX.transparent;
  }
  const cl = String(record?.clarity || "").toLowerCase();
  if (cl.includes("clear")) return "#59ce8b";
  if (cl.includes("slightly")) return "#ffdc6c";
  if (cl.includes("noticeably")) return "#f66b6b";
  return "#9ca3af";
};

/** `records` = newest first (API). Five slots left→right = oldest → newest; empty slots on the right = grey. */
const buildFiveDotSlots = (records, hexForRecord) => {
  const slots = Array.from({ length: 5 }, () => ({
    filled: false,
    hex: null,
  }));
  const n = Math.min(5, records.length);
  for (let i = 0; i < n; i += 1) {
    const record = records[n - 1 - i];
    slots[i] = {
      filled: true,
      hex: hexForRecord(record),
    };
  }
  return slots;
};

const InlineLoader = () => (
  <div className="dash-load-3">
    <span className="dash-line" />
    <span className="dash-line" />
    <span className="dash-line" />
  </div>
);

const Dashboard = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const [bowelLoading, setBowelLoading] = useState(false);
  const [bowelScore, setBowelScore] = useState(0);
  const [bowelStatus, setBowelStatus] = useState("Not Recorded");
  const [bowelChangePercent, setBowelChangePercent] = useState(0);
  const [bowelDots, setBowelDots] = useState(() =>
    Array.from({ length: 5 }, () => ({ filled: false, hex: null }))
  );
  const [bowelDotsLoading, setBowelDotsLoading] = useState(true);

  const [dietLoading, setDietLoading] = useState(false);
  const [dietIntakePercent, setDietIntakePercent] = useState(0);
  const [dietStatus, setDietStatus] = useState("Not Recorded");
  const [waterLoading, setWaterLoading] = useState(false);
  const [waterIntakePercent, setWaterIntakePercent] = useState(0);
  const [waterStatus, setWaterStatus] = useState("Not Recorded");
  const [urineLoading, setUrineLoading] = useState(false);
  const [urineDots, setUrineDots] = useState(() =>
    Array.from({ length: 5 }, () => ({ filled: false, hex: null }))
  );
  const [urineDotsLoading, setUrineDotsLoading] = useState(true);
  const [urineStatus, setUrineStatus] = useState("Not Recorded");

  const isPageLoading =
    bowelLoading ||
    dietLoading ||
    waterLoading ||
    urineLoading ||
    bowelDotsLoading ||
    urineDotsLoading;

  useEffect(() => {
    if (!auth?.user?.id) {
      setBowelDots(Array.from({ length: 5 }, () => ({ filled: false, hex: null })));
      setBowelDotsLoading(false);
      setUrineDots(Array.from({ length: 5 }, () => ({ filled: false, hex: null })));
      setUrineDotsLoading(false);
      return;
    }

    let cancelled = false;

    const loadRecentDots = async () => {
      setBowelDotsLoading(true);
      setUrineDotsLoading(true);
      try {
        const [bowelRes, urineRes] = await Promise.all([
          getRecordBowelRecent(api, {
            params: { userId: auth.user.id, limit: 5 },
          }),
          getRecordUrineRecent(api, {
            params: { userId: auth.user.id, limit: 5 },
          }),
        ]);

        if (cancelled) return;

        const bowelPayload = bowelRes.data?.data ?? bowelRes.data;
        const bowelRecords = Array.isArray(bowelPayload?.records)
          ? bowelPayload.records
          : [];
        setBowelDots(buildFiveDotSlots(bowelRecords, hexForBowelRecord));

        const urinePayload = urineRes.data?.data ?? urineRes.data;
        const urineRecords = Array.isArray(urinePayload?.records)
          ? urinePayload.records
          : [];
        setUrineDots(buildFiveDotSlots(urineRecords, hexForUrineRecord));
      } catch (error) {
        if (!cancelled) {
          // eslint-disable-next-line no-console
          console.error("Failed to load recent record dots for dashboard:", error);
          setBowelDots(Array.from({ length: 5 }, () => ({ filled: false, hex: null })));
          setUrineDots(Array.from({ length: 5 }, () => ({ filled: false, hex: null })));
        }
      } finally {
        if (!cancelled) {
          setBowelDotsLoading(false);
          setUrineDotsLoading(false);
        }
      }
    };

    loadRecentDots();
    return () => {
      cancelled = true;
    };
  }, [api, auth?.user?.id]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchBowelWeeklySummary = async () => {
      setBowelLoading(true);
      try {
        // First, check whether there is any bowel record *today* using the dailyCount API.
        let hasTodayRecord = false;
        try {
          const dailyRes = await getTrendBowelDailyCount(api, {
            params: { userId: auth.user.id },
          });
          const dailyPayload = dailyRes.data?.data ?? dailyRes.data;
          const dailyCounts = Array.isArray(dailyPayload?.dailyCounts)
            ? dailyPayload.dailyCounts
            : [];
          const dayLabels = Array.isArray(dailyPayload?.days)
            ? dailyPayload.days
            : [];

          if (dailyCounts.length && dayLabels.length) {
            const jsDay = new Date().getDay(); // 0..6, where 0 is Sunday
            const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const todayLabel = weekLabels[jsDay];
            const idx = dayLabels.indexOf(todayLabel);
            const todayCount = idx >= 0 ? Number(dailyCounts[idx] || 0) : 0;
            hasTodayRecord = todayCount > 0;
          }
        } catch {
          // If this check fails, we fall back to weekly summary logic below.
        }

        const res = await getTrendBowelWeeklySummary(api, {
          params: { userId: auth.user.id },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) return;

        const score = Number(payload.score || 0);
        const changePercent = Number(payload.changePercent || 0);
        // We still keep weekly score and change for potential use elsewhere
        setBowelScore(score);
        setBowelChangePercent(changePercent);

        // If there is no bowel record today according to dailyCount,
        // show "Not Recorded" regardless of weekly aggregates.
        if (!hasTodayRecord) {
          setBowelStatus("Not Recorded");
          return;
        }

        // Derive *today's* bowel status/segments from the weekly distribution if available.
        const typeDistribution = Array.isArray(payload.typeDistribution)
          ? payload.typeDistribution
          : [];

        const hasAnyType = typeDistribution.some((v) => (v || 0) > 0);

        if (!hasAnyType) {
          setBowelStatus("Not Recorded");
          return;
        }

        // Heuristic: use today's score (if exposed) to determine a finer-grained status,
        // otherwise fall back to the general weekly status.
        const now = new Date();
        const jsDay = now.getDay(); // 0..6, where 0 is Sunday

        // If backend exposes `dailyScores`/`todayScore` in the weekly summary, prefer it.
        const todayScore =
          typeof payload.todayScore === "number"
            ? payload.todayScore
            : typeof payload.dailyScores?.[jsDay] === "number"
            ? payload.dailyScores[jsDay]
            : score;

        let statusText = "";
        if (todayScore <= 0 && !payload.status) {
          statusText = "Not Recorded";
        } else if (typeof payload.todayStatus === "string" && payload.todayStatus.trim()) {
          statusText = payload.todayStatus;
        } else if (todayScore < 40) {
          statusText = "Needs attention";
        } else if (todayScore < 70) {
          statusText = "Fair";
        } else {
          statusText = "Good";
        }

        setBowelStatus(statusText);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load bowel weekly summary for dashboard:", error);
        setBowelStatus("Not Recorded");
      } finally {
        setBowelLoading(false);
      }
    };

    fetchBowelWeeklySummary();
  }, [api, auth?.user?.id]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchDietToday = async () => {
      setDietLoading(true);
      try {
        const res = await getTrendDietDailySummary(api, {
          params: {
            userId: auth.user.id,
            referenceDate: new Date().toISOString(),
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) {
          setDietIntakePercent(0);
          setDietStatus("Not Recorded");
          return;
        }

        const calories = Number(payload.calories || 0);
        const hasData =
          calories > 0 ||
          Number(payload.protein_g || 0) > 0 ||
          Number(payload.fat_g || 0) > 0 ||
          Number(payload.carb_g || 0) > 0;

        if (!hasData) {
          setDietIntakePercent(0);
          setDietStatus("Not Recorded");
          return;
        }

        const CAL_TARGET = 2100;
        const rawPct = Math.round((calories / CAL_TARGET) * 100);
        const clampedPct = Math.max(0, Math.min(100, rawPct));
        setDietIntakePercent(clampedPct);

        let statusText = "";
        if (rawPct < 60) statusText = "Low Intake";
        else if (rawPct <= 120) statusText = "On Track";
        else statusText = "High Intake";
        setDietStatus(statusText);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load diet daily summary for dashboard:", error);
        setDietIntakePercent(0);
        setDietStatus("Not Recorded");
      } finally {
        setDietLoading(false);
      }
    };

    fetchDietToday();
  }, [api, auth?.user?.id]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchWaterToday = async () => {
      setWaterLoading(true);
      try {
        const res = await getTrendWaterDailyMl(api, {
          params: {
            userId: auth.user.id,
            referenceDate: new Date().toISOString(),
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = res.data?.data ?? res.data;
        const mlPerDay = Array.isArray(payload?.mlPerDay) ? payload.mlPerDay : [];
        if (!mlPerDay.length) {
          setWaterIntakePercent(0);
          setWaterStatus("Not Recorded");
          return;
        }

        // Determine today's index in the weekly array (Mon=0 ... Sun=6)
        const now = new Date();
        const jsDay = now.getDay(); // 0..6, where 0 is Sunday
        const todayIdx = jsDay === 0 ? 6 : jsDay - 1;

        const todayMl = mlPerDay[todayIdx] || 0;

        // Convert today's ml into percentage of user's daily water goal
        const goal =
          typeof auth?.user?.waterIntakeGoal === "number" &&
          !Number.isNaN(auth.user.waterIntakeGoal)
            ? auth.user.waterIntakeGoal
            : 2000;

        // Use the *raw* percentage for display (can exceed 100%)
        const rawPct = goal > 0 ? Math.round((todayMl / goal) * 100) : 0;
        setWaterIntakePercent(rawPct);

        // Water health status aligned with Water Trend (Free) page
        let statusText = "";
        if (rawPct <= 0) {
          statusText = "Not Recorded";
        } else if (rawPct < 60) {
          statusText = "Too Low";
        } else if (rawPct <= 120) {
          statusText = "Good";
        } else {
          statusText = "Too High";
        }

        setWaterStatus(statusText);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load water daily intake for dashboard:", error);
        setWaterIntakePercent(0);
        setWaterStatus("Not Recorded");
      } finally {
        setWaterLoading(false);
      }
    };

    fetchWaterToday();
  }, [api, auth?.user?.id]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchUrineWeek = async () => {
      setUrineLoading(true);
      try {
        const ref = new Date().toISOString();
        const res = await getTrendUrineWeeklyScore(api, {
          params: {
            userId: auth.user.id,
            referenceDate: ref,
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = res.data?.data ?? res.data;
        const scores = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.series)
            ? payload.series
            : [];
        if (!scores.length) {
          setUrineStatus("Not Recorded");
          return;
        }

        // Derive today's urine score from the weekly scores array
        const now = new Date();
        const jsDay = now.getDay(); // 0..6, where 0 is Sunday
        const todayEntry = scores.find(
          (item) => Number(item.day) === jsDay
        );

        const todayScore = todayEntry ? Number(todayEntry.score || 0) : 0;

        if (!todayEntry || todayScore <= 0) {
          setUrineStatus("Not Recorded");
          return;
        }

        let statusText = "";
        if (todayScore < 40) statusText = "Needs attention";
        else if (todayScore < 70) statusText = "Fair";
        else statusText = "Good";
        setUrineStatus(statusText);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load urine weekly score for dashboard:", error);
        setUrineStatus("Not Recorded");
      } finally {
        setUrineLoading(false);
      }
    };

    fetchUrineWeek();
  }, [api, auth?.user?.id]);
  return (
    <main className="flex flex-col relative h-full p-4">
      {/* Upper Scrollable Area */}
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-primary mb-5">Hi {auth.user != null && (auth.user.firstName || auth.user.username)}</h3>
          <p className="text-primary-muted">How is your health today?</p>
        </div>
        <div className="flex flex-col gap-5 mt-4">
          <div
            className={`relative flex justify-start gap-3 bg-[#dfd2b2] rounded-[15px] p-5 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.16)] ${
              isPageLoading ? "opacity-60 pointer-events-none" : ""
            }`}
            onClick={() => navigate("/stool")}
          >
            <div className="flex-0">
              <FaPoop className="text-primary" size={24} />
            </div>
            <div className="flex-1 flex flex-col text-start gap-2">
              <div className="flex gap-2 items-center">
                <span className="text-primary font-medium text-lg">Poop</span>
                <span className="text-primary-muted text-base">
                  Monitor your Bowel health
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-full gap-1">
                  <span className="text-primary-muted text-base">
                    Bowel Status
                  </span>
                  {bowelDotsLoading ? (
                    <div className="flex items-center justify-start h-7 mt-1">
                      <InlineLoader />
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        {bowelDots.map((dot, index) => (
                          <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            className="h-6 w-6 rounded-full transition-all duration-300 shrink-0 border border-black/5"
                            style={{
                              backgroundColor:
                                dot.filled && dot.hex ? dot.hex : DOT_GREY,
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-primary-muted text-base">
                        {bowelLoading ? "…" : bowelStatus}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex items-center">
                  <FaChevronRight className="text-primary" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`relative flex justify-start gap-3 bg-[#e0d5e6] rounded-[15px] p-5 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.16)] ${
              isPageLoading ? "opacity-60 pointer-events-none" : ""
            }`}
            onClick={() => navigate("/diet-record")}
          >
            <div>
              <FaUtensils className="text-primary" size={24} />
            </div>
            <div className="flex-1 flex flex-col text-start gap-2">
              <div className="flex gap-2 items-center">
                <span className="text-primary font-medium text-lg">
                  Diet Record
                </span>
                <span className="text-primary-muted text-base">
                  Help Adjust Eating
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-full gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-primary text-[20px] ">
                      Today's Intake
                    </span>
                    <span className="text-primary text-[20px] ">
                      {dietLoading ? "--" : `${dietIntakePercent}%`}
                    </span>
                  </div>
                  {dietLoading ? (
                    <div className="flex items-center justify-start h-3 mt-1">
                      <InlineLoader />
                    </div>
                  ) : (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
                        <div
                          className="bg-[#ac95cc] h-[12px] rounded-full transition-all"
                          style={{ width: `${dietIntakePercent}%` }}
                        />
                      </div>
                      <p className="text-primary text-base">
                        {dietStatus}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex items-center">
                  <FaChevronRight className="text-primary" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`relative flex justify-start gap-3 bg-[#d7eaf8] rounded-[15px] p-5 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.16)] ${
              isPageLoading ? "opacity-60 pointer-events-none" : ""
            }`}
            onClick={() => navigate("/water-record")}
          >
            <div>
              <FaGlassWhiskey className="text-primary" size={24} />
            </div>
            <div className="flex-1 flex flex-col text-start gap-2">
              <div className="flex gap-2 items-center">
                <span className="text-primary font-medium text-lg">Water</span>
                <span className="text-primary-muted text-base">
                  Track Water Intake
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-full gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-primary text-[20px] ">
                      Today's Intake
                    </span>
                    <span className="text-primary text-[20px] ">
                      {waterLoading ? "--" : `${waterIntakePercent}%`}
                    </span>
                  </div>
                  {waterLoading ? (
                    <div className="flex items-center justify-start h-3 mt-1">
                      <InlineLoader />
                    </div>
                  ) : (
                    <>
                      <div className="w-full bg-white rounded-full h-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
                        <div
                          className="bg-custom-13 h-[12px] rounded-full transition-all"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, waterIntakePercent)
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-primary-muted text-base">
                        {waterStatus}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex items-center">
                  <FaChevronRight className="text-primary" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`relative flex justify-start gap-3 bg-[#fff3cd] rounded-[15px] p-5 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.16)] ${
              isPageLoading ? "opacity-60 pointer-events-none" : ""
            }`}
            onClick={() => navigate("/urine-record")}
          >
            <div>
              <MdWaterDrop className="text-primary" size={24} />
            </div>
            <div className="flex-1 flex flex-col text-start gap-2">
              <div className="flex gap-2 items-center">
                <span className="text-primary font-bold text-lg">
                  Urine Record
                </span>
                <span className="text-primary-muted text-base">
                  Check Urine Health
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-full gap-1">
                  <span className="text-primary-muted text-base">
                    Urine Status
                  </span>
                  {urineDotsLoading ? (
                    <div className="flex items-center justify-start h-7 mt-1">
                      <InlineLoader />
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        {urineDots.map((dot, index) => (
                          <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            className="h-6 w-6 rounded-full transition-all duration-300 shrink-0 border border-black/5"
                            style={{
                              backgroundColor:
                                dot.filled && dot.hex ? dot.hex : DOT_GREY,
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-primary-muted text-base">
                        {urineLoading ? "…" : urineStatus}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex items-center">
                  <FaChevronRight className="text-primary" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPageLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto bg-black/5">
          <div className="rounded-full bg-white px-4 py-3 shadow-md">
            <InlineLoader />
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
