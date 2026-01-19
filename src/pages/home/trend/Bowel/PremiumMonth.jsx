import Chart from "react-apexcharts";

const PremiumMonth = () => {
  const series = [
    {
      name: "Milk",
      data: [82, 70, 65, 55],
    },
    {
      name: "Bread",
      data: [20, 80, 52, 63],
    },
    {
      name: "Peanuts",
      data: [50, 82, 86, 70],
    },
    {
      name: "Eggs",
      data: [30, 40, 58, 80],
    },
    {
      name: "Seafood",
      data: [80, 60, 45, 40],
    },
    {
      name: "Beans",
      data: [40, 30, 60, 50],
    },
    {
      name: "Nuts",
      data: [60, 50, 30, 20],
    },
  ].map((row) => ({
    name: row.name,
    data: row.data.map((value, i) => ({
      x: `Week ${i + 1}`,
      y: value,
    })),
  }));

  const options = {
    chart: {
      type: "heatmap",
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      style: {
        colors: ["#333"],
        fontSize: "11px",
      },
    },
    plotOptions: {
      heatmap: {
        radius: 6,
        colorScale: {
          ranges: [
            { from: 0, to: 30, color: "#C8F2D0" },
            { from: 31, to: 60, color: "#FFF1A8" },
            { from: 61, to: 100, color: "#FFB6A5" },
          ],
        },
      },
    },
    xaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    grid: {
      padding: {
        right: 20,
      },
    },
    tooltip: {
      enabled: false,
    },
  };

  return (
    <div className="p-4">
      <div className="text-x2 font-medium mb-3 mt-3 text-primary">
        Food vs Symptoms
      </div>
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-md">
        <Chart options={options} series={series} type="heatmap" height={320} />

        {/* Legend */}
        <div className="mt-2 rounded-xl bg-[#FFFDF6] p-4">
          <p className="text-xs text-gray-500 mb-2">Sensit</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Low</span>
            <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-green-300 via-yellow-200 to-red-300" />
            <span className="text-xs text-gray-500">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumMonth;
