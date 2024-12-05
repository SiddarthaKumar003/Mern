import React from 'react'
import CatagoryList from '../components/CatagoryList'
import SliderBanner from '../components/SliderBanner'
import HorizontalCardProduct from '../components/HorizontalCardProduct'

function Home() {
  return (
    <div className='px-5'>
      <CatagoryList/>
      <SliderBanner/>
      <HorizontalCardProduct heading={"Top Airpod's"} catagory={"airpodes"}/>
      <HorizontalCardProduct heading={"Top Speaker's"} catagory={"speakers"}/>
    </div>
  )
}

export default Home