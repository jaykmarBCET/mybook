import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import usePostStore from '../../store/posts/Post.api';

function UpdatePostCard({ post, close }) {
  const [data, setData] = useState({
    title: post.title,
    description: post.description,
    file: null,
    fileType: '',
  });

  const {
    updateImage,
    updateTitleAndDescription,
    updateVideo,
    deletePost,
    isLoading,
  } = usePostStore();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'file') {
      const file = files[0];
      const fileType = file?.type.startsWith('image')
        ? 'image'
        : file?.type.startsWith('video')
        ? 'video'
        : '';
      setData((prev) => ({
        ...prev,
        file,
        fileType,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);

      const hasFile = data.file !== null;
      const titleChanged = data.title !== post.title;
      const descChanged = data.description !== post.description;

      if (hasFile) {
        formData.append('post', data.file);
        const publicId =
          data.fileType === 'image'
            ? JSON.parse(post?.images?.[0] || '{}')?.publicId
            : JSON.parse(post?.videos?.[0] || '{}')?.publicId;

        if (data.fileType === 'image') {
          await updateImage(formData, { postId: post.id, publicId });
        } else {
          await updateVideo(formData, { postId: post.id, publicId });
        }
      }

      if (titleChanged || descChanged) {
        await updateTitleAndDescription(data, { postId: post.id });
      }

      close(false); // Close modal after update
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost({ postId: post.id });
      close(false); // Close modal after deletion
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Post</h2>
          <button
            onClick={() => close(false)}
            className="text-gray-600 hover:text-red-500"
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={data.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Post Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              placeholder="Post Description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Media (Image/Video)</label>
            <input
              type="file"
              name="file"
              accept="image/*,video/*"
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`${
                isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              } text-white px-4 py-2 rounded-md font-medium`}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
            <button
              onClick={handleDelete}
              type="button"
              disabled={isLoading}
              className={`${
                isLoading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
              } text-white px-4 py-2 rounded-md font-medium`}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
            <button
              type="button"
              onClick={() => close(false)}
              disabled={isLoading}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdatePostCard;
