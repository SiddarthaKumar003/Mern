import React, { useContext, useEffect, useState } from 'react'
import Context from '../context'
import { MdDelete } from "react-icons/md";
import displayINRCurrency from '../utils/displayCurrency.js'
import summaryApi from '../utils/index.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ViewCart() {
    const [loading, setLoading] = useState(false);
    const loadingCart = new Array(5).fill(null);
    const [data, setData] = useState([]);
    const { getCartDetails, handleAddToCart } = useContext(Context);
    const user = useSelector((state) => state.user?.user);
    const [saveddAddress, setSavedAddress] = useState(user.addresses);
    const [selectedAddress, setSelectedAddress] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQty, setTotalQty] = useState(0);
    const [coupon, setCoupon] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState(null);
    const [finalPrice, setFinalPrice] = useState(null)
    const [gst, setGst] = useState(null)
    const [packingCharge, setPackingCharges] = useState(null)
    const [deliverCharges, setDeliveryCharges] = useState(null)
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const navigate = useNavigate()

    // cupons sections
    const coupons = [
        { code: 'DISCOUNT10', discount: 0.1 },
        { code: 'SALE20', discount: 0.2 },
        { code: 'OFFER30', discount: 0.3 }
    ];

    // Fetch current cart details
    useEffect(() => {
        const fetchCartDetails = async () => {
            setLoading(true);
            const cartData = await getCartDetails();
            setData(cartData?.data?.products || []);
            setLoading(false);
        };
        fetchCartDetails();
    }, [getCartDetails]);

    // Handle product quantity update
    const updateProductQuantity = async (productId, quantity, index) => {
        const currentUserData = await handleAddToCart(null, productId, quantity);
        setData((prevData) => {
            const updatedData = [...prevData];
            updatedData[index] = { ...updatedData[index], quantity: currentUserData.quantity };
            return updatedData;
        });
    };

    // Calculate total quantity and price
    useEffect(() => {
        // Calculate total quantity for selected items
        const totalQty = data.reduce((sum, product) => {
            return product.isItemSelected ? sum + product.quantity : sum;
        }, 0);

        // Calculate total price for selected items
        const totalPrice = data.reduce((sum, product) => {
            return product.isItemSelected ? sum + (product.productId.sellingPrice * product.quantity) : sum;
        }, 0);
        setGst(totalPrice * 0.18)
        setPackingCharges(totalQty * 10)
        setDeliveryCharges(() => totalPrice && 40)
        setTotalQty(totalQty);
        setTotalPrice(totalPrice);
        // if (discountedPrice) {
        //     setDiscountedPrice(totalPrice - totalPrice * selectedCoupon.discount)
        // }
        // setFinalPrice(() => discountedPrice ? discountedPrice + gst + deliverCharges + packingCharge : totalPrice + gst + deliverCharges + packingCharge)
    }, [data, discountedPrice]);


    useEffect(() => {
        if (discountedPrice !== null) {
            setFinalPrice(discountedPrice + gst + deliverCharges + packingCharge);
        } else {
            setFinalPrice(totalPrice + gst + deliverCharges + packingCharge);
        }
    }, [discountedPrice, gst, deliverCharges, packingCharge, totalPrice]);


    // handle the cart selection
    const handleCartSelection = async (productId) => {
        try {
            const response = await fetch(summaryApi.toggleSelectedCart.url, {
                method: summaryApi.toggleSelectedCart.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ productId })
            })
            if (!response.ok) toast.error("Internal server error for update the cart selection")
            const data = await response.json()
            if (data.success) {
                console.log("The updated cart data:", data);
                setData(data?.data?.products);
            }
            else {
                console.log("Cart updation failed");
            }
        } catch (error) {
            console.log("Error in update selection of the cart:", error);
        }
    }


    // handle remove item from cart
    const removeCartItem = async (productId) => {
        try {
            const response = await fetch(summaryApi.removeFromCart.url, {
                method: summaryApi.removeFromCart.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ productId })
            })
            if (!response.ok) toast.error("Internal server error for update the cart selection")
            const data = await response.json()
            if (data.success) {
                console.log("The updated cart data:", data);
                const updatedCart = await getCartDetails(); // Re-fetching the cart
                setData(updatedCart?.data?.products || []);
            }
            else {
                console.log("Cart updation failed");
            }
        } catch (error) {
            console.log("Error in update selection of the cart:", error);
        }
    }


    const handleOrderPreview = async () => {
        // firstly prepare the data for iniatiate payment
        const selectedProduct = data.filter((product) => product.isItemSelected)
        console.log("Selected Product List", selectedProduct);
        console.log("Total Quantity:", totalPrice);
        if (selectedProduct.length > 0) {
            navigate('/order-preview', {
                state: {
                    selectedProducts: selectedProduct,
                    selectedAddress:newAddress.isPresent?newAddress:selectedAddress,
                    totalQty,
                    gst,
                    deliverCharges,
                    packingCharge,
                    totalPrice,
                    discountedPrice,
                    finalPrice
                }
            });
        } else {
            toast.error("Please select products and address before proceeding.");
        }
        // try {
        //     const response = await fetch(summaryApi.initiatePayment.url, {
        //         method: summaryApi.initiatePayment.method,
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         credentials: 'include',
        //         body: JSON.stringify({ cartItems: selectedProduct, totalAmount: totalPrice }),
        //     });

        //     if (!response.ok) toast.error("Something went wrong while iniate payment")

        //     const data = await response.json()

        //     if (data.success) {
        //         console.log("Payment iniate data:", data.data);
        //         const stripe = await stripePromise;
        //         await stripe.redirectToCheckout({ sessionId: data.sessionId });
        //     }
        //     else {
        //         toast.error("Something went wrong while payment")
        //     }
        // } catch (error) {
        //     console.log("Payment initiation error", error);
        // }
    }
    // Apply coupon (for simplicity, assuming a flat 10% discount)
    useEffect(() => {
        if (selectedCoupon) {
            // Apply the discount when selectedCoupon is updated
            const isCouponPresent = coupons.find(coupon =>
                coupon.code === selectedCoupon.code && coupon.discount === selectedCoupon.discount
            );
            if (isCouponPresent) {
                const discountAmount = totalPrice * selectedCoupon.discount;
                setDiscountedPrice(totalPrice - discountAmount);
            } else {
                setDiscountedPrice(null);
                toast.error('Invalid coupon');
            }
        }
    }, [selectedCoupon, totalPrice]);


    const handleAddressSelection = (address) => {
        setSelectedAddress(address)
      };

    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        isPresent:false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress({ ...newAddress, [name]: value });
    };

    const handleNewAddAddress = (e) => {
        e.preventDefault();
        toast.success("New Address has been added")
        setSelectedAddress({})
        setNewAddress((prevAddress)=>({...prevAddress,isPresent:true}))
    };


    return (
        <div className="mx-auto p-4 lg:flex lg:justify-between lg:gap-5">
            {/** Left Section: Cart Products */}
            <div className="basis-[45%] md:basis-[45%]">
                {loading ? (
                    loadingCart.map((_, index) => (
                        <div key={index} className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"></div>
                    ))
                ) : (
                    data.map((product, index) => (
                        <div key={product?._id} className="w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]">
                            <div className="w-32 h-32 bg-slate-200">
                                <img src={product?.productId?.productImage[0]} className="w-full h-full object-scale-down mix-blend-multiply" />
                            </div>
                            <div className="px-4 py-2 relative">
                                <div className="absolute right-0 top-2 flex items-center gap-2">
                                    {/* Checkbox for selecting the item */}
                                    <input
                                        type="checkbox"
                                        checked={product?.isItemSelected}
                                        onChange={() => handleCartSelection(product?.productId?._id)}
                                        className="w-4 h-4 accent-red-600 cursor-pointer"
                                    />
                                    {/* Delete button */}
                                    <div className="text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer" onClick={() => removeCartItem(product?.productId?._id)}>
                                        <MdDelete />
                                    </div>
                                </div>
                                <h2 className="text-lg lg:text-xl">{product?.productId?.productName}</h2>
                                <p className="capitalize text-slate-500">{product?.productId.category}</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-red-600 font-medium">{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                    <p className="text-slate-600 font-semibold">{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <button className="border border-red-600 text-red-600 w-6 h-6 rounded" onClick={() => updateProductQuantity(product?.productId?._id, -1, index)}>-</button>
                                    <span>{product?.quantity}</span>
                                    <button className="border border-red-600 text-red-600 w-6 h-6 rounded" onClick={() => updateProductQuantity(product?.productId?._id, 1, index)}>+</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/** Middle Section: Saved Address & Temporary Address */}
            <div className="basis-[35%] md:basis-[35%]">
                <h2 className="text-xl font-bold mb-4">Addresses</h2>

                {/* Saved Addresses */}
                <div className="grid grid-cols-2 gap-4">
                    {saveddAddress.map((address,index) => (
                        <div
                            key={address.id}
                            className={`bg-white border-4 shadow-md rounded-lg p-4 ${selectedAddress?._id === address._id ? 'border-b-green-600' : ''
                                } border-b-red-600`}
                        >
                            {/* Radio Button */}
                            <div className="flex items-center mb-2">
                                <input
                                    id={`radio-${address?._id}`}
                                    type="radio"
                                    name="address-radio"
                                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
                                    checked={selectedAddress?._id === address?._id}
                                    onChange={() => handleAddressSelection(address)}
                                />
                                <label htmlFor={`radio-${address.id}`} className="ml-2">
                                    Select
                                </label>
                            </div>

                            <p><strong>Street:</strong> {address.street}</p>
                            <p><strong>City:</strong> {address.city}</p>
                            <p><strong>State:</strong> {address.state}</p>
                            <p><strong>Country:</strong> {address.country}</p>
                            <p><strong>Pin Code:</strong> {address.zipCode}</p>
                        </div>
                    ))}
                </div>

                {/* Temporary Address Form */}
                <div className="bg-white shadow-md rounded-lg p-6 mt-4">
                    <h3 className="text-lg font-semibold mb-4">Temporary Address</h3>
                    <form onSubmit={handleNewAddAddress}>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="street"
                                value={newAddress.street}
                                onChange={handleInputChange}
                                placeholder="Street"
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="city"
                                value={newAddress.city}
                                onChange={handleInputChange}
                                placeholder="City"
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="state"
                                value={newAddress.state}
                                onChange={handleInputChange}
                                placeholder="State"
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="country"
                                value={newAddress.country}
                                onChange={handleInputChange}
                                placeholder="Country"
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="postalCode"
                                value={newAddress.postalCode}
                                onChange={handleInputChange}
                                placeholder="Postal Code"
                                className="border p-2 rounded"
                            />
                        </div>
                        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Add Address</button>
                    </form>
                </div>
            </div>

            {/** Right Section: Order Summary & Coupon */}
            <div className="basis-[20%] md:basis-[20%] h-fit lg:w-1/3 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-white bg-red-600 px-4 py-2 mb-4 rounded-md text-lg">Order Summary</h2>

                {/** Total Quantity & Price */}
                <div className="flex items-center justify-between px-4 mb-2">
                    <p className="text-slate-700">Total Quantity</p>
                    <p className="font-semibold">{totalQty}</p>
                </div>
                <div className="flex items-center justify-between px-4 mb-4">
                    <p className="text-slate-700">Total Price</p>
                    <p className="font-semibold">{displayINRCurrency(totalPrice)}</p>
                </div>

                {/** Additional Charges */}
                <div className="border-t pt-3">
                    <div className="flex items-center justify-between px-4 mb-2">
                        <p className="text-slate-700">GST (18%)</p>
                        <p className="font-semibold">{displayINRCurrency(gst)}</p>
                    </div>
                    <div className="flex items-center justify-between px-4 mb-2">
                        <p className="text-slate-700">Delivery Charge</p>
                        <p className="font-semibold">{displayINRCurrency(deliverCharges)}</p>
                    </div>
                    <div className="flex items-center justify-between px-4 mb-4">
                        <p className="text-slate-700">Packing Charge</p>
                        <p className="font-semibold">{displayINRCurrency(packingCharge)}</p>
                    </div>
                </div>

                {/** Coupon Section */}
                <div className="mt-4 border-t pt-4">
                    <h3 className="font-medium text-lg">Apply Coupon</h3>
                    <div className="grid grid-cols-1 gap-2 mt-3">
                        {coupons.map((couponOption, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setCoupon(couponOption.code);
                                    setSelectedCoupon(couponOption);
                                }}
                                className={`p-2 border ${selectedCoupon?.code === couponOption.code ? 'bg-blue-100 border-blue-500' : 'border-gray-300'} rounded cursor-pointer`}
                            >
                                <p className="font-medium">{couponOption.code} - {couponOption.discount * 100}% OFF</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <input
                            type="text"
                            value={coupon}

                            className="border p-2 w-full"
                            placeholder="Enter coupon code"
                        />
                        <button className="bg-blue-600 p-2 text-white rounded-md">Apply</button>
                    </div>

                    {discountedPrice && (
                        <div className="text-green-600 mt-2">
                            Discounted Price: {displayINRCurrency(discountedPrice)}
                        </div>
                    )}
                </div>

                {/** Final Price */}
                <div className="flex items-center justify-between mt-6 px-4 border-t pt-4 font-semibold">
                    <p className="text-slate-700">Final Price</p>
                    <p className="text-lg text-red-600">{displayINRCurrency(finalPrice)}</p>
                </div>

                {/** Proceed to Payment Button */}
                <button
                    onClick={() => handleOrderPreview()}
                    className="bg-blue-600 p-2 text-white w-full mt-4 rounded-md"
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
}

export default ViewCart;
