import { useNavigate } from "react-router-dom";
import ChatContext from "../context/ChatProvider";
import { useContext, useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(ChatContext);
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
    } else {
      setUser(userInfo);
      navigate("/chats");
    }
  }, []);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-5xl text-blue-500 font-bold">Dialog</h1>
      <div className="m-6 flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="border-solid border-2 bg-blue-300 font-semibold border-blue-500 text-blue-700 rounded-md py-1 px-2 my-2"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="border-solid border-2 bg-blue-300 font-semibold border-blue-500 text-blue-700 rounded-md py-1 px-2 my-2"
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
