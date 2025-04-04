import React, { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { PinData } from "../context/PinContext";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const [file, setFile] = useState("");
  const [filePrev, setFilePrev] = useState("");
  const [title, setTitle] = useState("");
  const [pin, setPin] = useState("");
  const { addPin } = PinData();

  const changeFileHandler = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFilePrev(reader.result);
      setFile(file);
    };
  };

//NAVIGATE THROUGH PROP
  const navigate = useNavigate();

//ADD/CREARTE PIN
  const addPinHandler = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("pin", pin);
    formData.append("file", file);
  //SEND DATA TO ADDPIN IN CONTEXT
    addPin(formData, setFilePrev, setFile, setTitle, setPin, navigate);
  
  };


  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-50">
      <div className="flex-col md:flex flex-wrap justify-center h-full md:h-[70vh] bg-zinc-300 rounded-lg items-center gap-2 p-2">
        <div className="flex items-center h-full justify-center">
          <div className="flex flex-col items-center justify-center w-80 h-[50vh] md:h-full p-4 bg-white rounded-lg shadow-lg">
            {filePrev && <img src={filePrev} alt="" />}
            <div
              className="flex flex-col items-center justify-center h-full cursor-pointer"
              onClick={handleClick}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={changeFileHandler}
              />
              <div className="w-12 h-12 mb-4 flex items-center justify-center bg-gray-200 rounded-full">
                <FaPlus />
              </div>
              <p className="text-gray-500">Choose a file</p>
            </div>
            <p className="mt-4 text-sm w-[80%] text-gray-400">
              we recomment using high quality .jpg files but less than 10mb
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center">
            <form
              className="w-full max-w-lg p-6rounded-lg shadow-lg"
              onSubmit={addPinHandler}
            >
              <div className="my-2">
                <label
                  htmlFor="title"
                  className="block text-md font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="common-input bg-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="pin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pin
                </label>
                <input
                  type="text"
                  id="pin"
                  className="common-input bg-white"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  required
                />
              </div>
              <button className="common-btn">Add+</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;