import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import summaryApi from '../utils'
import SearchedResultCard from '../components/SearchedResultCard'
import noDataFound from '../assest/no-data-found.jpg'

function SearchItems() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const location = useLocation()
    console.log("The location", location);
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('query')

        // calling the api for get searched items
        const getSearchedProducts = async () => {
            try {
                setLoading(true)
                const url = `${summaryApi.getSearchedItems.url}?query=${query}`
                const response = await fetch(url, {
                    method: summaryApi.getSearchedItems.method
                })
                const data = await response.json()
                if (data.success) {
                    console.log("Searched items results", data);
                    setData(data.data)
                    setLoading(false)
                }

            } catch (error) {
                console.log("Error while fetching searched products", error);
            }
        }
        if (query)
            getSearchedProducts()

    }, [location.search])
    return (
        <div className='mx-auto p-4 h-full flex flex-col'>
            {
                loading && (
                    <p className='text-lg text-center'>Loading ...</p>
                )
            }

            <p className='text-lg font-semibold my-3'>Search Results : {data.length}</p>

            {
                data.length === 0 && !loading && (
                    <div className='text-lg text-center p-4 flex-1 flex flex-col justify-center items-center gap-2'>
                        <img src={noDataFound} alt="No data found" width={200} height={200}/>
                        <p>No Data Found...</p>
                    </div>
                )
            }


            {
                data.length !== 0 && !loading && (
                    <SearchedResultCard loading={loading} data={data} />
                )
            }

        </div>
    )
}

export default SearchItems