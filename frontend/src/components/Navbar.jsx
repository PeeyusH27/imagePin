import React from "react";
import { Link } from "react-router-dom";
import ImagePin from '../assets/ImagePin.png'

const Navbar = ({ user }) => {
  return (
    <div className="w-full">
      <div className="bg-white shadow-sm w-full">
        <div className="mx-auto px-4 py-2 flex justify-between items-center">
          <Link to="/" className="flex items-center mr-5">
            <img
              src={ImagePin}
              width={30}
              height={60}
              alt=""
              className="h-8 md:mr-2"
            />
            <span className="text-rose-400 text-xl font-bold">ImagePin</span>
          </Link>

          <div className="flex items-center space-x-4 w-[200px]">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/create" className="text-gray-700 hover:text-gray-900">
              Create
            </Link>
            <Link
              to="/account"
              className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xl text-gray-700 border-2 border-zinc-900"
            >
              {user.name.slice(0, 1)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;