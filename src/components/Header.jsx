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
    <Navbar className="border-b-2 bg-slate-200 shadow-md p-3">
      <Link
        to="/"
        className="self-center text-sm sm:text-xl font-semibold dark:text-white"
      >
        <div className="text-2xl flex items-center gap-2 font-bold font-averia uppercase">
          <span className="text-slate-500">Thuê </span>
          <span className="text-slate-700">Xe</span>
          <FaCarCrash className="text-yellow-500" />
        </div>
      </Link>

      <form>
        <TextInput
          type="text"
          placeholder="Tìm kiếm..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

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
              <span className="block text-sm">{user.username}</span>
              <span className="block text-sm font-medium truncate">
                {user.email}
              </span>
            </Dropdown.Header>

            {user.role === "Admin" ? (
              <Link to={"/dashboard?tab=dash"}>
                <Dropdown.Item>Dashboard</Dropdown.Item>
              </Link>
            ) : (
              <Link to={"/profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
            )}

            <Dropdown.Divider />
            <Dropdown.Item onClick={logoutUser}>Đăng xuất</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="pinkToOrange">Đăng nhập</Button>
          </Link>
        )}
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Trang chủ</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">Giới thiệu</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/cars"} as={"div"}>
          <Link to="/cars">Xe</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
