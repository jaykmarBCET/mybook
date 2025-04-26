import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useFriendStore from '../../store/friends/friends.api';

function RequestCard({ request }) {
  const { addFriend, users, getUserInfo } = useFriendStore();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      await getUserInfo(request.requestedBy);
      const foundUser = users.find((u) => u.id === request.requestedBy);
      setUser(foundUser);
    };
    fetchUser();
  }, [getUserInfo, request.requestedBy, users]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex min-w-72 mx-6 mt-2 border pb-3 border-blue-300 px-3 justify-center rounded-2xl shadow-lg flex-col">
      <div className="flex justify-center gap-3 px-8 py-2 rounded-xl items-center">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={user.avatar || '/default-avatar.png'}
          alt={`${user.name}'s avatar`}
        />
        <h1 className="text-xl font-semibold">{user.name}</h1>
      </div>
      <div className="flex gap-2 justify-center mt-2">
        <button
          onClick={() => addFriend(request.requestedBy)}
          className="btn w-28 rounded-xl shadow-lg hover:bg-blue-500 cursor-pointer px-3 py-1 text-sm bg-blue-400"
        >
          Accept
        </button>
        <Link
          to={`/profile/${request.requestedBy}`}
          className="btn w-28 rounded-xl shadow-lg hover:bg-blue-500 cursor-pointer px-3 py-1 text-sm bg-blue-400 text-center"
        >
          Profile
        </Link>
      </div>
    </div>
  );
}

export default RequestCard;
