import React, { useContext, useEffect, useState } from 'react'
import Logo from './Logo'
import { GrSearch } from 'react-icons/gr'
import { CgProfile } from "react-icons/cg";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import summaryApi from '../utils';
import { clearUserDetails } from '../redux/userSlice';
import ROLE from '../utils/role';
import Context from '../context';

function Header() {
  const user = useSelector((state) => state.user?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const { productInCart, getCartDetails } = useContext(Context)
  const [searchText, setSearchText] = useState('')
  const location = useLocation()
  const doLogout = async () => {
    try {
      const response = await fetch(summaryApi.logout.url, {
        method: summaryApi.logout.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        toast.error("Bad network request")
      }

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        getCartDetails(true);
        dispatch(clearUserDetails());
        navigate("/");
      }

      if (result.error) toast.error(result.message)

    } catch (error) {
      toast(error)
    }
  }

  // set the search text if anything exists into the url
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    if(query==null) setSearchText('');
    else setSearchText(query)
  }, [location.search])

  // handle the search activity
  const handleSearch = (e) => {
    const { value } = e.target;
    if (value.trim())
      navigate(`/search?query=${value}`)
    else if (value == "")
      navigate("/")
    else
      navigate(`/search`)
  }
  return (
    <header className='h-16 shadow-md bg-white w-full z-40 border'>
      <div className=' h-full container mx-auto flex items-center px-4 justify-between'>
        <div className=''>
          <Link to={"/"}>
            <Logo width={90} height={50} />
          </Link>
        </div>

        <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
          <input type='text' placeholder='search product here...' className='w-full outline-none' value={searchText} onChange={(e) => handleSearch(e)} />
          <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white'>
            <GrSearch />
          </div>
        </div>


        <div className='flex items-center gap-7'>
          {/* This is the profile section */}
          {user?._id && (
            <div className="cursor-pointer text-3xl" onClick={() => setMenuDisplay(prev => !prev)}>
              {
                user?.profileImage ? <img className='w-10 h-10 rounded-full' src={user.profileImage} /> : <CgProfile />
              }
            </div>
          )}
          {
            menuDisplay && (
              <div className='absolute z-10 bg-white bottom-0 top-16 h-fit p-2 shadow-lg rounded' >
                <nav>
                  {
                    user?.role === ROLE.ADMIN && (
                      <Link to={"/admin-panel"} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={() => setMenuDisplay(preve => !preve)}>Admin Panel</Link>
                    )
                  }
                  <Link to={"/update-profile"} className='whitespace-nowrap hidden md:block hover:bg-slate-100 p-2' onClick={() => setMenuDisplay(preve => !preve)}>
                    Update Profile
                  </Link>
                </nav>
              </div>
            )
          }
          {/* This is add to cart section */}
          <Link to={"/view-cart"} className="cursor-pointer text-3xl relative">
            <span><FaShoppingCart /></span>
            <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-4'>
              <p className='text-sm'>{productInCart}</p>
            </div>
          </Link>

          <div>
            {
              user ?
                (<button className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700' onClick={doLogout}>Logout</button>) :
                (<Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Login</Link>)
            }
          </div>
        </div>

      </div>
    </header>
  )
}

export default Header