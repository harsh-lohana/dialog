import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [dp, setDp] = useState(
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  );

  const navigate = useNavigate();

  const postDetails = (pics) => {
    if (
      pics ===
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    ) {
      toast.error("Please Select an image!");
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "dialog");
      data.append("cloud_name", "dmk6zmt0h");
      fetch(
        "https://api.cloudinary.com/v1_1/dmk6zmt0h/image/upload",
        {
          method: "post",
          body: data,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setDp(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("Please Select an image!");
      return;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
    } else {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        setLoading(true);
        const { data } = await axios.post(
          "/api/users",
          { name, email, password, dp },
          config
        );
        toast.success("Signed in!");
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats");
      } catch (error) {
        setError(error.response.data.message);
        toast.error("Invalid email or password!");
        setLoading(false);
        console.log(error.message);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-semibold text-blue-500 bg-blue-200 my-3">
        {loading ? "Loading..." : "Signup"}
      </h1>
      {loading ? <Loader /> : null}
      <form action="" className="flex flex-col gap-2" onSubmit={submitHandler}>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-lg font-semibold text-blue-500 bg-blue-200"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter name"
            className="mb-2 w-56 h-8"
            onChange={(e) => setName(e.target.value)}
          />
          <label
            htmlFor="email"
            className="text-lg font-semibold text-blue-500 bg-blue-200"
          >
            E-Mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter e-mail"
            className="mb-2 w-56 h-8"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label
            htmlFor="password"
            className="text-lg font-semibold text-blue-500 bg-blue-200"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            className="mb-2 w-56 h-8"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label
            htmlFor="confirm-password"
            className="text-lg font-semibold text-blue-500 bg-blue-200"
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm password"
            className="mb-2 w-56 h-8"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label
            htmlFor="dp"
            className="text-lg font-semibold text-blue-500 bg-blue-200"
          >
            Display Picture
          </label>
          <input
            id="dp"
            type="file"
            className="mb-2 w-56 h-8"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className="border-solid border-2 bg-blue-300 font-semibold border-blue-500 text-blue-700 rounded-md py-1 px-2 my-2"
          
        >
          Signup
        </button>
        <p className="font-semibold text-blue-700 rounded-md">
          Already a user?
          <Link to="/login" className="underline text-blue-800">
            {" "}
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;