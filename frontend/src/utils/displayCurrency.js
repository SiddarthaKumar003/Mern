const displayINRCurrency = (currency)=>{
    const currencyFormatter = new Intl.NumberFormat('en-IN',{
        style:"currency",
        currency:"INR",
        minimumFractionDigits:2
    })

    return currencyFormatter.format(currency)
}

export default displayINRCurrency