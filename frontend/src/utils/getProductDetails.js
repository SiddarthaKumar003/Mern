import summaryApi from "."

const getProductDetails = async(productId)=>{
    const response = await fetch(summaryApi.getProductDetails.url,{
        method:summaryApi.getProductDetails.method,
        headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body:JSON.stringify({productId})
    })

    if(!response.ok) console.log("Somethibg went wrong while making request for catagory wise products list");

    const data = await response.json()
    // console.log("All Product details data",data);
    return data.data;
}

export default getProductDetails