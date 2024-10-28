import { useContext, useEffect, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";
import AuthContext from "../context/AuthContext";

const FooterLinks = [
  { title: "Home", link: "/#" },
  { title: "About", link: "/#about" },
  { title: "Contact", link: "/#contact" },
  { title: "Blog", link: "/#blog" },
];

const Footer = () => {
  const { isAdmin } = useContext(AuthContext);
  const [adminView, setAdminView] = useState(isAdmin());

  useEffect(() => {
    setAdminView(isAdmin());
  }, [isAdmin]);

  if (adminView) return <></>;

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white mt-14 rounded-t-3xl">
      <div className="container mx-auto px-6 py-10">
        {/* Footer Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Details */}
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl font-bold mb-4 font-serif">Car Rental</h1>
            <p className="text-sm opacity-80">
              Your reliable partner for all your car rental needs. Experience
              quality service and flexible rental plans tailored to your
              preferences.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <FaLocationArrow className="text-primary" />
              <p className="text-sm opacity-80">Noida, Uttar Pradesh</p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <FaMobileAlt className="text-primary" />
              <p className="text-sm opacity-80">+91 123456789</p>
            </div>
            {/* Social Media Icons */}
            <div className="flex gap-5 mt-6">
              <a href="#" className="text-2xl hover:text-primary">
                <FaInstagram />
              </a>
              <a href="#" className="text-2xl hover:text-primary">
                <FaFacebook />
              </a>
              <a href="#" className="text-2xl hover:text-primary">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div>
              <h1 className="text-xl font-semibold mb-4">Important Links</h1>
              <ul className="space-y-3">
                {FooterLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.link}
                      className="text-sm hover:text-primary transition duration-300"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h1 className="text-xl font-semibold mb-4">Quick Links</h1>
              <ul className="space-y-3">
                {FooterLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.link}
                      className="text-sm hover:text-primary transition duration-300"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h1 className="text-xl font-semibold mb-4">Location</h1>
              <ul className="space-y-3">
                {FooterLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.link}
                      className="text-sm hover:text-primary transition duration-300"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center">
          <p className="text-sm opacity-80">
            &copy; {new Date().getFullYear()} Car Rental. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
