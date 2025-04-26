import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom'; 
import useUserStore from '../../store/user/User.api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUserFriends,
  faComments,
  faSignInAlt,
  faUserPlus,
  faFileAlt,
  faUser,
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';

export const sidebarData = [
  { name: 'Home', path: '/', icon: faHome },
  { name: 'New Posts', path: '/posts', icon: faFileAlt },
  { name: 'Friends', path: '/friends', icon: faUserFriends },
  { name: 'Messages', path: '/dashboard/chats', icon: faComments },
  { name: 'Login', path: '/login', icon: faSignInAlt },
  { name: 'Register', path: '/register', icon: faUserPlus },
  { name: 'Profile', path: '/profile', icon: faUser }
];

const Sidebar = ({ isOpen }) => {
  const { user, logout } = useUserStore();
  const isLoggedIn = user?.email?.trim();

  const handlerLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  
  const filteredSidebarData = useMemo(() => {
    if (isLoggedIn) {
      return sidebarData.filter(item => item.name !== 'Login' && item.name !== 'Register');
    } else {
      return sidebarData.filter(item => item.name === 'Login' || item.name === 'Register');
    }
  }, [isLoggedIn]);

  return (
    <div onClick={() => isOpen(false)} className='sm:w-64 relative flex flex-col min-h-screen md:w-64 w-96 bg-gray-100 p-4 transition-all duration-400 delay-300'>
      <div className='mb-4 text-center'>
        <img
          src={user?.avatar ? user.avatar : 'defaultLogo.jpg'}
          className='w-20 h-20 rounded-2xl shadow-2xl mx-auto'
          alt="User Avatar"
        />
        <h2 className='text-xl font-semibold mt-2'>
          {user?.name ? user.name : 'Your Name'}
        </h2>
      </div>

      <div className='flex flex-col gap-3'>
        {filteredSidebarData.map((item, idx) => (
          <Link
            className='flex items-center gap-2 px-4 py-2 shadow-2xl bg-blue-400 hover:bg-blue-500 text-white rounded transition-all'
            to={item.path}
            key={idx}
          >
            <FontAwesomeIcon icon={item.icon} />
            {item.name}
          </Link>
        ))}

        {isLoggedIn && (
          <button onClick={handlerLogout} className='flex items-center gap-2 px-4 py-2 shadow-2xl bg-blue-400 hover:bg-blue-500 text-white rounded transition-all'>
            <FontAwesomeIcon icon={faRightFromBracket} /> Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
