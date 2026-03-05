import Upgrade from "./Upgrade";
import { FaSmile } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";

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
  const [healthTipsLoading, setHealthTipsLoading] = useState(false);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [weeklyDotsLoading, setWeeklyDotsLoading] = useState(false);

  const auth = useSelector((state) => state.auth);
  const api = useApiClient();

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchWeeklyDots = async () => {
      setWeeklyDotsLoading(true);
      try {
        const response = await api.get("/trend/urine/weeklyScore", {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
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
        console.log(err);
      } finally {
        setWeeklyDotsLoading(false);
      }
    };

    fetchWeeklyDots();
  }, [api, auth?.user?.id, referenceDate]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchWeeklyScores = async () => {
      setScoreLoading(true);
      try {
        const response = await api.get("/trend/urine/compareWeeklyScore", {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
          },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;
        setBeforeWeekScore(payload.beforeWeekScore ?? 0);
        setWeekScore(payload.weekScore ?? 0);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      } finally {
        setScoreLoading(false);
      }
    };

    fetchWeeklyScores();
  }, [api, auth?.user?.id, referenceDate]);

  useEffect(() => {
    if (!auth?.user?.id || dotData.length === 0) return;

    const fetchHealthTips = async () => {
      setHealthTipsLoading(true);
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
        setHealthTipsLoading(false);
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

  return (
    <div className="pl-[15px] pr-[15px]">
      {/* Score Card */}
      <div className="bg-white rounded-[27px] p-[32px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] mb-[28px]">
        <div className="flex items-center justify-between">
          <div className="pl-[50px]">
            {scoreLoading ? (
              <div className="space-y-2">
                <div className="h-7 w-16 rounded-full bg-slate-100 animate-pulse" />
                <div className="h-3 w-20 rounded-full bg-slate-100 animate-pulse" />
              </div>
            ) : (
              <>
                <div className="text-3xl font-medium text-[#F09129]">
                  {weekScore}
                </div>
                <div className="text-sm text-[#F09129] text-center">
                  {weekScore > 75
                    ? "Excellent"
                    : weekScore > 50
                    ? "Good"
                    : weekScore > 25
                    ? "Fair"
                    : "Poor"}
                </div>
              </>
            )}
          </div>
          <div className="text-sm pr-[50px] text-[#F09129]">
            {scoreLoading ? (
              <span className="text-xs text-[#F09129]">Loading weekly score…</span>
            ) : (
              <>
                {beforeWeekScore > weekScore ? "-" : "+"}
                {Math.abs(beforeWeekScore - weekScore)}% vs Last
              </>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 bg-green-200 rounded-full relative">
            <div
              className="absolute left-0 top-0 h-2 bg-[#F09129] rounded-full"
              style={{ width: `${weekScore}%` }}
            />
            <div
              className="absolute left-[45%] top-0 h-2 bg-[#fbc02d] rounded-full"
              style={{ width: "30%" }}
            />
            <div
              className="absolute left-[75%] top-0 h-2 bg-[#f66b6b] rounded-full"
              style={{ width: "25%" }}
            />
            <div className="absolute left-[44%] -top-2 w-3 h-3 rounded-full bg-white border-2 border-emerald-300" />
          </div>
        </div>
      </div>

      <div className="text-primary font-medium mb-5 pl-[15px]">Weekly Urine Report</div>
      <div className="w-full max-w-sm rounded-[20px] bg-white p-[24px] shadow-[2px_0_10px_rgba(3,3,3,0.1)] space-y-4">
        {/* Status dots */}
        {weeklyDotsLoading ? (
          <div className="flex h-10 items-center justify-center text-xs text-secondary">
            Loading weekly urine report…
          </div>
        ) : (
          <div className="flex justify-between">
            {dotData.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1">
                <span className={`h-8 w-8 rounded-full ${colors[d.status]}`} />
                <span className="text-xs text-secondary">{d.day}</span>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs text-gray-600">
          <LegendDot color="bg-[#59ce8b]" label="Clear" />
          <LegendDot color="bg-[#ffdc6c]" label="Yellowish" />
          <LegendDot color="bg-[#f66b6b]" label="Abnormal" />
        </div>

        {/* Summary */}
        <div className="space-y-1 text-sm mb-5">
          {weeklyDotsLoading ? (
            <>
              <div className="h-4 w-40 rounded-full bg-slate-100 animate-pulse" />
              <div className="h-3 w-32 rounded-full bg-slate-100 animate-pulse ml-[20px]" />
            </>
          ) : (
            <>
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
              <p className="text-primary text-[15px] pl-[20px]">
                Weekly Clarity Rate: {clarityRate}%
              </p>
            </>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className={`h-2 rounded-full ${clarityRate >= 80 ? "bg-[#52b6b3]" : clarityRate >= 60 ? "bg-[#ffc107]" : clarityRate >= 40 ? "bg-[#ffa000]" : "bg-[#ef5350]"}`}
            style={{ width: `${clarityRate}%` }}
          />
        </div>

        {/* Counts */}
        <div className="flex justify-between text-[15px] text-primary text-center pl-[20px] pr-[20px] mb-5">
          {weeklyDotsLoading ? (
            <div className="w-full flex items-center justify-center text-xs text-secondary">
              Calculating weekly clarity…
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Health Tips from AI (OpenAI) */}
        <div className="rounded-[8px] bg-green-50 p-4 text-xs text-gray-700">
          <p className="mb-[6px] font-medium text-primary">Health Tips</p>
          {healthTipsLoading ? (
            <p className="text-secondary text-xs">Loading tips…</p>
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
      </div>

      {/* <Upgrade /> */}
      {showUpgrade && <Upgrade />}
    </div>
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
