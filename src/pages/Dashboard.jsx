import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashBoard/DashSidebar";
import DashCustomer from "../components/DashBoard/DashCustomer";
import DashProfile from "../components/DashBoard/DashProfile";
import DashComments from "../components/DashBoard/DashComment";
import DashCoupon from "../components/DashBoard/DashCoupon";
import DashRevenue from "../components/DashBoard/DashRevenue";
import DashVehicleType from "../components/DashBoard/DashVehicleType";
import DashVehicle from "../components/DashBoard/DashVehicle";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex">
      <div className="w-56 h-screen bg-gray-200">
        <DashSidebar />
      </div>

      <div className="flex-1 p-4 overflow-x-auto">
        <div className="flex flex-wrap gap-4">
          {tab === "dash" && <DashRevenue />}
          {tab === "vehicle-types" && <DashVehicleType />}
          {tab === "vehicles" && <DashVehicle />}
          {tab === "profile" && <DashProfile />}
          {tab === "customers" && <DashCustomer />}
          {tab === "comments" && <DashComments />}
          {tab === "coupon" && <DashCoupon />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
