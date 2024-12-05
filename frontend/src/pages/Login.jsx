import React, { useContext, useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { Link } from 'react-router-dom';
import summaryApi from '../utils';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Context from '../context';

function Login() {
    // properties
    // defining the default properties
    const [showPassword, setShowPasswrod] = useState(false)
    const navigate = useNavigate()
    const {getUserDetails,getCartDetails} = useContext(Context)
    // console.log(context);
    
    // functions
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    }
    const handleOnLogin = async (e) => {
        try {
            e.preventDefault();
            const response = await fetch(summaryApi.login.url, {
                method: summaryApi.login.method, // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            // Check if the response status is OK (200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if(result.success){
                toast.success(result.message)
                navigate("/")
                getUserDetails()
                getCartDetails()
            } 
            if(result.error) toast.error(result.message)

            console.log('Success:', result);
            return result; // The server should return the JWT token or a success message

        } catch (error) {
            console.error('Error:', error);
        }
    }
    console.log("The data in form", data);

    return (
        <div>
            <div className='mx-auto container p-4'>

                <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                    <div className='w-20 h-20 mx-auto'>
                        <img src={loginIcons} alt='login icons' />
                    </div>

                    <form className='pt-6 flex flex-col gap-2' onSubmit={handleOnLogin}>
                        <div className='grid'>
                            <label>Email : </label>
                            <div className='bg-slate-100 p-2'>
                                <input
                                    type='email'
                                    placeholder='enter email'
                                    name='email'
                                    value={data.email}
                                    onChange={handleOnChange}
                                    className='w-full h-full outline-none bg-transparent' />
                            </div>
                        </div>

                        <div>
                            <label>Password : </label>
                            <div className='bg-slate-100 p-2 flex'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='enter password'
                                    name='password'
                                    value={data.password}
                                    onChange={handleOnChange}
                                    className='w-full h-full outline-none bg-transparent' />
                                <div className='cursor-pointer text-xl'>
                                    <div className='eye-icon-holder' onClick={() => setShowPasswrod(!showPassword)}>
                                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </div>
                                </div>
                            </div>
                            <Link to={"/forgot-password"} className='block w-fit ml-auto hover:underline hover:text-red-600'>
                                Forgot password ?
                            </Link>
                        </div>

                        <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Login</button>

                    </form>

                    <p className='my-5'>Don't have account ? <Link to={"/signup"} className=' text-red-600 hover:text-red-700 hover:underline'>Sign up</Link></p>
                </div>


            </div>
        </div>
    )
}

export default Login