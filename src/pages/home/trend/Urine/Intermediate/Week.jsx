import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Sun, Moon } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);
import Free from "../Free";

const Week = () => {
  const data = {
    labels: ["Daytime", "Nighttime"],
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ["#FCD34D", "#818CF8"],
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
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
  };

  const [active, setActive] = useState("Day/Night");
  const tabs = ["Day/Night", "Clarity", "Time"];
  return (
    <>
      <Free />
      <div className="flex items-center justify-center gap-20 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={
              active === tab
                ? "rounded-[8px] bg-white px-3 py-1.5 font-medium shadow text-gray-800"
                : "text-gray-500 hover:text-gray-700"
            }
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="w-full space-y-4 p-6">
        {/* Donut card */}
        <div className="rounded-[8px] bg-white p-5 shadow-md">
          <div className="relative mx-auto h-44 w-44">
            <Doughnut data={data} options={options} />

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Sun className="h-3 w-3" />
                Day/Night
              </span>
              <span className="text-sm font-medium text-gray-700">
                Block Details
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex justify-center gap-6 text-xs text-gray-600">
            <LegendDot color="bg-yellow-400" label="Daytime" />
            <LegendDot color="bg-indigo-400" label="Nighttime" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard title="Daily Volume" value="1943ml" />
          <StatCard title="Nighttime %" value="71%" />
          <StatCard title="Urination Avg" value="6.3/day" />
        </div>

        {/* Analysis & Advice */}
        <div className="bg-white rounded-[8px] shadow-md p-6">
          <div className="space-y-3">
            <h3 className="text-sm text-primary">Analysis & Advice</h3>

            <AdviceCard
              icon={<Sun className="h-4 w-4 text-yellow-500" />}
              title="Daytime Urine 11.8L"
              desc="Normal, shows enough daytime hydration"
              bg="bg-yellow-50"
            />

            <AdviceCard
              icon={<Moon className="h-4 w-4 text-indigo-500" />}
              title="Nighttime Urine 1.9L"
              desc="Slightly high, reduce water 2h before sleep"
              bg="bg-indigo-50"
            />
          </div>
        </div>
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
    <div className="rounded-[8px] bg-white p-3 text-center shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="mt-1 text-sm font-semibold text-orange-500">{value}</p>
    </div>
  );
}

function AdviceCard({ icon, title, desc, bg }) {
  return (
    <div className={`rounded-[8px] p-4 ${bg}`}>
      <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
        {icon}
        {title}
      </div>
      <p className="mt-1 text-xs text-gray-600">{desc}</p>
    </div>
  );
}

export default Week;
