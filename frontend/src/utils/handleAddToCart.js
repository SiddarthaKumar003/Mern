const handleAddToCart = async (e, productId, quantity = 1) => {
    // This is for preventing the click of the parent
    // Bcz I have added onclick on the parent to prevent that thing I am using this
    e.preventDefault()
    e.stopPropagation()

    console.log("Product Id:", productId);
    console.log("Quantity:", quantity)

    try {
        const response = await fetch(summaryApi.addToCart.url, {
            method: summaryApi.addToCart.method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                productId,
                quantity
            })
        })

        if (!response.ok) toast.error("Bad request for add to cart product")

        const data = await response.json()

        if (data.success) {
            toast.success("Item added to cart");
            console.log("Cart details for this user:", data.data);
        }
    } catch (error) {
        console.log("Error in handling the add to cart item:",error);
    }
}

export default handleAddToCart