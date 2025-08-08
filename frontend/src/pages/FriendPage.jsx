import React, { useEffect } from 'react';
import useFriendStore from '../../store/friends/friends.api';
import useUserStore from '../../store/user/User.api';
import useRowStore from '../../store/rowapi/row.api';
import { Link, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';

function FriendPage() {
  const { friends, requests, getAllFriends, getAllRequests } = useFriendStore();
  const { user } = useUserStore();
  const { users } = useRowStore(); 
  console.log(friends)
  useEffect(() => {
    getAllFriends();
    getAllRequests();
  }, [getAllFriends, getAllRequests]);

  if (!user) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div className='flex flex-wrap gap-4 justify-center py-8 px-4 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen'>
      {/* Friends Section */}
      <div className='w-80 bg-white rounded-2xl shadow-xl p-4'>
        <h1 className='text-center text-2xl font-semibold text-blue-700 mb-4'>Friends</h1>
        <div className='flex flex-col items-center gap-3'>
          {friends && friends.map((f, idx) => {
            const friendUser =
              user.id === f.userId
                ? users.find(u => u.id === f.friendBy)
                : users.find(u => u.id === f.userId);

            return friendUser ? (
              <div
                key={idx}
                className='flex items-center justify-between w-full px-4 py-3 rounded-xl bg-blue-100 hover:bg-blue-200 transition-all shadow'
              >
                <Link to={`/profile/${friendUser.id}`} className='flex items-center gap-3'>
                  <img
                    src={friendUser.avatar || '/default-avatar.png'}
                    alt='avatar'
                    className='w-10 h-10 rounded-full border border-blue-300'
                  />
                  <span className='font-medium text-gray-800'>{friendUser.name}</span>
                </Link>
                <Link to="/dashboard/chats">
                  <FontAwesomeIcon icon={faMessage} className='text-blue-600 hover:text-blue-800 text-lg' />
                </Link>
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Requests Section */}
      <div className='w-80 bg-white rounded-2xl shadow-xl p-4'>
        <h1 className='text-center text-2xl font-semibold text-yellow-600 mb-4'>Friend Requests</h1>
        <div className='flex flex-col items-center gap-3'>
          {requests && requests.map((r, idx) => {
            const requestedByUser = users.find(u => u.id === r.requestedBy);
            return requestedByUser ? (
              <Link
                key={idx}
                to={`/profile/${requestedByUser.id}`}
                className='flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-yellow-100 hover:bg-yellow-200 transition-all shadow'
              >
                <img
                  src={requestedByUser.avatar || '/default-avatar.png'}
                  alt='avatar'
                  className='w-10 h-10 rounded-full border border-yellow-300'
                />
                <span className='font-medium text-gray-800'>{requestedByUser.name}</span>
              </Link>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}

export default FriendPage;
