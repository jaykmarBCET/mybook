import React, { useCallback, useState } from 'react';
import useUserStore from '../../store/user/User.api';
import usePostStore from '../../store/posts/Post.api';
import {BeatLoader} from 'react-spinners'
import { Navigate } from 'react-router';

function PostPage() {
  const [isAI, setIsAI] = useState(false);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center bg-gray-50">
      <div className="mb-6">
        <button
          onClick={() => setIsAI(!isAI)}
          className="bg-indigo-600 text-white py-2 px-6 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          {isAI ? 'Upload Manually' : 'Generate with AI'}
        </button>
      </div>
      <div className="w-full max-w-2xl">
        {isAI ? <GeneratePost /> : <PostFile />}
      </div>
    </div>
  );
}

export default PostPage;

function PostFile() {
  const [data, setData] = useState({
    title: '',
    description: '',
    post: null,
  });

  const { user } = useUserStore();
  const { addSinglePostImage, addSingleVideo,isLoading } = usePostStore();
  const [isVideo, setIsVideo] = useState(false);

  const changeHandler = (e) => {
    const { name, value, files } = e.target;
    if (name === 'post') {
      if (files[0]?.type === 'video/mp4') {
        setIsVideo(true);
      }
      setData(prev => ({
        ...prev,
        post: files[0],
      }));
    } else {
      setData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handelSubmit = useCallback(async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("post", data.post);
    isVideo ? await addSingleVideo(formData) : await addSinglePostImage(formData);
  }, [data, isVideo, addSinglePostImage, addSingleVideo]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="rounded-xl shadow-lg bg-white px-6 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Create a Post</h2>
      <form onSubmit={handelSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={data.title}
          onChange={changeHandler}
          placeholder="Title"
          className="p-3 rounded-md border border-gray-300"
        />
        <textarea
          name="description"
          value={data.description}
          onChange={changeHandler}
          placeholder="Description"
          className="p-3 rounded-md border border-gray-300"
        />
        <input
          type="file"
          name="post"
          id="post"
          onChange={changeHandler}
          className="hidden"
        />
        <label
          htmlFor="post"
          className="bg-blue-500 text-white py-2 px-4 rounded-xl text-center cursor-pointer hover:bg-blue-600 transition"
        >
          {data.post ? data.post.name : "Upload File"}
        </label>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition"
        >
          {isLoading?<BeatLoader/>:"Create Post"}
        </button>
      </form>
    </div>
  );
}

function GeneratePost() {
  const [data, setData] = useState({
    title: '',
    description: '',
    width: '',
    height: '',
    prompt: '',
    model: '',
  });

  const {generateImage,isLoading} = usePostStore()

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = useCallback((e) => {
    e.preventDefault();
     generateImage(data)
     setData({
      model:"flux",
      prompt:"",
      title:"",
      description:""
     })
  }, [data,generateImage]);

  return (
    <div className="rounded-xl shadow-lg bg-white px-6 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Generate Post with AI</h2>
      <form onSubmit={handleGenerate} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={data.title}
          onChange={changeHandler}
          placeholder="Title"
          className="p-3 rounded-md border border-gray-300"
        />
        <textarea
          name="description"
          value={data.description}
          onChange={changeHandler}
          placeholder="Description"
          className="p-3 rounded-md border border-gray-300"
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            name="width"
            value={data.width}
            onChange={changeHandler}
            placeholder="Width"
            className="p-3 rounded-md border border-gray-300 w-full"
          />
          <input
            type="text"
            name="height"
            value={data.height}
            onChange={changeHandler}
            placeholder="Height"
            className="p-3 rounded-md border border-gray-300 w-full"
          />
        </div>
        <select className='outline-0 border p-3 border-gray-300 w-full' name="model" onChange={changeHandler} id="">
          <option value="flux">FLUX</option>
          <option value="turbo">TURBO</option>
        </select>
        <textarea
          name="prompt"
          value={data.prompt}
          onChange={changeHandler}
          placeholder="Prompt"
          className="p-3 rounded-md border border-gray-300"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition"
        >
          {isLoading?<BeatLoader size={80}/>:"Generate Post"}
        </button>
      </form>
    </div>
  );
}
