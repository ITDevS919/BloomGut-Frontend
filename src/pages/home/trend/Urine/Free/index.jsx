import Upgrade from "./Upgrade";
import { FaSmile } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import Loader from "@/components/common/Loader";

const URINE_PRIMARY_COLOR = "#F09129";

const getScorePosition = (score) =>
  Math.max(0, Math.min(100, Math.round(typeof score === "number" ? score : 0)));

const getIndicatorColor = (value) => {
  if (value >= 81) return URINE_PRIMARY_COLOR;
  if (value >= 61) return "#FBC02D"; // Yellow segment (61–80)
  return "#F66B6B"; // Red segment (0–60)
};

const Free = ({ showUpgrade = true, referenceDate }) => {
  const [dotData, setDotData] = useState([]);
  const colors = {
    clear: "bg-[#59ce8b]",
    yellow: "bg-[#ffdc6c]",
    abnormal: "bg-[#f66b6b]",
  };
  const [clearCount, setClearCount] = useState(0);
  const [yellowCount, setYellowCount] = useState(0);
  const [abnormalCount, setAbnormalCount] = useState(0);
  const [clarityRate, setClarityRate] = useState(0);
  const [weekScore, setWeekScore] = useState(0);
  const [beforeWeekScore, setBeforeWeekScore] = useState(0);
  const [healthTips, setHealthTips] = useState([]);

  const [dotsLoaded, setDotsLoaded] = useState(false);
  const [scoreLoaded, setScoreLoaded] = useState(false);
  const [tipsLoaded, setTipsLoaded] = useState(true);

  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchWeeklyDots = async () => {
      try {
        const response = await api.get("/trend/urine/weeklyScore", {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = response.data?.data || response.data;
        if (!Array.isArray(payload)) return;

        const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        // Initialize weekly dots with score 0; DB values will override where present.
        const baseDots = dayLabels.map((d) => ({
          day: d,
          status: "clear",
          score: 0,
        }));

        payload.forEach((item) => {
          const jsDay = typeof item.day === "number" ? item.day : 0; // 0–6
          if (jsDay < 0 || jsDay > 6) return;
          const status =
            item.score >= 66 ? "clear" : item.score >= 33 ? "yellow" : "abnormal";
          baseDots[jsDay] = {
            day: dayLabels[jsDay],
            status,
            score: item.score,
          };
        });

        let clarity = 0;
        let clear = 0;
        let yellow = 0;
        let abnormal = 0;

        baseDots.forEach((item) => {
          clarity += item.score;
          if (item.status === "clear") clear += 1;
          else if (item.status === "yellow") yellow += 1;
          else abnormal += 1;
        });

        setClearCount(clear);
        setYellowCount(yellow);
        setAbnormalCount(abnormal);

        const maxTotal = baseDots.length * 100 || 1;
        setClarityRate(Math.round((clarity / maxTotal) * 100));
        setDotData(baseDots);
      } catch (err) {
        // eslint-disable-next-line no-console
      } finally {
        setDotsLoaded(true);
      }
    };

    fetchWeeklyDots();
  }, [api, auth?.user?.id, referenceDate]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchWeeklyScores = async () => {
      try {
        const response = await api.get("/trend/urine/compareWeeklyScore", {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
            timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;
        const currentWeekScore = payload.weekScore ?? 0;
        setBeforeWeekScore(payload.beforeWeekScore ?? 0);
        setWeekScore(currentWeekScore);
      } catch (err) {
        // eslint-disable-next-line no-console
      } finally {
        setScoreLoaded(true);
      }
    };

    fetchWeeklyScores();
  }, [api, auth?.user?.id, referenceDate]);

  useEffect(() => {
    if (!auth?.user?.id || dotData.length === 0) return;

    const fetchHealthTips = async () => {
      setTipsLoaded(false);
      try {
        const response = await api.post("/trend/urine/healthTips", {
          clarityRate,
          clearCount,
          yellowCount,
          abnormalCount,
          weekScore,
          beforeWeekScore,
          dailyStatuses: dotData.map((d) => ({
            day: d.day,
            status: d.status,
            score: d.score,
          })),
        });
        const payload = response.data?.data ?? response.data;
        const tips = Array.isArray(payload?.tips) ? payload.tips : [];
        setHealthTips(tips);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load urine health tips:", err);
        setHealthTips([]);
      } finally {
        setTipsLoaded(true);
      }
    };

    fetchHealthTips();
  }, [
    api,
    auth?.user?.id,
    dotData,
    clarityRate,
    clearCount,
    yellowCount,
    abnormalCount,
    weekScore,
    beforeWeekScore,
  ]);

  const hasTodayUrineRecord = (() => {
    if (!Array.isArray(dotData) || dotData.length === 0) return false;

    const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayLabel = weekLabels[new Date().getDay()];
    const today = dotData.find((d) => d.day === todayLabel);
    const todayScore = today ? Number(today.score || 0) : 0;

    return todayScore > 0;
  })();

  const effectiveWeekScore = hasTodayUrineRecord ? weekScore : 0;
  const effectiveStatus =
    hasTodayUrineRecord && effectiveWeekScore > 0
      ? effectiveWeekScore > 75
        ? "Excellent"
        : effectiveWeekScore > 50
          ? "Good"
          : effectiveWeekScore > 25
            ? "Fair"
            : "Poor"
      : "Not Recorded";
  const effectiveChangeText = hasTodayUrineRecord
    ? `${beforeWeekScore > effectiveWeekScore ? "-" : "+"}${Math.abs(
      beforeWeekScore - effectiveWeekScore
    )}% vs Last`
    : "";
  const scorePosition = getScorePosition(effectiveWeekScore);

  const loadingScore = !scoreLoaded;
  const loadingDots = !dotsLoaded;
  const loadingTips = !tipsLoaded;

  return (
    <main className="pl-[15px] pr-[15px]">
      <div className="bg-white rounded-[27px] p-[32px] shadow-md mb-[36px] relative">
        <div className="flex items-center justify-between">
          <div className="pl-[50px]">
            <div className="text-3xl font-medium text-[#F09129] text-center">
              {effectiveWeekScore}
            </div>
            <div className="text-sm text-custom-12 text-center">
              {effectiveStatus}
            </div>
          </div>
          <div className="text-sm pr-[50px] text-[#F09129] text-right">
            {effectiveChangeText}
          </div>
        </div>

        {/* Progress Bar (Health Score) */}
        <div className="mt-4">
          <div
            className="h-2 rounded-full relative overflow-hidden"
            style={{
              background: `linear-gradient(to right,
                ${URINE_PRIMARY_COLOR} 0%,
                ${URINE_PRIMARY_COLOR} 60%,
                #FBC02D 60%,
                #FBC02D 80%,
                #F66B6B 80%,
                #F66B6B 100%)`,
            }}
          >
            {/* Indicator (outer ring + inner fill) */}
            <div
              className="absolute -top-2.5 w-5 h-5 rounded-full border border-[#9E9E9E] bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
              style={{
                left: `${scorePosition}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getIndicatorColor(scorePosition) }}
              />
            </div>
          </div>
        </div>

        {loadingScore && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader />
          </div>
        )}
      </div>

      <div className="text-primary font-medium mb-4 sm:mb-5 pl-1 sm:pl-[15px]">
        Weekly Urine Report
      </div>
      <div className="w-full max-w-sm rounded-[20px] bg-white p-4 shadow-[2px_0_10px_rgba(3,3,3,0.1)] space-y-4 relative mx-auto">
        {/* Status dots */}
        <div className="flex justify-between gap-2">
          {dotData.map((d) => (
            <div key={d.day} className="flex flex-col items-center gap-1">
              <span className={`h-8 w-8 rounded-full ${colors[d.status]}`} />
              <span className="text-xs text-secondary">{d.day}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs text-gray-600">
          <LegendDot color="bg-[#59ce8b]" label="Clear" />
          <LegendDot color="bg-[#ffdc6c]" label="Yellowish" />
          <LegendDot color="bg-[#f66b6b]" label="Abnormal" />
        </div>

        {/* Summary */}
        <div className="space-y-1 text-sm mb-4 sm:mb-5">
          <div className="flex items-center gap-1">
            <FaSmile className="w-4 h-4 text-[#f09129]" />
            <span className="text-[15px] font-medium text-primary">
              <span className="text-[15px] text-primary">Clarity:</span>{" "}
              {clarityRate >= 80
                ? "Good"
                : clarityRate >= 60
                  ? "Fair"
                  : clarityRate >= 40
                    ? "Deviation"
                    : "Abnormal"}
            </span>
          </div>
          <p className="text-primary text-[15px] pl-3 sm:pl-[20px]">
            Weekly Clarity Rate: {clarityRate}%
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className={`h-2 rounded-full ${clarityRate >= 80 ? "bg-[#52b6b3]" : clarityRate >= 60 ? "bg-[#ffc107]" : clarityRate >= 40 ? "bg-[#ffa000]" : "bg-[#ef5350]"}`}
            style={{ width: `${clarityRate}%` }}
          />
        </div>

        {/* Counts */}
        <div className="flex justify-between text-[15px] text-primary text-center px-3 sm:pl-[20px] sm:pr-[20px] mb-4 sm:mb-5">
          <span className="text-[15px] text-primary">
            Clear
            <br />
            <span className="text-[#3fb96e]">
              {clearCount} {clearCount > 1 ? "Days" : "Day"}
            </span>
          </span>
          <span className="text-[15px] text-primary">
            Yellowish
            <br />
            <span className="text-[#fbc02d]">
              {yellowCount} {yellowCount > 1 ? "Days" : "Day"}
            </span>
          </span>
          <span className="text-[15px] text-primary">
            Abnormal
            <br />
            <span className="text-[#f66b6b]">
              {abnormalCount} {abnormalCount > 1 ? "Days" : "Day"}
            </span>
          </span>
        </div>

        {/* Health Tips from AI (OpenAI) */}
        <div className="rounded-[8px] bg-green-50 p-4 text-xs text-gray-700">
          <p className="mb-[6px] font-medium text-primary">Health Tips</p>
          {loadingTips ? (
            <div className="flex items-center justify-center py-2">
              <Loader />
            </div>
          ) : healthTips.length > 0 ? (
            <ul className="text-secondary text-xs list-disc list-inside space-y-1">
              {healthTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          ) : (
            <p className="text-secondary text-xs">
              No tips this week. Add urine records to get personalized advice.
            </p>
          )}
        </div>

        {loadingDots && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <Loader />
          </div>
        )}
      </div>

      {showUpgrade && <Upgrade />}
    </main>
  );
};

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

export default Free;
