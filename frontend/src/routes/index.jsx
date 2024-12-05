import {createBrowserRouter} from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Login from '../pages/Login'
import ForgotPassword from '../pages/ForgotPassword'
import Signup from '../pages/Signup'
import AdminPanel from '../pages/AdminPanel'
import AllUser from '../pages/AllUser'
import AllProducts from '../pages/AllProducts'
import AllCatagoryProducts from '../pages/AllCatagoryProducts'
import ProductDetails from '../pages/ProductDetails'
import ViewCart from '../pages/ViewCart'
import UpdateProfile from '../pages/UpdateProfile'
import PaymentSuccessPage from '../pages/PaymentSuccessPage'
import OrderPreviewPage from '../pages/OrderPreview'
import SearchItems from '../pages/SearchItems'

const router = createBrowserRouter([
    {
        path:"/",
        element: <App/>,
        children:[
            {
                path:"",
                element:<Home/>
            },
            {
                path:"login",
                element:<Login/>
            },
            {
                path:"forgot-password",
                element:<ForgotPassword/>
            },
            {
                path:"signup",
                element:<Signup/>
            },
            {
                path:"product-category",
                element:<AllCatagoryProducts/>
            },
            {
                path:"product/:id",
                element:<ProductDetails/>
            },
            {
                path:"view-cart",
                element:<ViewCart/>
            },
            {
                path:"update-profile",
                element:<UpdateProfile/>
            },
            {
                path:"order-preview",
                element:<OrderPreviewPage/>
            },
            {
                path:"payment-success/:session_id",
                element:<PaymentSuccessPage/>
            },
            {
                path:"/search",
                element:<SearchItems/>
            },
            {
                path:"admin-panel",
                element:<AdminPanel/>,
                children:[
                    {
                        path:"all-users",
                        element:<AllUser/>
                    },
                    {
                        path:"all-products",
                        element:<AllProducts/>
                    }
                ]
            }
        ]
    }
])

export default router