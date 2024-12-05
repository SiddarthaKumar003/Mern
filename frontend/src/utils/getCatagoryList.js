import summaryApi from "."

const getCatagoryWiseProductList = async()=>{
    try {
        const response = await fetch(summaryApi.catagoryWiseProduct.url, {
            method: summaryApi.catagoryWiseProduct.method
        })
        if (!response.ok) toast("something went wrong while fetching catagory wise product details")
        const data = await response.json()

        if (data.success) {
            // toast.success(data.message)
            return data.data
        }
        else {
            toast.error("Catagory fetched went wrong")
        }
    } catch (error) {
        console.log("Getting error while taking products catagorywise", error);
    }
}

export default getCatagoryWiseProductList