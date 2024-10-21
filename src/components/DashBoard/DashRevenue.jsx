import React from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const LineChart = () => {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
    ],
    datasets: [
      {
        label: "Car Bookings",
        data: [5, 10, 8, 15, 20, 18, 25, 30, 28, 35],
        borderColor: "#42a5f5",
        backgroundColor: "rgba(66, 165, 245, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Car Bookings Over Time" },
    },
  };

  return <Line data={data} options={options} />;
};

const PieChart = () => {
  const data = {
    labels: ["Paid", "Pending", "Failed"],
    datasets: [
      {
        label: "Payment Status",
        data: [60, 25, 15],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Payment Status Distribution" },
    },
  };

  return <Pie data={data} options={options} />;
};

export default function Dashboard() {
  const data = [
    { title: "USERS", value: 1, linkText: "See all users", icon: "👥" },
    { title: "BOOKINGS", value: 0, linkText: "See all bookings", icon: "📅" },
    {
      title: "AVAILABLE CARS",
      value: 11,
      linkText: "See all Available cars",
      icon: "🚗",
    },
    {
      title: "RESERVED CARS",
      value: 0,
      linkText: "See all Reserved cars",
      icon: "🔒",
    },
    {
      title: "ACTIVE BOOKINGS",
      value: 0,
      linkText: "See all Active Bookings",
      icon: "🛒",
    },
    {
      title: "AVAILABLE DRIVERS",
      value: 1,
      linkText: "See all Available Drivers",
      icon: "👨‍✈️",
    },
    {
      title: "OCCUPIED DRIVERS",
      value: 0,
      linkText: "See all Occupied Drivers",
      icon: "🧑‍✈️",
    },
    {
      title: "NEED TO MAINTENANCE",
      value: 1,
      linkText: "See all Need To Maintenance",
      icon: "🛠️",
    },
    {
      title: "UNDER MAINTENANCE",
      value: 1,
      linkText: "See all Under Maintenance",
      icon: "🔧",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 overflow-hidden">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold leading-tight">Dashboard</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <DashboardCard
            key={index}
            title={item.title}
            value={item.value}
            linkText={item.linkText}
            icon={item.icon}
          />
        ))}
      </div>
      <div className="mt-8 overflow-x-auto">
        <div className="min-w-[600px] h-[400px] flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md h-[300px]">
            <LineChart />
          </div>
          <div className="flex-1 bg-white p-4 rounded-lg shadow-md h-[300px]">
            <PieChart />
          </div>
        </div>
      </div>
    </div>
  );
}

const DashboardCard = ({ title, value, linkText, icon }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-3 flex flex-col items-start h-[120px]">
      <div className="text-xs font-medium text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs text-blue-500 mt-1">
        <a href="/" className="flex items-center">
          {linkText}
          <span className="ml-1">{icon}</span>
        </a>
      </div>
    </div>
  );
};
