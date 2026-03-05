import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Upgrade from "./Upgrade";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";
import Free from "../Free";
ChartJS.register(ArcElement, Tooltip, Legend);

const Month = ({ showUpgrade = true }) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const api = useApiClient();
  const [selectedSession, setSelectedSession] = useState("Morning");

  const [sessions, setSessions] = useState([
    {
      name: "Morning",
      percentage: 0,
      ml: 0,
      tips: [
        "Great morning hydration, boosts metabolism.",
        "Drink 250–300ml warm water within 30 min after waking.",
      ],
      color: "bg-[#B9E1ED]",
    },
    {
      name: "Noon",
      percentage: 0,
      ml: 0,
      tips: [
        "Good midday hydration.",
        "Continue regular water intake throughout the day.",
      ],
      color: "bg-[#8EC4D9]",
    },
    {
      name: "Afternoon",
      percentage: 0,
      ml: 0,
      tips: [
        "Afternoon hydration is adequate.",
        "Consider increasing intake during afternoon hours.",
      ],
      color: "bg-[#7CB6CF]",
    },
    {
      name: "Evening",
      percentage: 0,
      ml: 0,
      tips: [
        "Evening hydration is adequate.",
        "Avoid large amounts within 10 min before bed.",
      ],
      color: "bg-[#5CA3C2]",
    },
  ]);

  const currentSession =
    sessions.find((s) => s.name === selectedSession) || sessions[0];

  const total = sessions.reduce((sum, s) => sum + (s.ml || 0), 0);
  const segments = sessions.map((s) => s.percentage || 0);

  const data = {
    datasets: [
      {
        data: segments,
        backgroundColor: ["#D6EFFB", "#BFE3F8", "#A7D7F2", "#8BCBF0"],
        borderColor: "#FFFFFF",
        borderWidth: 3,
        cutout: "70%",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchMonthlyTime = async () => {
      try {
        const response = await api.get("/trend/water/monthlyTime", {
          params: { userId: auth.user.id },
        });
        const payload = response.data?.data || response.data;
        if (!payload) return;

        const updated = [
          {
            name: "Morning",
            percentage: payload.morningPercent ?? 0,
            ml: payload.morningMl ?? 0,
            tips: [
              "Great morning hydration, boosts metabolism.",
              "Drink 250–300ml warm water within 30 min after waking.",
            ],
            color: "bg-[#B9E1ED]",
          },
          {
            name: "Noon",
            percentage: payload.noonPercent ?? 0,
            ml: payload.noonMl ?? 0,
            tips: [
              "Good midday hydration.",
              "Continue regular water intake throughout the day.",
            ],
            color: "bg-[#8EC4D9]",
          },
          {
            name: "Afternoon",
            percentage: payload.afternoonPercent ?? 0,
            ml: payload.afternoonMl ?? 0,
            tips: [
              "Afternoon hydration is adequate.",
              "Consider increasing intake during afternoon hours.",
            ],
            color: "bg-[#7CB6CF]",
          },
          {
            name: "Evening",
            percentage: payload.eveningPercent ?? 0,
            ml: payload.eveningMl ?? 0,
            tips: [
              "Evening hydration is adequate.",
              "Avoid large amounts within 10 min before bed.",
            ],
            color: "bg-[#5CA3C2]",
          },
        ];

        setSessions(updated);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to load water monthly time distribution:", error);
      }
    };

    fetchMonthlyTime();
  }, [api, auth?.user?.id]);

  return (
    <div className="mt-[36px]">
      <Free showUpgrade={false} />
      <div className="pl-[20px] text-base font-medium mb-[10px] text-primary">
        Water Intake Chart
      </div>
      <div className="p-4">
        <div className="w-full max-w-md space-y-4">
          {/* Donut Card */}
          <div className="relative rounded-[27.44px] bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.15)] mb-[28px]">
            <div className="relative mx-auto h-52 w-52">
              <Doughnut data={data} options={options} />

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{total}</span>
                <span className="text-sm text-gray-500">ml</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              title="Monthly"
              value={`${total} ml`}
              sub={`Daily Avg: ${total ? Math.round(total / 30) : 0} ml`}
            />
            <StatCard title="Rate" value="-" sub="+0% vs Last Month" />
            <StatCard
              title="Best Time"
              value="Morning"
              sub="Best Hydration: 6–9 AM"
            />
          </div>
        </div>

        {/* Water Intake Sessions */}
        <div className="w-full max-w-md mt-8 shadow-[0_2px_4px_rgba(0,0,0,0.15)] rounded-[27px] bg-white p-5 space-y-4">
          {/* Main Session Card */}
          <div className="rounded-[12px] bg-[#eff6ff] p-5 shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#b9e1ed]"></div>
                <h3 className="text-base font-medium text-primary">{currentSession.name} Session</h3>
              </div>
              <span className="text-xs font-medium text-secondary">
                {currentSession.ml}ml ({currentSession.percentage}%)
              </span>
            </div>
            <div className="space-y-1">
              {currentSession.tips.map((tip, index) => (
                <p key={index} className="text-sm text-[#3c74ed]">
                  {tip}
                </p>
              ))}
            </div>
          </div>

          {/* Session Overview */}
          <div className="grid grid-cols-2 gap-2">
            {sessions.map((session) => (
              <button
                key={session.name}
                onClick={() => setSelectedSession(session.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${selectedSession === session.name
                  ? "bg-[#eff6ff] text-secondary"
                  : "bg-transparent text-secondary"
                  }`}
              >
                <div
                  className={`w-2 h-2 rounded-full
                     ${session.color}
                }`}
                ></div>
                <span>
                  {session.name}: {session.percentage}%
                </span>
              </button>
            ))}
          </div>

          {/* Call to Action */}
          <p className="text-center text-xs text-custom-12">
            Tap a section for details
          </p>
        </div>
      </div>
      {/* <Upgrade /> */}
      {showUpgrade && <Upgrade />}

      <div className="flex items-center justify-center mb-[47px] mt-[20px]">
        <button
          className="flex items-center justify-center bg-white rounded-[8px] px-6 py-2 text-lg text-secondary"
          onClick={() => navigate("/trend-analysis?plan=premium", { state: { trendType: "water" } })}
        >
          In-depth Analysis
        </button>
      </div>
    </div>
  );
};

function StatCard({ title, value, sub }) {
  return (
    <div className="rounded-[10px] bg-white p-3 text-center shadow-[2px_0_10px_rgba(0,0,0,0.15)]">
      <p className="text-sm text-secondary">{title}</p>
      <p className="mt-1 text-base font-semibold text-[#4682b4]">{value}</p>
      <p className="mt-1 text-xs text-custom-12">{sub}</p>
    </div>
  );
}

export default Month;
