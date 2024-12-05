import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import success from '../assest/success-unscreen.gif'
import summaryApi from '../utils'
import { toast } from 'react-toastify'

function PaymentSuccessPage() {
    const { session_id } = useParams()
    const [paymentInformation, setPaymentInformation] = useState({})
    useEffect(() => {
        const paymentInformation = JSON.parse(localStorage.getItem('paymentInformation'))
        if (paymentInformation) {
            console.log('Retrived payment information', paymentInformation);
            setPaymentInformation(paymentInformation)
        }
    }, [])
    const verifyConfirmOrder = async () => {
        try {
            const response = await fetch(summaryApi.verifyPayment.url, {
                method: summaryApi.verifyPayment.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                        sessionId: session_id,
                        cartItems: paymentInformation.selectedProducts,
                        address: paymentInformation.selectedAddress,
                        totalQuantity:paymentInformation.totalQty
                    }
                ),
            })
            if(!response.ok) toast.error("payment is not verified")
            const data = await response.json()
            if(data.success){
                console.log("Payment verification & order details",data);
                toast.success("Order is confirmed")
            }
            else{
                toast.error("Something went wrong")
            }
        } catch (error) {
            console.log("Error while creating the payment:", error);
        }
    }
    return (
        <div className='w-100 h-full flex justify-center items-center'>
            <div className='bg-slate-200 w-full max-w-md mx -auto flex items-center justify-center flex-col p-4 m-2 rounded-md'>
                <img src={success} alt="Payment Success Image" width={350} height={350} />
                <p className='text-green-600 font-bold text-xl text-center mb-4'>Your Payment has been iniatiated successfully</p>
                <button className=' w-fit text-center p-2 px-3 mt-5 border-2 rounded-sm border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white' onClick={verifyConfirmOrder}>Verify & Confirm Order</button>
            </div>
        </div>
    )
}

export default PaymentSuccessPage