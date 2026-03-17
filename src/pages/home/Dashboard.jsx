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
  const [bowelSegments, setBowelSegments] = useState(0);

  const [dietLoading, setDietLoading] = useState(false);
  const [dietIntakePercent, setDietIntakePercent] = useState(0);
  const [dietStatus, setDietStatus] = useState("Not Recorded");
  const [waterLoading, setWaterLoading] = useState(false);
  const [waterIntakePercent, setWaterIntakePercent] = useState(0);
  const [waterStatus, setWaterStatus] = useState("Not Recorded");
  const [urineLoading, setUrineLoading] = useState(false);
  const [urineSegments, setUrineSegments] = useState(0);
  const [urineStatus, setUrineStatus] = useState("Not Recorded");

  const isPageLoading =
    bowelLoading || dietLoading || waterLoading || urineLoading;

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchBowelWeeklySummary = async () => {
      setBowelLoading(true);
      try {
        // First, check whether there is any bowel record *today* using the dailyCount API.
        let hasTodayRecord = false;
        try {
          const dailyRes = await api.get("/trend/bowel/dailyCount", {
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

        const res = await api.get("/trend/bowel/weeklySummary", {
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
          setBowelSegments(0);
          return;
        }

        // Derive *today's* bowel status/segments from the weekly distribution if available.
        const typeDistribution = Array.isArray(payload.typeDistribution)
          ? payload.typeDistribution
          : [];

        const hasAnyType = typeDistribution.some((v) => (v || 0) > 0);

        if (!hasAnyType) {
          setBowelStatus("Not Recorded");
          setBowelSegments(0);
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

        // Map today's score 0–100 to 0–5 segments (0 means effectively "no data")
        const rawSegments = Math.round(todayScore / 20);
        const clampedSegments =
          todayScore > 0 ? Math.max(1, Math.min(5, rawSegments)) : 0;
        setBowelSegments(clampedSegments);

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
        setBowelSegments(0);
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
        const res = await api.get("/trend/diet/dailySummary", {
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
        const res = await api.get("/trend/water/dailyMl", {
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
        const res = await api.get("/trend/urine/weeklyScore", {
          params: {
            userId: auth.user.id,
            referenceDate: ref,
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = res.data?.data ?? res.data;
        const scores = Array.isArray(payload) ? payload : [];
        if (!scores.length) {
          setUrineSegments(0);
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
          setUrineSegments(0);
          setUrineStatus("Not Recorded");
          return;
        }

        // Map today's score 0–100 to segments 1–5
        const rawSegments = Math.round(todayScore / 20);
        const clampedSegments = Math.max(1, Math.min(5, rawSegments));
        setUrineSegments(clampedSegments);

        let statusText = "";
        if (todayScore < 40) statusText = "Needs attention";
        else if (todayScore < 70) statusText = "Fair";
        else statusText = "Good";
        setUrineStatus(statusText);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load urine weekly score for dashboard:", error);
        setUrineSegments(0);
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
                  {bowelLoading ? (
                    <div className="flex items-center justify-start h-7 mt-1">
                      <InlineLoader />
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, index) => {
                          const isActive = index < bowelSegments;
                          const baseClass =
                            "h-6 w-6 rounded-full transition-all duration-300";
                          return (
                            <p
                              // eslint-disable-next-line react/no-array-index-key
                              key={index}
                              className={
                                isActive
                                  ? `${baseClass} bg-custom-13`
                                  : `${baseClass} bg-[#dfe1db]`
                              }
                            />
                          );
                        })}
                      </div>
                      <p className="text-primary-muted text-base">
                        {bowelStatus}
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
                  {urineLoading ? (
                    <div className="flex items-center justify-start h-7 mt-1">
                      <InlineLoader />
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, index) => {
                          const baseClass =
                            "h-6 w-6 rounded-full transition-all duration-300";
                          const isActive = index < urineSegments;
                          return (
                            // eslint-disable-next-line react/no-array-index-key
                            <p
                              key={index}
                              className={
                                isActive
                                  ? `${baseClass} bg-[#facc15]`
                                  : `${baseClass} bg-[#dfe1db]`
                              }
                            />
                          );
                        })}
                      </div>
                      <p className="text-primary-muted text-base">
                        {urineStatus}
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
