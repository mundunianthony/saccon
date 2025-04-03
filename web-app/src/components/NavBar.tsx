import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import ProfilePlaceholder from "@/assets/profile-placeholder.png";
import Logo from "@/assets/open-sacco.png";
// components
import LucideIcon from "./LucideIcon";
// context and custom hook
import { ThemeContext } from "@/contexts/ThemeContext";
import { useUserProfileInfo } from "@/hooks/useUserProfile";
// constants
import { apiBaseUrl } from "@/constants";

interface NavBarProps {
  showMobileMenu: boolean;
  handleMobileMenuToggle: () => void;
}

const NavBar: FC<NavBarProps> = ({ showMobileMenu, handleMobileMenuToggle }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { toggleDarkTheme, darkTheme } = useContext(ThemeContext);
  const { profile } = useUserProfileInfo();
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.get(`${apiBaseUrl}/api/logout/`);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <div className="max-w-full relative flex items-center justify-between text-white bg-blue-700 h-16 dark:bg-blue-800 dark:text-slate-300 rounded-lg px-3">
      {/* Left Section: Logo and Mobile Menu Toggle */}
      <div className="flex items-center">
        <img src={Logo} alt="Open SACCO logo" className="w-20 h-20" />
        <div className="lg:hidden cursor-pointer" onClick={handleMobileMenuToggle}>
          {showMobileMenu ? (
            <LucideIcon name="X" size={27} aria-label="Close menu" />
          ) : (
            <LucideIcon name="AlignJustify" size={27} aria-label="Open menu" />
          )}
        </div>
      </div>

      {/* Right Section: Dark Mode Toggle, Profile Dropdown */}
      <div className="flex gap-x-5 items-center">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkTheme}
          className="focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {darkTheme ? (
            <LucideIcon name="Moon" size={24} />
          ) : (
            <LucideIcon name="Sun" size={24} />
          )}
        </button>

        {/* Profile Image and Dropdown */}
        <div className="relative">
          <img
            className="rounded-full border border-white w-10 h-10 cursor-pointer"
            src={
              profile?.profile?.profile_image
                ? `${apiBaseUrl}${profile.profile.profile_image}`
                : ProfilePlaceholder
            }
            alt="Profile"
            onClick={() => setShowDropdown(!showDropdown)}
          />

          {/* Dropdown Menu */}
          <div
            ref={dropdownRef}
            className={`${
              showDropdown ? "block" : "hidden"
            } absolute z-20 mt-2 right-0 bg-gray-200 text-black rounded-md shadow-lg dark:bg-blue-700 dark:text-white`}
          >
            <div className="p-4">
              <p className="font-medium">{profile?.username || "Guest"}</p>
              <small className="bg-blue-700 dark:bg-blue-950 rounded-md text-white text-xs p-0.5">
                {profile?.profile?.role_display || "User"}
              </small>
              <p className="text-sm text-gray-600 dark:text-gray-300 pt-2 pb-4">
                {profile?.email || "No email available"}
              </p>

              {/* Profile Link */}
              <Link
                to="/profile"
                className="flex items-center hover:bg-blue-500/25 p-2 rounded-md dark:hover:bg-blue-500/75"
                onClick={() => setShowDropdown(false)}
              >
                <LucideIcon name="User" size={16} className="me-2" />
                Profile
              </Link>

              {/* Logout Button */}
              <div
                className="flex items-center text-sm gap-x-2 cursor-pointer hover:bg-blue-500/25 p-2 rounded-md dark:hover:bg-blue-500/75"
                onClick={handleLogout}
              >
                <LucideIcon name="LogOut" size={16} />
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;