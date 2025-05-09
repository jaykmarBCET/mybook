import React, { useMemo, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import PostPage from './pages/PostPage';
import Sidebar, { sidebarData } from './components/Sidebar';
import UserProfile from './pages/UserProfile';
import ChatsPage from './pages/ChatsPage';
import FriendPage from './pages/FriendPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EmailVerify from './components/EmailVerify';
import GenerateToken from './components/GenerateToken';
import './tailwind.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import useUserStore from '../store/user/User.api';

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/home' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/posts' element={<PostPage />} />
      <Route path='/dashboard/chats' element={<ChatsPage />} />
      <Route path='/profile/:id' element={<UserProfile />} />
      <Route path='/friends' element={<FriendPage />} />
      <Route path='/reset-my-password' element={<ResetPasswordPage/>}/>
      <Route path='/email/verify' element={<EmailVerify/>}/>
      <Route path='/generate/email/token' element={<GenerateToken/>}/>
      <Route path='*' element={<NotFound />} />

    </Routes>
  );
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserStore();

  const filteredSidebarData = useMemo(() => {
    if (user) {
      return sidebarData.filter(item => item.name !== 'Login' && item.name !== 'Register');
    } else {
      return sidebarData.filter(item => item.name === 'Login' || item.name === 'Register');
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div className={`flex relative w-screen min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient bg-[length:200%_200%]`}>
        {isOpen ? (
          <Sidebar isOpen={setIsOpen} />
        ) : (
          <div className='flex flex-col items-center transition-all duration-900 bg-white p-2'>
            <FontAwesomeIcon
              icon={faBars}
              className="text-2xl m-4 mb-10 cursor-pointer"
              onClick={() => setIsOpen(true)}
            />
            {filteredSidebarData.map((navItem, idx) => (
              <div className='my-2 flex flex-col items-center' key={idx}>
                <Link to={navItem.path}>
                  <FontAwesomeIcon className='text-xl text-blue-400' icon={navItem.icon} />
                  <p className='text-[8px] text-center'>{navItem.name}</p>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 flex-col justify-center items-center min-h-screen">
          <AppRoutes />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
