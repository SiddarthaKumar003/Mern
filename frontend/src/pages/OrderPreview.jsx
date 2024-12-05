import React from 'react';
import displayINRCurrency from '../utils/displayCurrency.js';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import summaryApi from '../utils/index.js';

function OrderPreviewPage() {
    const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY);
    const location = useLocation();
    const { selectedProducts, selectedAddress, totalQty, gst, deliverCharges, packingCharge, totalPrice, discountedPrice, finalPrice } = location.state;
    const handlePayment = async () => {
        try {
            const response = await fetch(summaryApi.initiatePayment.url, {
                method: summaryApi.initiatePayment.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ cartItems: selectedProducts, totalAmount: totalPrice }),
            });

            if (!response.ok) toast.error("Something went wrong while iniate payment")

            const data = await response.json()

            if (data.success) {
                console.log("Payment iniate data:", data.data);
                localStorage.setItem('paymentInformation', JSON.stringify(
                    {
                        selectedProducts,
                        selectedAddress,
                        totalQty,
                        finalPrice
                    }
                ))
                const stripe = await stripePromise;
                await stripe.redirectToCheckout({ sessionId: data.sessionId });
            }
            else {
                toast.error("Something went wrong while payment")
            }
        } catch (error) {
            console.log("Payment initiation error", error);
        }
    }
    return (
        <div className="p-6 lg:flex lg:gap-8">
            {/** Left Section: Product Details */}
            <div className="basis-[60%]">
                <h2 className="text-xl font-bold mb-4">Selected Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {selectedProducts.map((product, index) => (
                        <div key={index} className="bg-white border border-slate-300 shadow-lg rounded-lg overflow-hidden">
                            <div className="grid grid-cols-[128px,1fr]">
                                <div className="bg-slate-200 w-32">
                                    <img src={product?.productId?.productImage[0]} className="w-full h-full object-scale-down" />
                                </div>
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold">{product?.productId?.productName}</h2>
                                    <p className="text-slate-500 capitalize">{product?.productId?.category}</p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <p className="text-red-600 font-medium">{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                        <p className="text-slate-600 font-semibold">{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                    </div>
                                    <p className="mt-2">Quantity: {product?.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/** Right Section: Address and Order Summary */}
            <div className="basis-[40%]">
                {/** Card for Address */}
                <div className="bg-white border shadow-lg rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Selected Address</h2>
                    <div className="bg-white">
                        <p><strong>Street:</strong> {selectedAddress?.street}</p>
                        <p><strong>City:</strong> {selectedAddress?.city}</p>
                        <p><strong>State:</strong> {selectedAddress?.state}</p>
                        <p><strong>Country:</strong> {selectedAddress?.country}</p>
                        <p><strong>Pin Code:</strong> {selectedAddress?.zipCode}</p>
                    </div>
                </div>

                {/** Card for Order Summary */}
                <div className="basis-[20%] md:basis-[20%] h-fit bg-white p-6 rounded-lg shadow-lg">
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
                    <div className="flex items-center justify-between px-4 mb-4">
                        <p className="text-slate-700">Discounted Price</p>
                        <p className="font-semibold">{displayINRCurrency(discountedPrice)}</p>
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

                    {/** Final Price */}
                    <div className="flex items-center justify-between mt-6 px-4 border-t pt-4 font-semibold">
                        <p className="text-slate-700">Final Price</p>
                        <p className="text-lg text-red-600">{displayINRCurrency(finalPrice)}</p>
                    </div>

                    {/** Confirm Order Button */}
                    <button
                        onClick={handlePayment}
                        className="bg-blue-600 p-2 text-white w-full mt-4 rounded-md"
                    >
                        Pay & Confirm Order
                    </button>
                </div>

            </div>
        </div>
    );
}

export default OrderPreviewPage;
