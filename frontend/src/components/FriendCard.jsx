import React from 'react'
import useFriendStore from '../../store/friends/friends.api'

function FriendCard({ user }) {
  const { sendRequest } = useFriendStore()

  return (
    <div className="w-72 bg-white border border-blue-200 rounded-2xl shadow-lg p-4 mx-4 my-3 transition-transform hover:scale-[1.02]">
      <div className="flex items-center gap-4 mb-4">
        <img
          className="w-12 h-12 rounded-full object-cover border border-blue-400"
          src={user?.avatar || '/default-avatar.png'}
          alt="avatar"
        />
        <h2 className="text-lg font-semibold text-gray-800 capitalize">{user?.name}</h2>
      </div>
      <button
        onClick={() => sendRequest(user.id)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-medium transition-all shadow-md"
      >
        Send Friend Request
      </button>
    </div>
  )
}

export default FriendCard
