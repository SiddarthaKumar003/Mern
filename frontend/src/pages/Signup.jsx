import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import loginIcons from "../assest/signin.gif";
import { toast } from "react-toastify";
import summaryApi from "../utils";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;
    setData({
      ...data,
      [name]: files ? files[0] : value,
    });
  };
  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault();
      // const {confirmPassword,...formData}=data;
      // console.log('The submitted data is', formData);
      if (data.password !== data.confirmPassword) {
        console.log("Password doesn't match with confirm password");
        return;
      }

      // Create FormData object to send the form data including the file
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("image", data.image);

      const response = await fetch("http://localhost:5500/api/auth/register", {
        method: summaryApi.signUp.method, // or 'PUT'
        credentials: "include",
        body: formData,
      });

      // Check if the response status is OK (200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        navigate("/login");
      }
      if (result.error) toast.error(result.message);

      console.log("Success:", result);
      return result; // The server should return the JWT token or a success message
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleImageUpload = () => {
    // Handle image upload logic here
  };

  console.log("The data in form", data);

  return (
    <div>
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto">
            <label htmlFor="imageUpload" className="cursor-pointer">
              {data.image ? (
                <img
                  src={URL.createObjectURL(data.image)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <img src={loginIcons} alt="login icons" />
                </div>
              )}
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              name="image"
              onChange={handleOnChange}
              className="hidden"
            />
          </div>

          <form className="pt-6 flex flex-col gap-3" onSubmit={handleOnSubmit}>
            <div className="grid">
              <label>Name: </label>
              <div className="bg-slate-100 p-2">
                <input
                  type="text"
                  placeholder="Enter username"
                  name="fullName"
                  value={data.username}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="grid">
              <label>Email: </label>
              <div className="bg-slate-100 p-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="grid">
              <label>Password: </label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
                <div className="cursor-pointer text-xl">
                  <div
                    className="eye-icon-holder"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid">
              <label>Confirm Password: </label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
                <div className="cursor-pointer text-xl">
                  <div
                    className="eye-icon-holder"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </div>
                </div>
              </div>
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">
              Sign Up
            </button>
          </form>

          <p className="my-5">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className=" text-red-600 hover:text-red-700 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
