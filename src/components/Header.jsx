import { Link, useLocation } from "react-router-dom";
import { FaCarCrash } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

const Header = () => {
  const path = useLocation().pathname;
  const { user, logoutUser, isAdmin } = useContext(AuthContext);
  const [adminView, setAdminView] = useState(isAdmin());

  useEffect(() => {
    setAdminView(isAdmin());
  }, [isAdmin]);

  if (adminView) return <></>;

  return (
    <Navbar className="border-b-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md p-3">
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-2">
        <div className="text-2xl flex items-center gap-2 font-bold uppercase">
          <span className="text-gray-300">Car</span>
          <span className="text-gray-300">Rental</span>
          <FaCarCrash className="text-yellow-500" />
        </div>
      </Link>

      {/* Search Section */}
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      {/* User Section */}
      <div className="flex gap-2 md:order-2">
        {user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="relative">
                <Avatar
                  alt="user"
                  img={user.profilePicture}
                  rounded
                  className={user.is_active === "False" ? "opacity-70" : ""}
                />
                {user.is_active === "False" && (
                  <span
                    className="absolute bottom-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full p-1 flex items-center justify-center"
                    style={{ width: "20px", height: "20px" }}
                  >
                    !
                  </span>
                )}
              </div>
            }
          >
            <Dropdown.Header>
              <div className="flex flex-col items-start">
                <span className="block text-sm font-semibold text-gray-900">
                  {user.username}
                </span>
                <span className="block text-sm text-gray-500 font-medium truncate">
                  {user.email}
                </span>
              </div>
            </Dropdown.Header>

            <Link to="/profile">
              <Dropdown.Item className="hover:bg-gray-100">
                Profile
              </Dropdown.Item>
            </Link>

            <Link to="/orders">
              <Dropdown.Item className="hover:bg-gray-100">
                Order history
              </Dropdown.Item>
            </Link>

            <Dropdown.Divider />

            <Dropdown.Item
              onClick={logoutUser}
              className="text-red-600 hover:bg-red-50"
            >
              Sign out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="pinkToOrange">Sign In</Button>
          </Link>
        )}
      </div>

      {/* Navbar Links */}
      <Navbar.Collapse className="hidden lg:flex space-x-4">
        <Link
          to="/"
          className={`${
            path === "/" ? "text-yellow-500" : "text-gray-300"
          } hover:text-yellow-500 transition duration-300`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`${
            path === "/about" ? "text-yellow-500" : "text-gray-300"
          } hover:text-yellow-500 transition duration-300`}
        >
          About
        </Link>
        <Link
          to="/cars"
          className={`${
            path === "/cars" ? "text-yellow-500" : "text-gray-300"
          } hover:text-yellow-500 transition duration-300`}
        >
          Car
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
