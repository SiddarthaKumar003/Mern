import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import Context from "./context";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails, setUserDetails } from "./redux/userSlice";
import summaryApi from "./utils";

function App() {
  const dispatch = useDispatch();
  const navigte = useNavigate();
  const user = useSelector((state) => state.user?.user);
  console.log("Test dotenv", import.meta.env.VITE_TEST);
  const [productInCart, setProductInCart] = useState(0);
  const getUserDetails = async () => {
    try {
      console.log("It's coming inside the getUserDetails");
      const response = await fetch(
        "http://localhost:5500/api/auth/user-details",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      ).catch((err) => {
        console.error("Fetch error:", err);
      });
      if (response.status === 401 || response.status === 403) {
        dispatch(clearUserDetails());
        navigte("/login");
        toast.error("Session experied, please log in again");
        return;
      }

      const userData = await response.json();
      console.log("User details fetched:", userData);
      if (userData.success) {
        dispatch(setUserDetails(userData.data));
      }
      // console.log('User details:', userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  const getCartDetails = async (logout = false) => {
    try {
      if (logout) {
        setProductInCart(0);
        return;
      }
      const response = await fetch(summaryApi.getCartDetails.url, {
        method: summaryApi.getCartDetails.method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        toast.error(`HTTP error! status: ${response.status}`);
      }

      const cartData = await response.json();
      if (cartData.success) {
        console.log("Cart details fetched:", cartData.data);
        setProductInCart(cartData.data.products.length);
      } else {
        toast.error(cartData.message);
      }

      return cartData;
    } catch (error) {
      console.log("While getting cart details product", error);
    }
  };
  const handleAddToCart = async (e, productId, quantity = 1) => {
    // This is for preventing the click of the parent
    // Bcz I have added onclick on the parent to prevent that thing I am using this
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("Product Id:", productId);
    console.log("Quantity:", quantity);

    try {
      const response = await fetch(summaryApi.addToCart.url, {
        method: summaryApi.addToCart.method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (response.status === 401 || response.status === 404)
        toast.error("Login to add item inside the cart");

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        console.log("Cart details for this user:", data.data);
        setProductInCart(data.data.products.length);
      }
      return data.currentProduct;
    } catch (error) {
      console.log("Error in handling the add to cart item:", error);
    }
  };
  useEffect(() => {
    getUserDetails();
    getCartDetails();
  }, []);
  return (
    <>
      <Context.Provider
        value={{
          getUserDetails,
          getCartDetails,
          handleAddToCart,
          productInCart,
        }}
      >
        <ToastContainer />
        <Header />
        <main className="h-[calc(100vh-7rem)] bg-gray-100 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-200">
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
}

export default App;
