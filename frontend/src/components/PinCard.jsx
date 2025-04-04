import React from "react";
import { Link } from "react-router-dom";

const PinCard = ({ pin }) => {
  return (
    <div>
      <div className="p-2 h-auto w-auto">
        <div className="bg-white overflow-hidden shadow rounded-lg relative group cursor-pointer">
          <img src={pin.image.url} alt="" className="w-full h-full" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-lg bg-opacity-100 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex flex-col justify-center items-center gap-2">
              <Link
                to={`/pin/${pin._id}`}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                View Pin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinCard;