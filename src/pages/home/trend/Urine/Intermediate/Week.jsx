import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Sun, Moon } from "lucide-react";
import { useSelector } from "react-redux";
import useApiClient from "@/hooks/useApiClient";

ChartJS.register(ArcElement, Tooltip, Legend);
import Free from "../Free";
import { MdQueryBuilder } from "react-icons/md";
import Upgrade from "./Upgrade";

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

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchDayNight = async () => {
      setChartLoading(true);
      try {
        const response = await api.get("/trend/urine/weeklyDayNight", {
          params: {
            userId: auth.user.id,
            referenceDate: referenceDate ? referenceDate.toISOString() : undefined,
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
        setChartLoading(false);
      }
    };

    fetchDayNight();
  }, [api, auth?.user?.id, referenceDate]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const fetchWeeklyAdvice = async () => {
      setAdviceLoading(true);
      try {
        const response = await api.post("/trend/urine/weeklyAdvice", {
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
  }, [api, auth?.user?.id, daytimeEpisodes, nightEpisodes, daytimePercent, nightPercent]);

  const data = {
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

  const options = {
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

  const [active, setActive] = useState("Day/Night");
  const tabs = ["Day/Night", "Clarity", "Time"];
  return (
    <>
      <Free showUpgrade={false} />
      <div className="flex items-center justify-center gap-20 text-sm mt-[38px]">
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

      <div className="w-full space-y-4 p-6">
        {/* Donut card */}
        <div className="rounded-[27px] bg-white p-5 shadow-md">
          <div className="relative mx-auto h-44 w-44">
            {chartLoading ? (
              <div className="flex h-full items-center justify-center text-xs text-secondary">
                Loading day/night distribution…
              </div>
            ) : (
              <>
                <Doughnut data={data} options={options} />

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
        <div className="grid grid-cols-3 gap-3 mb-5">
          {chartLoading ? (
            <div className="col-span-3 flex items-center justify-center text-xs text-secondary">
              Loading weekly urine stats…
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
        <div className="bg-white rounded-[27px] shadow-md p-6">
          <div className="space-y-3">
            <h3 className="text-base font-medium text-primary">Analysis & Advice</h3>
            {adviceLoading ? (
              <p className="text-sm text-secondary">Loading advice…</p>
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
        <div className="text-center text-sm text-custom-12 italic mt-5">For reference only. Consult a doctor if needed.</div>
        <Upgrade />
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
