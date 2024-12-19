import { Sidebar } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import {
  FaCar,
  FaChartPie,
  FaUsers,
  FaUser,
  FaCalculator,
  FaCarCrash,
  FaTags
} from "react-icons/fa";
import { RiProfileFill, RiFileListFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

export default function DashSidebar() {
  const { logoutUser } = useContext(AuthContext);
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
    <div className="flex flex-col h-screen w-full md:w-56 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300">
      {/* Logo Section */}
      <div className="p-4 text-xl font-bold text-yellow-500">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl flex items-center gap-2 font-bold uppercase">
            <span className="text-gray-300">Car</span>
            <span className="text-gray-300">Rental</span>
            <FaCarCrash className="text-yellow-500" />
          </div>
        </Link>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto">
        <Sidebar className="bg-transparent text-gray-300">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <div className="text-sm font-semibold text-gray-400 mb-2 ml-4">
                Main
              </div>
              <Link to="/dashboard?tab=dash">
                <Sidebar.Item
                  active={tab === "dash" || !tab}
                  icon={FaChartPie}
                  as="div"
                  className="hover:text-yellow-500 transition duration-300"
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=rentals">
                <Sidebar.Item
                  active={tab === "rentals"}
                  icon={FaCar}
                  as="div"
                  className="hover:text-yellow-500 transition duration-300"
                >
                  Rental Requests
                </Sidebar.Item>
              </Link>
            </Sidebar.ItemGroup>

            <Sidebar.ItemGroup>
              <div className="text-sm font-semibold text-gray-400 mb-2 ml-4">
                Vehicle Manage
              </div>
              <Link to="/dashboard?tab=vehicle-types">
                <Sidebar.Item
                  active={tab === "vehicle-types"}
                  icon={FaCar}
                  as="div"
                  className="hover:text-yellow-500 transition duration-300"
                >
                  Vehicle Types
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=vehicles">
                <Sidebar.Item
                  active={tab === "vehicles"}
                  icon={FaCar}
                  as="div"
                  className="hover:text-yellow-500 transition duration-300"
                >
                  Vehicle Manage
                </Sidebar.Item>
              </Link>
            </Sidebar.ItemGroup>

            <Sidebar.ItemGroup>
              <div className="text-sm font-semibold text-gray-400 mb-2 ml-4">
                Manage
              </div>
              <Link to="/dashboard?tab=drivers">
                <Sidebar.Item
                  active={tab === "drivers"}
                  icon={FaUser}
                  as="div"
                  className="hover:text-yellow-500 transition duration-300"
                >
                  Driver Manage
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=employees">
                <Sidebar.Item
                  active={tab === "employees"}
                  icon={FaUsers}
                  as="div"
                  className="hover:text-yellow-500 transition duration-300"
                >
                  Employee Manage
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=customers">
                <Sidebar.Item
                  active={tab === "customers"}
                  icon={FaUsers}
                  as="div"
                  className="hover:text-yellow-500 transition duration-300"
                >
                  Customers Manage
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=coupon">
                <Sidebar.Item
                  active={tab === "coupon"}
                  icon={FaTags}
                  as="div"
                  className="hover:text-yellow-500 transition duration-300"
                >
                  Coupons
                </Sidebar.Item>
              </Link>
            </Sidebar.ItemGroup>

            <Sidebar.ItemGroup>
              <div className="text-sm font-semibold text-gray-400 mb-2 ml-4">
                Useful
              </div>
              <Link to="/dashboard?tab=income">
                <Sidebar.Item
                  active={tab === "income"}
                  icon={FaCalculator}
                  as="div"
                  className="hover:text-yellow-500 transition duration-300"
                >
                  Calculate Income
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=summary">
                <Sidebar.Item
                  active={tab === "summary"}
                  icon={RiFileListFill}
                  as="div"
                  className="hover:text-yellow-500 transition duration-300"
                >
                  Daily Summary
                </Sidebar.Item>
              </Link>
            </Sidebar.ItemGroup>

            <Sidebar.ItemGroup>
              <div className="text-sm font-semibold text-gray-400 mb-2 ml-4">
                Profile
              </div>
              <Link to="/dashboard?tab=profile">
                <Sidebar.Item
                  active={tab === "profile"}
                  icon={RiProfileFill}
                  as="div"
                  className="hover:text-yellow-500 transition duration-300"
                >
                  Profile
                </Sidebar.Item>
              </Link>
              <div onClick={logoutUser}>
                <Sidebar.Item
                  icon={FaUsers}
                  as="div"
                  className="hover:text-yellow-500 transition duration-300"
                >
                  Logout
                </Sidebar.Item>
              </div>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    </div>
  );
}
