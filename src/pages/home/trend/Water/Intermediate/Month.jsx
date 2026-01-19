import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Upgrade from "./Upgrade";
ChartJS.register(ArcElement, Tooltip, Legend);

const Month = () => {
  const total = 7000;
  const segments = [25, 25, 25, 25]; // visual segments only

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

  return (
    <div className="p-6">
      <div className="text-xl font-medium mb-3 text-primary">
        Water Intake Chart
      </div>
      <div className="w-full max-w-md space-y-4">
        {/* Donut Card */}
        <div className="relative rounded-2xl bg-white p-6 shadow-md">
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
          <StatCard title="Monthly" value="7000 ml" sub="Daily Avg: 2300 ml" />
          <StatCard title="Rate" value="85%" sub="+8% vs Last Month" />
          <StatCard
            title="Best Time"
            value="Morning"
            sub="Best Hydration: 6–9 AM"
          />
        </div>
      </div>

      <Upgrade />
    </div>
  );
};

function StatCard({ title, value, sub }) {
  return (
    <div className="rounded-xl bg-white p-3 text-center shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="mt-1 text-lg font-semibold text-blue-600">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{sub}</p>
    </div>
  );
}

export default Month;
