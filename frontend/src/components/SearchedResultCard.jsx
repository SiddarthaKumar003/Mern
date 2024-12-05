import React, { useContext } from 'react'
import displayINRCurrency from '../utils/displayCurrency.js'
import { Link } from 'react-router-dom'
import scrollTop from '../utils/scrollTop.js'
import Context from '../context/index.js';

function SearchedResultCard({ loading, data = [] }) {
    const loadingList = new Array(data.length).fill(null);
    const {handleAddToCart} = useContext(Context)
    return (
        <div className='grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] md:grid-cols-6 gap-6 justify-center md:justify-start overflow-x-scroll scrollbar-none transition-all'>
            {
                loading ? (
                    loadingList.map((product, index) => (
                        <div key={index} className='w-full bg-white rounded-sm shadow'>
                            <div className='bg-slate-200 h-48 flex justify-center items-center animate-pulse'></div>
                            <div className='p-4 grid gap-3'>
                                <h2 className='font-medium text-base text-ellipsis line-clamp-1 bg-slate-200 p-1 animate-pulse'></h2>
                                <p className='bg-slate-200 p-1 animate-pulse'></p>
                                <div className='flex gap-3'>
                                    <p className='bg-slate-200 p-1 animate-pulse w-full'></p>
                                    <p className='bg-slate-200 p-1 animate-pulse w-full'></p>
                                </div>
                                <button className='bg-slate-200 p-2 animate-pulse'></button>
                            </div>
                        </div>
                    ))
                ) : (
                    data.map((product, index) => (
                        <Link key={index} to={"/product/" + product?._id} className='w-full bg-white rounded-sm shadow' onClick={scrollTop}>
                            <div className='bg-slate-200 h-48 flex justify-center items-center'>
                                <img src={product?.productImage[0]} alt={product?.productName} className='w-full object-contain h-full transition-all mix-blend-multiply' />
                            </div>
                            <div className='p-4 grid gap-3'>
                                <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.productName}</h2>
                                <p className='capitalize text-slate-500'>{product?.category}</p>
                                <div className='flex gap-3'>
                                    <p className='text-red-600 font-medium'>{displayINRCurrency(product?.sellingPrice)}</p>
                                    <p className='text-slate-500 line-through'>{displayINRCurrency(product?.price)}</p>
                                </div>
                                <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' onClick={(e) => handleAddToCart(e, product?._id)}>Add to Cart</button>
                            </div>
                        </Link>
                    ))
                )
            }
        </div>
    )
}

export default SearchedResultCard;
