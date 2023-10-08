import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-center ">
      <nav className="w-[90%] p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">
            {/* <Link to="/">Dialog</Link> */}
            Dialog
        </h1>
        <div className="flex gap-3 items-center">
          <button
            className="my-2 py-1 px-2"
            // onClick={() => navigate(`/user/${userInfo._id}`)}
          >
            <img
              src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
              alt="dp"
              className="w-10 h-10 rounded-full"
            />
          </button>
          <button
            // onClick={() => {
            //   localStorage.removeItem("userInfo");
            //   navigate("/");
            // }}
            className="border-solid border-2 bg-blue-300 font-semibold border-blue-500 text-blue-700 rounded-md py-1 px-2 my-2"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
