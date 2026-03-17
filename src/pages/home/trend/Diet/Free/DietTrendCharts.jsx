import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, ChartDataLabels);

export const DietLineChart = ({ data, options, loading, Loader }) => (
  <div className="relative">
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-white/60">
        <Loader />
      </div>
    )}
    <Line data={data} options={options} />
  </div>
);

export const BowelLineChart = ({ data, options, loading, Loader }) => (
  <div className="relative">
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
        <Loader />
      </div>
    )}
    <Line data={data} options={options} />
  </div>
);

