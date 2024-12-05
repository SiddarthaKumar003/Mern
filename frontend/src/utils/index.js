const backendUrl = "http://localhost:5500";
const cloudunaryName = import.meta.env.VITE_CLOUDINARY_NAME;

const summaryApi = {
  signUp: {
    url: `${backendUrl}/api/auth/register`,
    method: "POST",
  },
  login: {
    url: `${backendUrl}/api/auth/login`,
    method: "POST",
  },
  logout: {
    url: `${backendUrl}/api/auth/logout`,
    method: "POST",
  },
  getAllUsers: {
    url: `${backendUrl}/api/auth/all-users-details`,
    method: "GET",
  },
  updateUser: {
    url: `${backendUrl}/api/auth/update-user-details`,
    method: "POST",
  },
  uploadImage: {
    url: `https://api.cloudinary.com/v1_1/${cloudunaryName}/image/upload`,
    method: "POST",
  },
  uploadProduct: {
    url: `${backendUrl}/api/auth/upload-product`,
    method: "POST",
  },
  getAllProducts: {
    url: `${backendUrl}/api/auth/get-products`,
    method: "GET",
  },
  updateProduct: {
    url: `${backendUrl}/api/auth/update-product`,
    method: "POST",
  },
  catagoryWiseProduct: {
    url: `${backendUrl}/api/auth/catagorywise-product`,
    method: "GET",
  },
  catagoryWiseProducts: {
    url: `${backendUrl}/api/auth/catagorywise-products`,
    method: "PUT",
  },
  getProductDetails: {
    url: `${backendUrl}/api/auth/productdetails`,
    method: "PUT",
  },
  getSearchedItems: {
    url: `${backendUrl}/api/auth/search`,
    method: "GET",
  },
  getFilteredItems: {
    url: `${backendUrl}/api/auth/get-filtered-products`,
    method: "GET",
  },
  addToCart: {
    url: `${backendUrl}/api/auth/add-to-cart`,
    method: "POST",
  },
  removeFromCart: {
    url: `${backendUrl}/api/auth/remove-cart-item`,
    method: "POST",
  },
  getCartDetails: {
    url: `${backendUrl}/api/auth/get-cart-details`,
    method: "GET",
  },
  toggleSelectedCart: {
    url: `${backendUrl}/api/auth/toggle-selected-cart`,
    method: "PUT",
  },
  initiatePayment: {
    url: `${backendUrl}/api/auth/initiate-payment`,
    method: "POST",
  },
  verifyPayment: {
    url: `${backendUrl}/api/auth/verify-payment`,
    method: "POST",
  },
};

export default summaryApi;
