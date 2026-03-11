import { FaPoop } from "react-icons/fa";
import { FaUtensils } from "react-icons/fa";
import { FaGlassWhiskey } from "react-icons/fa";
import { MdWaterDrop } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa6";

import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";

const Dashboard = () => {
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  const userId = auth?.user?.id || clerkUser?.id;
  const userDisplayName =
    auth?.user?.firstName ||
    auth?.user?.username ||
    clerkUser?.firstName ||
    clerkUser?.username ||
    "";

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
    if (!userId) return;

    const fetchBowelWeeklySummary = async () => {
      setBowelLoading(true);
      try {
        const res = await api.get("/trend/bowel/weeklySummary", {
          params: { userId },
        });
        const payload = res.data?.data ?? res.data;
        if (!payload) return;

        const score = Number(payload.score || 0);
        const changePercent = Number(payload.changePercent || 0);
        const typeDistribution = Array.isArray(payload.typeDistribution)
          ? payload.typeDistribution
          : [];
        const hasAnyType = typeDistribution.some((v) => (v || 0) > 0);

        setBowelScore(score);
        setBowelChangePercent(changePercent);

        if (!hasAnyType && score === 0) {
          setBowelStatus("Not Recorded");
          setBowelSegments(0);
          return;
        }

        setBowelStatus(
          typeof payload.status === "string" && payload.status.trim()
            ? payload.status
            : "Good"
        );

        // Map 0–100 score into 0–5 filled segments (at least 1 if there is data)
        const rawSegments = Math.round(score / 20);
        const clampedSegments = Math.max(1, Math.min(5, rawSegments));
        setBowelSegments(clampedSegments);
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
  }, [api, userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchDietToday = async () => {
      setDietLoading(true);
      try {
        const res = await api.get("/trend/diet/dailySummary", {
          params: { userId },
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
  }, [api, userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchWaterToday = async () => {
      setWaterLoading(true);
      try {
        const res = await api.get("/trend/water/dailyMl", {
          params: { userId },
        });
        const payload = res.data?.data ?? res.data;
        const mlPerDay = Array.isArray(payload?.mlPerDay) ? payload.mlPerDay : [];
        if (!mlPerDay.length) {
          setWaterIntakePercent(0);
          setWaterStatus("Not Recorded");
          return;
        }

        // Assume last entry corresponds to the latest day in the selected week
        const todayMl = mlPerDay[mlPerDay.length - 1] || 0;
        const DAILY_TARGET_ML = 2000;
        const rawPct = Math.round((todayMl / DAILY_TARGET_ML) * 100);
        const clampedPct = Math.max(0, Math.min(100, rawPct));
        setWaterIntakePercent(clampedPct);

        let statusText = "";
        if (rawPct < 60) statusText = "Low Intake";
        else if (rawPct <= 120) statusText = "On Track";
        else statusText = "High Intake";
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
  }, [api, userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchUrineWeek = async () => {
      setUrineLoading(true);
      try {
        const res = await api.get("/trend/urine/weeklyScore", {
          params: { userId },
        });
        const payload = res.data?.data ?? res.data;
        const scores = Array.isArray(payload) ? payload : [];
        if (!scores.length) {
          setUrineSegments(0);
          setUrineStatus("Not Recorded");
          return;
        }

        const avg = Math.round(
          scores.reduce((sum, item) => sum + (Number(item.score || 0)), 0) /
            scores.length
        );

        // Map average score 0–100 to segments 1–5
        const rawSegments = Math.round(avg / 20);
        const clampedSegments = Math.max(1, Math.min(5, rawSegments));
        setUrineSegments(clampedSegments);

        let statusText = "";
        if (avg < 40) statusText = "Needs attention";
        else if (avg < 70) statusText = "Fair";
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
  }, [api, userId]);
  return (
    <div className="flex flex-col relative h-full p-4">
      {/* Upper Scrollable Area */}
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-primary mb-5">
            Hi {userDisplayName}
          </h3>
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
                <span className="text-primary-muted text-sm">
                  Monitor your Bowel health
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-full gap-1">
                  <span className="text-primary-muted text-sm">
                    Bowel Status
                  </span>
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
                  <p className="text-primary-muted text-xs">
                    {bowelStatus}
                  </p>
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
                <span className="text-primary-muted text-sm">
                  Help Adjust Eating
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-full gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-primary text-sm ">
                      Today's Intake
                    </span>
                    <span className="text-primary text-sm ">
                      {`${dietIntakePercent}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
                    <div
                      className="bg-[#ac95cc] h-3 rounded-full transition-all"
                      style={{ width: `${dietIntakePercent}%` }}
                    />
                  </div>
                  <p className="text-primary text-sm">
                    {dietStatus}
                  </p>
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
                <span className="text-primary-muted text-sm">
                  Track Water Intake
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-full gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-primary text-sm ">
                      Today's Intake
                    </span>
                    <span className="text-primary text-sm ">
                      {`${waterIntakePercent}%`}
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
                    <div
                      className="bg-custom-13 h-3 rounded-full transition-all"
                      style={{ width: `${waterIntakePercent}%` }}
                    />
                  </div>
                  <p className="text-primary-muted text-xs">
                    {waterStatus}
                  </p>
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
                <span className="text-primary-muted text-sm">
                  Check Urine Health
                </span>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-full gap-1">
                  <span className="text-primary-muted text-sm">
                    Urine Status
                  </span>
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
                  <p className="text-primary-muted text-xs">
                    {urineStatus}
                  </p>
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
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
