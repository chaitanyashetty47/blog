import React, { useState } from 'react';
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

interface AppbarProps {
  name: string | null;
}

export const Appbar = ({ name }: AppbarProps) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    // Clear the Authorization header
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="border-b flex justify-between px-10 py-4">
      <Link to={'/blogs'} className="flex flex-col justify-center cursor-pointer">
        Medium
      </Link>
      <div className="flex items-center">
        <Link to={`/publish`}>
          <button type="button" className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center">
            New
          </button>
        </Link>
        <div className="relative inline-block">
          <div onClick={toggleDropdown} className="cursor-pointer">
            <Avatar size="big" name={name?.charAt(0).toUpperCase() || "r"} />
          </div>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
              <div className="px-4 py-2 text-sm text-gray-700">
                Signed in as <br />
                <span className="font-medium">{name}</span>
              </div>
              <hr />
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};