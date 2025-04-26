import React, { useCallback, useEffect, useState } from 'react';
import useUserStore from '../../store/user/User.api';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const navigator = useNavigate();
  const { user, updateUser } = useUserStore();
  const [data, setData] = useState({
    name: '',
    dob: '',
    bio: '',
    coverImage: null,
    avatar: null,
  });

  useEffect(() => {
    if (!user) {
      navigator('/login');
    } else {
      setData({
        name: user.name || '',
        dob: user.dob || '',
        bio: user.bio || '',
        coverImage: null,
        avatar: null,
      });
    }
  }, [user, navigator]);

  const changeHandler = useCallback((e) => {
    const { name, value, files, type } = e.target;

    if (type === 'file') {
      setData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  const handelSubmit = useCallback(async () => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('dob', data.dob);
    formData.append('bio', data.bio);

    if (data.coverImage) {
      formData.append('coverImage', data.coverImage);
    }

    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }

    await updateUser(formData);
  }, [data, updateUser]);

  return (
    <div className="w-full flex flex-col border min-h-screen bg-gray-50">
      {/* Cover Image & Avatar */}
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src={
            user?.coverImage ||
            'https://t3.ftcdn.net/jpg/08/75/76/00/360_F_875760029_1m8KXDYOQe9HgliqdLaFW2BGe7Po0GaZ.jpg'
          }
          alt="cover"
        />
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <img
            className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
            src={
              user?.avatar ||
              'https://images.squarespace-cdn.com/content/v1/61c4da8eb1b30a201b9669f2/d102db69-5dea-482a-a7d5-8ac38ec3e706/avatar3.jpg'
            }
            alt="avatar"
          />
          <p className="text-xl font-bold mt-2">{user?.name}</p>
        </div>
      </div>

      <div className="h-16"></div>

      {/* Form Section */}
      <div className="max-w-2xl w-full mx-auto p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handelSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={changeHandler}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={Date(data.dob)}
              
              onChange={changeHandler}
              
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Avatar</label>
            <input
              type="file"
              name="avatar"
              onChange={changeHandler}
              className="w-full text-sm"
              accept="image/*"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Cover Image</label>
            <input
              type="file"
              name="coverImage"
              onChange={changeHandler}
              className="w-full text-sm"
              accept="image/*"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Bio</label>
            <textarea
              name="bio"
              value={data.bio}
              onChange={changeHandler}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="4"
              placeholder="Write a short bio..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
