import React from "react";
import { PinData } from "../context/PinContext";
import { Loading } from "../components/Loading";
import PinCard from "../components/PinCard";

const Home = () => {
  const { pins, loading } = PinData();
  return (
    <div className="">
      {loading ? (
        <Loading />
      ) : (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <h1 className="text-center text-lg md:text-2xl lg:text-3xl font-semibold md:font-bold py-2">Explore Pins</h1>
          <div className="p-4">
            <div className="flex md:flex flex-wrap">
              {pins && pins.length > 0 ? (
                pins.map((e, i) => <PinCard key={i} pin={e} />)
              ) : (
                <div className="w-full h-screen bg-zinc-100 flex justify-center items-center">
                  <p className="text-zinc-500 text-2xl">No Pins Yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;