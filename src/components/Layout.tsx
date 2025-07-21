import { Link, Outlet, useLocation } from 'react-router-dom';
import logoFull from "../assets/logoFull.png";
import { MenuIcon, XIcon } from 'lucide-react';
import { useState } from 'react';


export default function Layout() {
  const currentUser = false
  const [showModal, setShowModal] = useState(false);
  const pathname = useLocation().pathname;
  const showBurger = !["/register", "/login", "/join", "/customer/"].some(route => pathname.includes(route));

  const handleSignOut = () => {
    return
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="z-20 container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logoFull} className='max-h-12' />
        </Link>

        {!showBurger
          ? null
          : currentUser
            ? <button onClick={() => setShowModal(!showModal)} className='bg-primary p-2 rounded-full shadow-lg shadow-black/25'>
              <MenuIcon />
            </button>
            : <Link to="/login">
              <button className="bg-primary-sat px-6 py-1 w-full rounded-full font-semibold shadow-lg shadow-black/30">Login</button>
            </Link>
        }
      </header>

      {/* Menu Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}>
          <div className='container flex justify-end py-3 px-4'>
            <button onClick={(e) => {
              e.stopPropagation();
              setShowModal(!showModal);
            }} className='bg-primary p-1.5 rounded-full shadow-lg shadow-black/25 self-end border-2 border-white'>
              <XIcon />
            </button>
          </div>
          <div className="bg-primary border-4 border-white p-8 pt-14 rounded-[40px] shadow-lg relative max-w-sm w-[90%]">
            <div className="flex flex-col gap-5 items-center ">
              <Link to="/my-queues" className="w-full" onClick={() => setShowModal(false)}>
                <button className="w-full bg-white py-3 px-4 rounded-xl shadow-lg shadow-black/25 font-semibold text-center">
                  My Queues
                </button>
              </Link>
              <Link to="/create" className="w-full" onClick={() => setShowModal(false)}>
                <button className="w-full bg-white py-3 px-4 rounded-xl shadow-lg shadow-black/25 font-semibold text-center">
                  Create New Queue
                </button>
              </Link>
              <Link to="/analytics" className="w-full" onClick={() => setShowModal(false)}>
                <button className="w-full bg-white py-3 px-4 rounded-xl shadow-lg shadow-black/25 font-semibold text-center">
                  Analytics
                </button>
              </Link>
              <div className='flex flex-col gap-5 mt-12'>
                <button className="bg-primary-sat px-6 py-1 rounded-full font-medium shadow-lg shadow-black/30"
                  onClick={() => {
                    setShowModal(false);
                  }}>
                  Join Queue
                </button>
                {currentUser ?
                  <button
                    onClick={() => {
                      handleSignOut();
                      setShowModal(false);
                    }}
                    className="bg-white border-2 border-red-500 px-6 py-1 rounded-full font-semibold hover:bg-red-50 shadow-md mt-2"
                  >
                    Logout
                  </button>
                  :
                  <Link to="/login">
                    <button className="bg-primary-sat px-6 py-1 w-full rounded-full font-semibold shadow-lg shadow-black/30">Login</button>
                  </Link>
                }
              </div>
            </div>
          </div>
        </div>
      )}

      <Outlet />
    </div>
  );
}
