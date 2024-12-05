import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import summaryApi from '../utils';
import { toast } from 'react-toastify';
import VerticalCardProduct from '../components/VerticalCardProduct';
import getCatagoryWiseProductList from '../utils/getCatagoryList';
import SearchedResultCard from '../components/SearchedResultCard';
import Pagination from '../components/Pagination';

function AllCatagoryProducts() {
    const [searchParams] = useSearchParams();
    // This is the catagory that will come from home page
    // when user will land to this page by choosing products from catagory section
    const defaultCategory = searchParams.get('category')
    const defaultBrand = searchParams.get('brand')
    const [allCatatories, setAllCatagories] = useState([])
    const [allBrands, setAllBrands] = useState([])
    const [catagory, setCatagory] = useState(defaultCategory ? [defaultCategory] : [])
    const [brands, setBrands] = useState(defaultBrand ? [defaultBrand] : [])
    const [sorting, setSorting] = useState('')
    // const [data, setData] = useState([])
    const [productData, setProductData] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentPage,setCurrentPage] = useState(1)
    const [limit,setLimit] = useState(12)
    const [totalPages,setTotalPage] = useState(0)


    const prepareFilterData = async () => {
        try {
            setLoading(true)
            // prepare the data for product and catagory
            const response = await fetch(summaryApi.getAllProducts.url, {
                method: summaryApi.getAllProducts.method
            })
            const data = await response.json()
            if (data.success) {
                console.log("All products data", data);
                setAllCatagories([...new Set(data.data.map((product) => product.category))])
                setAllBrands([...new Set(data.data.map((product) => product.brandName))])
            }

        } catch (error) {
            console.log("Error fetching catagorywise product list", error);
        }
    }
    useEffect(() => {
        prepareFilterData()
    }, [])

    // fetched filter products
    const fetchFilteredProducts = async () => {
        try {
            setLoading(true)

            // build query parameters for the API
            const queryParams = new URLSearchParams({
                category: catagory.join(','),
                brands: brands.join(','),
                priceSort: sorting,
                page:currentPage,
                limit:limit
            }).toString()

            const url = `${summaryApi.getFilteredItems.url}?${queryParams}`

            const response = await fetch(url, {
                method: summaryApi.getFilteredItems.method
            })
            // check the reponse
            if (!response.ok) toast.error("Error while making requerst for filter data")

            const data = await response.json()

            if (data.success) {
                setProductData(data.data)
                setTotalPage(data.totalPages)
                setLoading(false)
            }

        } catch (error) {
            console.log("Error fetching filtered products", error);
        }
    }


    // handle all filter items change
    const handleCategoryChange = (e) => {
        const choosedCtegory = e.target.value;
        const isPresent = catagory.includes(choosedCtegory)
        if (isPresent) {
            setCatagory((prevCaterogy) => {
                const updatedCategory = prevCaterogy.filter((category) => category != choosedCtegory)
                return updatedCategory
            })
        }
        else {
            setCatagory((prevCaterogy) => {
                const updatedCategory = [...prevCaterogy, choosedCtegory]
                return updatedCategory
            })
        }
    }

    const handleBrandChange = (e) => {
        const choosedBrand = e.target.value;
        const isPresent = brands.includes(choosedBrand)
        if (isPresent) {
            setBrands((prevBrands) => {
                const updatedBrands = prevBrands.filter((brand) => brand != choosedBrand)
                return updatedBrands
            })
        }
        else {
            setBrands((prevBrands) => {
                const updatedBrands = [...prevBrands, choosedBrand]
                return updatedBrands
            })
        }
    }

    const handleSorting = (e) => {
        setSorting(e.target.value)
    }

    useEffect(() => {
        fetchFilteredProducts()
        console.log("Updated category:", catagory);
        console.log("Updated brans:", brands);
    }, [catagory, brands, sorting,currentPage])



    // handling the page changes
    const onPageChange = (currentPage)=>{
        if(currentPage>0 && currentPage<=totalPages)
            setCurrentPage(currentPage)
    }

    return (
        <div className='h-full mx-auto p-4'>

            {/***desktop version */}
            <div className='h-full hidden lg:grid grid-cols-[230px,1fr]'>
                {/***left side */}
                <div className='bg-white p-3 max-h-full overflow-y-auto scrollbar-none'>
                    {/**sort by */}
                    <div className=''>
                        <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>

                        <form className='text-sm flex flex-col gap-2 py-2'>
                            <div className='flex items-center gap-3'>
                                <input type='radio' name='sortBy' value={'lowToHigh'} onChange={handleSorting} />
                                <label>Price - Low to High</label>
                            </div>

                            <div className='flex items-center gap-3'>
                                <input type='radio' name='sortBy' value={'highToLow'} onChange={handleSorting} />
                                <label>Price - High to Low</label>
                            </div>
                        </form>
                    </div>


                    {/**filter by category */}
                    <div className=''>
                        <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>

                        <form className='text-sm flex flex-col gap-2 py-2'>
                            {
                                allCatatories.map((category, index) => {
                                    return (
                                        <div className='flex items-center gap-3'>
                                            <input
                                                type='checkbox'
                                                name={"category"}
                                                checked={catagory.includes(category)}
                                                value={category}
                                                id={category + index}
                                                onChange={handleCategoryChange}
                                            />
                                            <label htmlFor={category + index}>{category}</label>
                                        </div>
                                    )
                                })
                            }
                        </form>
                    </div>

                    {/**filter by brands */}
                    <div className=''>
                        <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Brands</h3>

                        <form className='text-sm flex flex-col gap-2 py-2'>
                            {
                                allBrands.map((brand, index) => {
                                    return (
                                        <div className='flex items-center gap-3'>
                                            <input
                                                type='checkbox'
                                                name={"brands"}
                                                value={brand}
                                                id={brand + index}
                                                onChange={handleBrandChange}
                                            />
                                            <label htmlFor={brand + index}>{brand}</label>
                                        </div>
                                    )
                                })
                            }
                        </form>
                    </div>
                </div>

                {/***right side ( product ) */}
                <div className='px-4 max-h-full overflow-hidden'>
                    <p className='font-medium text-slate-800 text-lg my-2'>Search Results : {productData.length}</p>

                    <div className='overflow-y-auto max-h-[86%] scrollbar-none'>
                        {
                            productData.length !== 0 && !loading && (
                                <SearchedResultCard data={productData} loading={loading} />
                            )
                        }
                    </div>

                    {/* pagination section */}
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange}/>

                </div>
            </div>

        </div>
    )
}

export default AllCatagoryProducts