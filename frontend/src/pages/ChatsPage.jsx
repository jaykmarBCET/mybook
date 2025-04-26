import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faVideo, faEllipsis, faFile } from '@fortawesome/free-solid-svg-icons';
import {BounceLoader} from 'react-spinners'
import Call from '../components/Call';
import ChatDeleteButton from '../components/ChatDeleteButton';

import useUserStore from '../../store/user/User.api';
import useFriendStore from '../../store/friends/friends.api';
import useChatStore from '../../store/chats/chats.api';

function ChatsPage() {
  const { user, onlineUsers } = useUserStore();
  const { friends, getAllFriends, users, getUserInfo, } = useFriendStore();
  const {
    selectedUser,
    setSelectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    getChats,
    sendChat,
    chats,isLoading
  } = useChatStore();

  const [messageInput, setMessageInput] = useState('');
  const [file, setFile] = useState(null);
  const scrollView = useRef(null);
  const [call, setCall] = useState(false);
  const [openDeleteFor, setOpenDeleteFor] = useState(null);

  const handleFriends = useCallback(() => {
    friends?.forEach((f) => {
      const id = f.userId === user?.id ? f.friendBy : f.userId;
      if (!users.find((item) => item.id === id)) {
        getUserInfo(id);
      }
    });
  }, [friends, user, getUserInfo, users]);

  const handleChats = useCallback(() => {
    if (!messageInput.trim() && !file) return;
    if (!selectedUser?.id) return;

    const formData = new FormData();
    formData.append('description', messageInput);
    if (file) {
      formData.append('file', file);
    }

    sendChat(formData);
    setMessageInput('');
    setFile(null);
  }, [messageInput, selectedUser, sendChat, file]);

  useEffect(() => {
    getAllFriends();
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [getAllFriends, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    handleFriends();
  }, [handleFriends]);

  useEffect(() => {
    if (selectedUser?.id) getChats();
  }, [selectedUser, getChats]);

  useEffect(() => {
    setTimeout(() => {
      scrollView.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [chats]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="w-full flex border border-gray-300 h-screen">
      {/* Sidebar */}
      <div className="min-w-56 max-w-72 m-2 bg-gray-100 rounded-xl border border-gray-400 h-[98vh] overflow-hidden">
        <div className="flex mx-2 mt-1 bg-blue-300 shadow-xl gap-2 rounded-xl uppercase">
          <img
            className="w-10 h-10 rounded-full my-3 mx-2"
            src={user?.avatar || '/default-avatar.png'}
            alt="User Avatar"
          />
          <div className="my-2">
            <h1 className="font-bold">{user?.name}</h1>
            <h1 className="text-sm">
              {user?.createdAt ? dayjs(user.createdAt).format('DD/MM/YYYY') : ''}
            </h1>
          </div>
          <Link to="/profile">
            <FontAwesomeIcon className="text-2xl my-4" icon={faUser} />
          </Link>
        </div>

        {/* Friend List */}
        <div className="p-2 overflow-y-auto h-[85%]">
          {Array.isArray(users) && users.length > 0 ? (
            users.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedUser(item)}
                className={`my-1 flex gap-3 text-sm shadow rounded p-2 cursor-pointer ${
                  selectedUser?.id === item.id
                    ? 'bg-blue-300'
                    : 'bg-blue-100 hover:bg-blue-500 transition-all duration-300'
                }`}
              >
                <img className="w-8 h-8 rounded-full" src={item.avatar} alt="" />
                <div>
                  <h4 className="px-2 py-1">{item.name}</h4>
                  <h6
                    className={
                      onlineUsers && onlineUsers.includes(item.id)
                        ? 'bg-green-500 text-white rounded-xl px-[5px] py-[3px] text-[10px]'
                        : 'bg-red-400 text-white rounded-xl px-[5px] py-[3px] text-[10px]'
                    }
                  >
                    {onlineUsers && onlineUsers.includes(item.id) ? 'Online' : 'Offline'}
                  </h6>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 mt-4">No chats yet</div>
          )}
        </div>
      </div>

      {/* Chat Box */}
      <div className="flex flex-col justify-between w-full h-[98vh] m-2 rounded-xl border border-gray-400 bg-gray-100">
        {/* Header */}
        <header className="border border-gray-400 flex justify-between items-center rounded-xl shadow-2xl gap-x-3 mx-4 mt-2 px-4 py-2 h-16 bg-white">
          {selectedUser?.name ? (
            <>
              <div className="flex gap-2">
                <img
                  className="w-12 h-12 rounded-full"
                  src={selectedUser?.avatar || '/default-avatar.png'}
                  alt="Selected User Avatar"
                />
                <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setCall(!call)}>
                  <FontAwesomeIcon className="w-8 border border-gray-400 px-1 py-3 rounded-full" icon={faPhone} />
                </button>
                <button onClick={() => setCall(!call)}>
                  <FontAwesomeIcon className="w-8 border border-gray-400 px-1 py-3 rounded-full" icon={faVideo} />
                </button>
              </div>
            </>
          ) : (
            <h2 className="text-gray-400">Select a user to start chatting</h2>
          )}
        </header>

        {/* Chat Messages */}
        <main className="flex-1 gap-2 flex-col overflow-y-auto px-4 py-2 space-y-2">
          {call && <Call selectedUser={selectedUser} isClose={setCall} />}
          {!call &&
            chats.length > 0 &&
            chats.map((chat, idx) => (
              <div
                key={chat.id || idx}
                ref={idx === chats.length - 1 ? scrollView : null}
                className={`w-full bg-white relative rounded-xl px-2 py-1 flex my-2 ${
                  chat.chatSender !== user.id ? 'float-left' : 'float-right'
                } border border-gray-400`}
              >
                <img
                  className="w-[30px] absolute object-cover border border-gray-400 -left-1 h-[30px] top-0 rounded-full"
                  src={chat.chatSender === user.id ? user.avatar : selectedUser.avatar}
                  alt=""
                />
                <div className="ml-8">
                  <p className="font-light text-sm">{chat.description}</p>
                  {
                    chat.file&&<img className='object-cover w-96 ' src={chat.file} alt="" />
                  }
                  
                </div>
                <div>
                  {openDeleteFor === chat.id ? (
                    <ChatDeleteButton close={() => setOpenDeleteFor(null)} chat={chat} />
                  ) : (
                    <button
                      onClick={() => setOpenDeleteFor(chat.id)}
                      className="absolute right-0 px-2 py-1 rounded-full text-gray-400 hover:text-gray-500 top-0"
                    >
                      <FontAwesomeIcon className="text-xl" icon={faEllipsis} />
                    </button>
                  )}
                </div>
              </div>
            ))}
        </main>

        
        <div className="p-3 border-t border-gray-400 bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-400 rounded-xl outline-none"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChats()}
          />
         
          <label
            htmlFor="file"
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all cursor-pointer"
          >
            <FontAwesomeIcon icon={faFile} />
          </label>
          <input
            type="file"
            id="file"
            name="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          
          <button
            onClick={handleChats}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
          >
            {isLoading?<BounceLoader size={20}/>:"Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatsPage;
