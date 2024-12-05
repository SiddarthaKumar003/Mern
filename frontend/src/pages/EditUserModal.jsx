import React, { useEffect } from 'react'
import { MdClose } from 'react-icons/md';
import { useState } from 'react';
import ROLE from '../utils/role';
import summaryApi from '../utils';
import { toast } from 'react-toastify';

function EditUserModal({ User, closeModal,callback}) {
    // console.log("User details:-", editUser);
    const [editUser, setEditUser] = useState(User);
    useEffect(()=>{
        console.log("Updated edit user details:",editUser);
        console.log("Updated edit user Id:",editUser._id);
    },[editUser])
    const handleSave = async() => {
        // Logic to save the edited user details
        console.log('Saving user:', editUser);
        const url = `${summaryApi.updateUser.url}/${editUser._id}`
        const response = await fetch(url,{
            method:summaryApi.updateUser.method,
            headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body:JSON.stringify(editUser)
        })

        if(!response.ok) toast.error("Bad request for update user details")
        // This is the updated data
        const data = await response.json()

        if(data.success){
            toast.success("User updated successfully")
            console.log("Updated user details response:",data);
            closeModal();
            callback(); // Close modal after saving
        }
        else if(!data.success){
            toast.error("Something went wrong user detials updated");
        }
    };
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='bg-white w-96 p-6 rounded-lg shadow-lg'>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-bold'>Edit User</h2>
                    <button
                        type="button"
                        onClick={() => { closeModal() }}
                        className='text-red-500 hover:text-red-700'
                    >
                        <MdClose size={24} />
                    </button>
                </div>
                <div className='space-y-4'>
                    <div>
                        <label className='block text-gray-700'>Full Name</label>
                        <input
                            type='text'
                            value={editUser.fullName}
                            onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
                            className='w-full p-2 border border-gray-300 rounded'
                        />
                    </div>
                    <div>
                        <label className='block text-gray-700'>Email</label>
                        <input
                            type='email'
                            value={editUser.email}
                            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                            className='w-full p-2 border border-gray-300 rounded'
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <label className='block text-gray-700'>Role</label>
                        {/* <input
                            type='text'
                            value={editUser.role}
                            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                            className='w-full p-2 border border-gray-300 rounded'
                        /> */}
                        <select 
                            className='border p-2' 
                            name="role"
                            id="selectRole"
                            value={editUser.role}
                            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                            >
                            {Object.values(ROLE).map((option)=>{
                                return (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <div className='mt-5 flex justify-end space-x-2'>
                    <button
                        type="button"
                        onClick={handleSave}
                        className='bg-red-600 hover:bg-red-700 px-6 py-1 rounded-md text-white'
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={closeModal}
                        className='bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-md text-black'
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditUserModal