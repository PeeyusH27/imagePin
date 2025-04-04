import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PinData } from "../context/PinContext";
import { Loading } from "../components/Loading";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const PinPage = ({ user }) => {
  const params = useParams();

  const {
    loading,
    fetchPin,
    pin,
    updatePin,
    addComment,
    deleteComment,
    deletePin,
  } = PinData();

  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [pinValue, setPinValue] = useState("");

  //EDIT PIN
  const editHandler = () => {
    setTitle(pin.title);
    setPinValue(pin.pin);
    setEdit(!edit);
  };


  //UPDATE PIN
  const updateHandler = () => {
    updatePin(pin._id, title, pinValue, setEdit);
  };


  //COMMENT
  const [comment, setComment] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    addComment(pin._id, comment, setComment);
  };


  //DELETE COMMENT
  const deleteCommentHander = (id) => {
    if (confirm("Are you sure you want to delete this comment"))
      deleteComment(pin._id, id);
  };

  const navigate = useNavigate();


  //DELETE PIN
  const deletePinHandler = () => {
    if (confirm("Are you sure you want to delete this pin"))
      deletePin(pin._id, navigate);
  };

  useEffect(() => {
    fetchPin(params.id);
  }, [params.id]);

  return (
    <div>
      {pin && (
        <div className="flex flex-col items-center justify-center bg-zinc-100 min-h-screen">
          {loading ? (
            <Loading />
          ) : (
            <div className="bg-white rounded-lg shadow-lg flex flex-wrap w-full max-w-4xl">
              <div className="w-full md:w-1/2 bg-zinc-300 rounded-t-lg md:rounded-l-lg md:rounded-t-none flex items-center justify-center p-1">
                {pin.image && (
                  <img
                    src={pin.image.url}
                    alt=""
                    className="object-cover w-full rounded-lg md:rounded-lg"
                  />
                )}
              </div>

              <div className="w-full md:w-1/2 p-6 flex flex-col ">
                <div className="flex items-center justify-between mb-4 ">
                  {edit ? (
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="common-input"
                      style={{ width: "200px" }}
                      placeholder="Enter Title"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold">{pin.title}</h1>
                  )}
                  <div className="flex gap-4">
                  {pin.owner && pin.owner._id === user._id && (
                    <button onClick={editHandler} className="cursor-pointer">
                      <FaEdit size={25}/>
                    </button>
                  )}

                  {pin.owner && pin.owner._id === user._id && (
                    <button
                    onClick={deletePinHandler}
                    className="bg-red-500 text-white py-2 px-3 rounded cursor-pointer"
                    >
                      <MdDelete />
                    </button>
                  )}
                  </div>
                </div>

                {edit ? (
                  <input
                    value={pinValue}
                    onChange={(e) => setPinValue(e.target.value)}
                    className="common-input"
                    style={{ width: "200px" }}
                    placeholder="Enter Title"
                  />
                ) : (
                  <p className="mb-6">{pin.pin}</p>
                )}

                {edit && (
                  <button
                    style={{ width: "200px" }}
                    className="bg-red-500 text-white py-1 px-3 mt-2 mb-2"
                    onClick={updateHandler}
                  >
                    Update
                  </button>
                )}

                {pin.owner && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-zinc-700 px-4 py-2 w-full rounded-lg mb-2">
                      <Link to={`/user/${pin.owner._id}`}>
                        <div className="rounded-full h-12 w-12 bg-zinc-400 text-white flex items-center justify-center">
                          <span className="font-bold">
                            {pin.owner.name.slice(0, 1)}
                          </span>
                        </div>
                      </Link>
                      <div className="ml-4">
                        <h2 className="text-lg text-white font-semibold">
                          {pin.owner.name}
                        </h2>
                        <p className="text-gray-300">
                          {pin.owner.followers.length} Followers
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center my-2">
                  <div className="rounded-full h-12 w-12 bg-zinc-600 text-white flex items-center justify-center mr-4">
                    <span className="font-bold">
                      {pin.owner && pin.owner.name.slice(0, 1)}
                    </span>
                  </div>

                  <form className="flex-1 flex" onSubmit={submitHandler}>
                    <input
                      type="text"
                      placeholder="Add a Comment"
                      className="flex-1 text-gray-400 border rounded-lg p-2"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />

                    <button
                      type="submit"
                      className="ml-2 bg-rose-500 hover:bg-red-600 px-4 py-2 rounded-md text-white cursor-pointer"
                    >
                      Add+
                    </button>
                  </form>
                </div>

                <hr className="font-bold text-gray-400 mt-3 mb-3" />

                <div className="overflow-y-auto h-64">
                  {pin.comments && pin.comments.length > 0 ? (
                    pin.comments.map((e, i) => (
                      <div className="flex items-center justify-center my-2" key={i}>
                        <div className="flex items-center justify-between w-full gap-4 px-2">
                          <div className="flex">
                          <Link to={`/user/${e.user}`}>
                            <div className="rounded-full h-12 w-12 bg-zinc-600 text-white flex items-center justify-center">
                              <span className="font-bold">
                                {e.name.slice(0, 1)}
                              </span>
                            </div>
                          </Link>

                          <div className="ml-4">
                            <div className="ml-4">
                              <h2 className="text-lg font-semibold">
                                {e.name}
                              </h2>
                              <p className="text-gray-500">{e.comment}</p>
                            </div>
                          </div>
                          </div>

                          {e.user === user._id && (
                            <button
                              onClick={() => deleteCommentHander(e._id)}
                              className="bg-rose-500 text-white py-1 px-3 rounded"
                            >
                              <MdDelete />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center w-[60%] mx-auto text-xs bg-zinc-200 p-2 rounded-lg">Be the first one to add comment</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PinPage;