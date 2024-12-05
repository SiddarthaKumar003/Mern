import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaPlus, FaTrash } from 'react-icons/fa'; // Importing FontAwesome icons
import summaryApi from '../utils';
import { toast } from 'react-toastify';
import Context from '../context';
import { useNavigate } from 'react-router-dom';

function UpdateProfile() {
    const { getUserDetails } = useContext(Context)
    const user = useSelector((state) => state.user || {});
    const { fullName, email, profileImage,_id} = user.user
    const userAddress = user.user.addresses
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            // Fetch user details or redirect to login if not available
            navigate('/login');
        }
    }, [user, navigate]);
    // const { fullName, email, profileImage, _id } = useSelector((state) => state?.user?.user);
    const [userDetails, setUserDetails] = useState({
        fullName,
        email,
        profileImage
    });

    const [addresses, setAddresses] = useState(userAddress);
    // This is to update the user details
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };
    useEffect(() => {
        console.log("User details:", userDetails);
    }, [userDetails])
    // This is to chnage the address
    const handleAddressChange = (index, e) => {
        const { name, value } = e.target;
        const newAddresses = [...addresses];
        newAddresses[index][name] = value;
        console.log("New users address:", newAddresses);
        setAddresses(newAddresses);
    };
    // This is the function to add dummy address fields
    const handleAddAddress = () => {
        setAddresses([...addresses, { street: '', city: '', state: '', postalCode: '', country: '', isDefault: false }]);
    };
    // This is to remove the address
    const handleRemoveAddress = (index) => {
        const newAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(newAddresses);
    };
    // This is to set the address default
    const handleSetDefault = (index) => {
        const newAddresses = addresses.map((address, i) => ({
            ...address,
            isDefault: i === index
        }));
        setAddresses(newAddresses);
    };
    // This is to update the profile picture
    const handleProfilePictureChange = (e) => {
        setUserDetails({ ...userDetails, profilePicture: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("This is comes under submit");
        // Call backend API to update user profile and address

        // const formData = new FormData();
        // formData.append('fullName', userDetails.fullName)
        // formData.append('email', userDetails.email)
        // formData.append('profileImage', userDetails.profileImage)
        // formData.append('addresses', JSON.stringify(addresses));

        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }

        const payload = {
            fullName: userDetails.fullName,
            email: userDetails.email,
            profileImage: userDetails.profileImage,  // This will be a base64 string
            addresses: addresses,
        };

        // calling the API\
        const url = `${summaryApi.updateUser.url}/${_id}`
        const response = await fetch(url, {
            method: summaryApi.updateUser.method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        })

        if (!response.ok) toast.error("Bad request for update user details")
        // This is the updated data
        const data = await response.json()

        if (data.success) {
            toast.success("User updated successfully")
            console.log("Updated user details response:", data);
            getUserDetails();
        }
        else if (!data.success) {
            toast.error("Something went wrong user detials updated");
        }
    };

    return (
        <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <img
                            src={userDetails.profileImage}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                        <input
                            type="file"
                            onChange={handleProfilePictureChange}
                            className="absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={userDetails.fullName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg mt-2"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userDetails.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg mt-2"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-700">Addresses</h3>
                        <button
                            type="button"
                            onClick={handleAddAddress}
                            className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-700"
                        >
                            <FaPlus />
                        </button>
                    </div>
                    {/* here we are mapping over the full array of address */}
                    {addresses.map((address, index) => (
                        <div
                            key={index}
                            className="relative border p-4 rounded-lg mb-4 group"
                        >
                            <button
                                type="button"
                                onClick={() => handleRemoveAddress(index)}
                                className="absolute top-0 right-0 mt-2 mr-2 text-white bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                                <FaTrash size={12} />
                            </button>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-gray-700">Street</label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={address.street}
                                        onChange={(e) => handleAddressChange(index, e)}
                                        className="w-full px-4 py-2 border rounded-lg mt-2 bg-slate-100"
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-gray-700">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={address.city}
                                        onChange={(e) => handleAddressChange(index, e)}
                                        className="w-full px-4 py-2 border rounded-lg mt-2 bg-slate-100"
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-gray-700">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={address.state}
                                        onChange={(e) => handleAddressChange(index, e)}
                                        className="w-full px-4 py-2 border rounded-lg mt-2 bg-slate-100"
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-gray-700">Postal Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={address.zipCode}
                                        onChange={(e) => handleAddressChange(index, e)}
                                        className="w-full px-4 py-2 border rounded-lg mt-2 bg-slate-100"
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-gray-700">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={address.country}
                                        onChange={(e) => handleAddressChange(index, e)}
                                        className="w-full px-4 py-2 border rounded-lg mt-2 bg-slate-100"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={() => handleSetDefault(index)}
                                    className={`text-sm px-4 py-2 rounded-lg ${address.isDefault
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    {address.isDefault ? 'Default Address' : 'Set as Default'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {/* This is the button the update the profile detaisl with address */}
                <div className="flex flex-row-reverse gap-4 mt-8">
                    <button
                        type="submit"
                        className="px-6 py-2 rounded-full text-white bg-red-600 hover:bg-red-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateProfile;
