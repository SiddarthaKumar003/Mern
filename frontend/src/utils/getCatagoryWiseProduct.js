import summaryApi from "."

const getCatarogywiseProducts = async(catagory)=>{
    const response = await fetch(summaryApi.catagoryWiseProducts.url,{
        method:summaryApi.catagoryWiseProducts.method,
        headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body:JSON.stringify({catagory:catagory})
    })

    if(!response.ok) console.log("Somethibg went wrong while making request for catagory wise products list");

    const data = await response.json()
    // console.log("All Product details data",data);
    return data.data;
}

export default getCatarogywiseProducts