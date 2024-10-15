'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import {signOut, useSession} from 'next-auth/react';
import {usePathname, useRouter} from 'next/navigation';
import {IoBook, IoBookOutline, IoHome, IoLogOut, IoPerson} from 'react-icons/io5';

const Sidebar = ({
  isOpen,
  onClose,
  sidebarRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  sidebarRef: React.RefObject<HTMLDivElement>;
}) => {
  const router = useRouter();

  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ redirect: false }).then(() => {
      router.push('/internal/authentication/login');
    });
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div
      className={`lg:static lg:inset-auto fixed inset-0 z-40 flex ${
        isOpen ? 'block' : 'hidden'
      } lg:block`}
      onClick={onClose}
    >
      <div
        className='fixed md:hidden inset-0 bg-black opacity-50 lg:hidden'
        onClick={onClose}
      ></div>
      <aside
        ref={sidebarRef}
        className='relative w-64 h-full bg-gray-100 p-4 flex flex-col justify-between'
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className='text-center mb-6'>
            <h1 className='text-lg font-bold'>SIPER</h1>
          </div>
          <ul className='space-y-2'>
            <li
              className={`p-2 rounded-lg cursor-pointer flex items-center space-x-2 ${
                isActive('/internal') ? 'bg-gray-200 font-bold' : 'hover:bg-gray-200'
              }`}
              onClick={() => router.push('/internal')}
            >
              <IoHome />
              <span>Dashboard</span>
            </li>
            <li
              className={`p-2 rounded-lg cursor-pointer flex items-center space-x-2 ${
                isActive('/internal/rent') ? 'bg-gray-200 font-bold' : 'hover:bg-gray-200'
              }`}
              onClick={() => router.push('/internal/rent')}
            >
              <IoBookOutline />
              <span>Rented Book</span>
            </li>
            <li
              className={`p-2 rounded-lg cursor-pointer flex items-center space-x-2 ${
                isActive('/internal/book') ? 'bg-gray-200 font-bold' : 'hover:bg-gray-200'
              }`}
              onClick={() => router.push('/internal/book')}
            >
              <IoBook />
              <span>Books</span>
            </li>
            <li
              className={`p-2 rounded-lg cursor-pointer flex items-center space-x-2 ${
                isActive('/internal/user') ? 'bg-gray-200 font-bold' : 'hover:bg-gray-200'
              }`}
              onClick={() => router.push('/internal/user')}
            >
              <IoPerson />
              <span>User Management</span>
            </li>
          </ul>
        </div>
        <div className='mt-auto'>
          <ul className='space-y-2'>
            <li
              className='p-2 rounded-lg hover:bg-gray-200 cursor-pointer flex items-center space-x-2'
              onClick={() => handleLogout()}
            >
              <IoLogOut />
              <span>Logout</span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};


const Navbar = ({onSidebarToggle }: { onSidebarToggle: () => void }) => {
  return (
    <nav className='flex justify-between items-center bg-white p-4 border-b border-gray-200'>
      <div className='flex items-center'>
        <button
          className='mr-4 lg:hidden'
          onClick={onSidebarToggle}
        >
          <FiMenu className='text-2xl text-gray-500' />
        </button>
      </div>
    </nav>
  );
};

// Main layout component
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [offsetWidth, setOffsetWidth] = useState(0);

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const updateOffsetWidth = () => {
    if (sidebarRef.current) {
      setOffsetWidth(sidebarRef.current.clientWidth);
    }
  };

  useEffect(() => {
    // Update the offset width initially and on screen resize
    updateOffsetWidth();

    // Add resize event listener
    window.addEventListener('resize', updateOffsetWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateOffsetWidth);
    };
  }, [isSidebarOpen]);

  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/internal/authentication/login');
    }

    if (session.status === 'authenticated' && session.data?.user?.name !== 'Admin') {
      router.push('/');
    }
  }, [session]);

  return (
    <div className='flex h-screen'>
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} sidebarRef={sidebarRef} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'ml-0 lg:ml-[16rem]' : 'ml-0'
        }`}
      >
        <Navbar onSidebarToggle={handleSidebarToggle} />
        <main className='flex-1 bg-gray-50 p-4'>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
