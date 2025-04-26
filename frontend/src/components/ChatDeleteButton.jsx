import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import useChatsStore from '../../store/chats/chats.api';

function ChatDeleteButton({ className = '', chat, close }) {
  const [toggle, setToggle] = useState('');

  const isEditing = toggle === 'edit' || toggle === 'delete';
  const zIndexClass = isEditing ? 'z-50' : 'z-10';

  return (
    <div
      className={`absolute right-0 top-2 p-1 rounded-md bg-white shadow-md text-xs ${zIndexClass} ${className}`}
    >
      <div className="flex items-center justify-between gap-1">
        <select
          onChange={(e) => setToggle(e.target.value)}
          className="p-1 border border-gray-300 rounded text-xs text-gray-700"
          defaultValue=""
        >
          <option value="">Select</option>
          <option value="edit">Edit</option>
          <option value="delete">Delete</option>
        </select>
        <button
          onClick={() => close(false)}
          className="text-red-500 hover:text-red-600 p-1"
        >
          <FontAwesomeIcon icon={faClose} className="h-3 w-3" />
        </button>
      </div>

      {toggle === 'edit' && <Edit chat={chat} />}
      {toggle === 'delete' && <DeleteChats chat={chat} />}
    </div>
  );
}

function DeleteChats({ chat }) {
  const { deleteChat, isLoading } = useChatsStore();

  const handleDelete = async () => {
    await deleteChat(chat.id);
  };

  return (
    <div className="bg-red-50 p-1 mt-1 rounded text-center text-xs">
      <p className="mb-1 text-red-600">Delete?</p>
      <button
        onClick={handleDelete}
        className={`px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Deleting...' : 'Yes'}
      </button>
    </div>
  );
}

function Edit({ chat }) {
  const [message, setMessage] = useState(chat.description);
  const { updateChats, isLoading } = useChatsStore();

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateChats({ chatId: chat.id, description: message });
  };

  return (
    <form onSubmit={handleUpdate} className="mt-1 space-y-1 text-xs">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-1 border border-gray-300 rounded text-xs"
        rows="2"
        disabled={isLoading}
      />
      <button
        type="submit"
        className={`px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Updating...' : 'Update'}
      </button>
    </form>
  );
}

export default ChatDeleteButton;
