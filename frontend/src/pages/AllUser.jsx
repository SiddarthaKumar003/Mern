import React, { useEffect, useState } from 'react';
import summaryApi from '../utils';
import { toast } from 'react-toastify';
import { MdModeEdit } from "react-icons/md";
import EditUserModal from './EditUserModal';

function AllUser() {
  const [allUsers, setAllUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    console.log('Updated allUsers:', allUsers);
  }, [allUsers]);

  const getAllUsers = async () => {
    try {
      const response = await fetch(summaryApi.getAllUsers.url, {
        method: summaryApi.getAllUsers.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) toast.error('Request is unsuccessful');

      const data = await response.json();

      if (data.success) {
        setAllUsers(data.data);
        console.log(allUsers);
      } else if (data.error) {
        toast.error('Something went wrong while fetching data');
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditUser(null);
  };

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-4'>All Users</h1>
      <table className='min-w-full bg-white'>
        <thead>
          <tr className='bg-black border text-white'>
            <th className='p-2 text-start border-gray-300 border'>Full Name</th>
            <th className='p-2 text-start border-gray-300 border'>Email</th>
            <th className='p-2 text-start border-gray-300 border'>Role</th>
            <th className='p-2 text-start border-gray-300 border'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => (
            <tr key={user._id}>
              <td className='p-2 border-gray-300 border'>{user.fullName}</td>
              <td className='p-2 border-gray-300 border'>{user.email}</td>
              <td className='p-2 border-gray-300 border'>{user.role}</td>
              <td className='p-2 border-gray-300 border'>
                <button
                  type="button"
                  onClick={() => handleEdit(user)}
                  className='bg-green-100 p-2 rounded-full cursor-pointer hover:bg-green-500 hover:text-white'
                >
                  <MdModeEdit/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <EditUserModal User={editUser} closeModal={closeModal} callback={getAllUsers}/>
      )}
    </div>
  );
}

export default AllUser;
