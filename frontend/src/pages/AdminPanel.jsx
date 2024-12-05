import React from 'react'
import { useSelector } from 'react-redux'
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function AdminPanel() {
  const user = useSelector(state=>state?.user?.user)
  console.log("User details in admin panel:",user);
  return (
    <div className='h-full md:flex hidden'>

        <aside className='bg-white min-h-full py-5  w-full  max-w-60 shadow-lg'>
                {/*** user details section */}
                <div className='h-32  flex justify-center items-center flex-col gap-1'>
                    <div className='text-5xl cursor-pointer relative flex justify-center'>
                        {
                        user?.profileImage                        ? (
                            <img src={user?.profileImage} className='w-20 h-20 rounded-full' alt={user?.fullName} />
                        ) : (
                          <CgProfile />
                        )
                        }
                    </div>
                    <p className='capitalize text-lg font-semibold'>{user?.fullName}</p>
                    <p className='text-sm'>{user?.role}</p>
                </div>
                 {/***navigation */}       
                <div>   
                    <nav className='grid p-4'>
                        <Link to={"all-users"} className='px-2 py-1 hover:bg-slate-100'>All Users</Link>
                        <Link to={"all-products"} className='px-2 py-1 hover:bg-slate-100'>All product</Link>
                    </nav>
                </div>  
        </aside>

        <main className='w-full h-full p-2'>
            <Outlet/>
        </main>
    </div>
  )
}

export default AdminPanel