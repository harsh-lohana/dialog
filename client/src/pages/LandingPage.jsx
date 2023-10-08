import { Link } from "react-router-dom";

const LandingPage = () => {

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-5xl text-blue-500 font-bold">Dialog</h1>
      <div className="m-6 flex gap-4">
        <Link
          to="/login"
          className="border-solid border-2 bg-blue-300 font-semibold border-blue-500 text-blue-700 rounded-md py-1 px-2 my-2"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="border-solid border-2 bg-blue-300 font-semibold border-blue-500 text-blue-700 rounded-md py-1 px-2 my-2"
        >
          Signup
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
