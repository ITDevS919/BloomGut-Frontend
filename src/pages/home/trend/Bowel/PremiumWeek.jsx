import Chart from "react-apexcharts";

const PremiumWeek = () => {
  const series = [
    {
      name: "Milk",
      data: [
        { x: "Abd Pain", y: 90 },
        { x: "Diarrh", y: 70 },
        { x: "Constip", y: 30 },
        { x: "Bloat", y: 10 },
      ],
    },
    {
      name: "Bread",
      data: [
        { x: "Abd Pain", y: 20 },
        { x: "Diarrh", y: 80 },
        { x: "Constip", y: 40 },
        { x: "Bloat", y: 30 },
      ],
    },
    {
      name: "Peanuts",
      data: [
        { x: "Abd Pain", y: 50 },
        { x: "Diarrh", y: 20 },
        { x: "Constip", y: 90 },
        { x: "Bloat", y: 70 },
      ],
    },
    {
      name: "Eggs",
      data: [
        { x: "Abd Pain", y: 30 },
        { x: "Diarrh", y: 40 },
        { x: "Constip", y: 20 },
        { x: "Bloat", y: 80 },
      ],
    },
    {
      name: "Seafood",
      data: [
        { x: "Abd Pain", y: 80 },
        { x: "Diarrh", y: 60 },
        { x: "Constip", y: 50 },
        { x: "Bloat", y: 40 },
      ],
    },
    {
      name: "Beans",
      data: [
        { x: "Abd Pain", y: 40 },
        { x: "Diarrh", y: 30 },
        { x: "Constip", y: 60 },
        { x: "Bloat", y: 50 },
      ],
    },
    {
      name: "Nuts",
      data: [
        { x: "Abd Pain", y: 60 },
        { x: "Diarrh", y: 50 },
        { x: "Constip", y: 30 },
        { x: "Bloat", y: 20 },
      ],
    },
  ];
  const options = {
    chart: {
      type: "heatmap",
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      style: {
        fontSize: "11px",
        colors: ["#333"],
      },
    },
    plotOptions: {
      heatmap: {
        radius: 6,
        colorScale: {
          ranges: [
            { from: 0, to: 30, color: "#CFF3D7" }, // low
            { from: 31, to: 60, color: "#FFF1B8" }, // mid
            { from: 61, to: 100, color: "#FFC2B5" }, // high
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
    tooltip: { enabled: false },
    grid: {
      padding: { right: 20 },
    },
  };

  return (
    <div className="p-4">
      <div className="text-x2 font-medium mb-3 mt-3 text-primary">
        Food vs Symptoms
      </div>
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-md">
        <Chart options={options} series={series} type="heatmap" height={340} />

        {/* Sensitivity legend */}
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

export default PremiumWeek;
