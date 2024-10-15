import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {MdAccountCircle, MdClose, MdMenu} from 'react-icons/md';
import {signOut, useSession} from 'next-auth/react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    console.log('Logging out...');
    setIsAccountMenuOpen(false);
    setIsMobileMenuOpen(false);
    signOut({ redirect: false }).then(() => {
      router.push('/authentication/login');
    });
  };

  const handleToRent = () => {
    setIsAccountMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/my-rent');
  };

  const { status } = useSession();

  return (
    <nav className='bg-white shadow-md p-4 flex justify-between items-center'>
      {/* Logo */}
      <div className='text-xl font-bold cursor-pointer' onClick={() => router.push('/')}>Siper</div>

      {/* Desktop Menu */}
      <div className='hidden md:flex items-center space-x-4'>
        <div className='relative'>
          <MdAccountCircle
            size={24}
            className='cursor-pointer'
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
          />
          {isAccountMenuOpen && (
            <div className='absolute right-0 mt-2 z-20 w-48 bg-white border rounded shadow-lg'>
              {status === 'loading' && (
                <p className='text-sm'>Loading...</p>
              )}
              {status === 'unauthenticated' && (
                <button
                  onClick={() => router.push('/authentication/login')}
                  className='block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left'
                >
                  Login
                </button>
              )}
              {status === 'authenticated' && (
                <>
                  <button
                    onClick={() => handleToRent()}
                    className='block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left'
                  >
                    Your Rent
                  </button>
                  <button
                    onClick={handleLogout}
                    className='block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left'
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className='md:hidden z-30'>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <MdClose size={24}/> : <MdMenu size={24}/>}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-end'>
          <div className='w-64 bg-white px-4 py-8'>
            <button
              onClick={handleLogout}
              className='block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left'
            >
              Your Rents
            </button>
            <button
              onClick={handleLogout}
              className='block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left'
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
