import React, { useEffect, useState } from 'react'
import UploadProduct from './UploadProduct'
import { toast } from 'react-toastify'
import summaryApi from '../utils'
import AdminProductCard from '../components/AdminProductCard'

function AllProducts() {
    const [showModal, setShowModal] = useState(false)
    const [allProducts,setAllProducts] = useState([])
    const getAllProducts = async () => {
        try {
            const response = await fetch(summaryApi.getAllProducts.url, {
                method: summaryApi.getAllProducts.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            if (!response.ok) toast.error('Request is unsuccessful');

            const data = await response.json();

            if (data.success) {
                toast.success(data.message)
                setAllProducts(data.data);
                console.log("All product fetched:",data.data);
            } else if (data.error) {
                toast.error('Something went wrong while fetching data');
            }
        } catch (error) {
            toast.error(error)
            console.log(error);
        }
    }
    useEffect(()=>{
        getAllProducts()
    },[])
    return (
        <div className='h-full'>
            <div className='bg-white py-2 px-4 flex justify-between items-center'>
                <h2 className='font-bold text-lg'>All Product</h2>
                <button className='border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full ' onClick={() => setShowModal(true)}>Upload Product</button>
            </div>
            <div className="max-h-[94%] overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200 flex flex-wrap items-center gap-5 py-4">
                {
                    allProducts.map((product)=>{
                        return (
                            <AdminProductCard data={product} onSuccess={getAllProducts}/>
                        )
                    })
                }
            </div>
            {
                showModal && (
                    <UploadProduct onClose={() => { setShowModal(false) }} onSuccess={getAllProducts}/>
                )
            }
        </div>
    )
}

export default AllProducts