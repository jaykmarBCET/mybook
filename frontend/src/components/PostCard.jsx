// PostCard.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComment, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import useRowStore from '../../store/rowapi/row.api';
import usePostStore from '../../store/posts/Post.api';
import Days from 'dayjs';
import { Link } from 'react-router-dom';
import useComments from '../../store/comments/comments.api';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import useUserStore from '../../store/user/User.api'
import UpdatePostCard from './UpdatePostCard';

const PostCard = ({ post }) => {
  const { users, getUserInfoByUser } = useRowStore();
  const { addLikes, addDislike, getLikeAndDislikes } = usePostStore();
  const { getComments, comments } = useComments();

  const [userInfo, setUserInfo] = useState({ name: '', id: '', avatar: '' });
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [isOpenComments, setIsOpenComments] = useState(false);
  const [countComments, setCountComments] = useState(0);
  const [isUpdate,setIsUpdate] = useState(false)
  const { user } = useUserStore()

  const createdAt = useMemo(() => Days(post.createdAt).format('DD/MM/YYYY'), [post.createdAt]);

  const parsedImage = useMemo(() => {
    try {
      return post.images?.[0] ? JSON.parse(post.images[0])?.url : null;
    } catch {
      return null;
    }
  }, [post.images]);

  const parsedVideo = useMemo(() => {
    try {
      return post.videos?.[0] ? JSON.parse(post.videos[0])?.url : null;
    } catch {
      return null;
    }
  }, [post.videos]);


  const fetchLikesAndDislikes = useCallback(async () => {
    const result = await getLikeAndDislikes(post.id);
    setLikes(result.likes || 0);
    setDislikes(result.dislikes || 0);
  }, [getLikeAndDislikes, post.id]);

  const handleLike = useCallback(async () => {
    await addLikes(post.id);
    setUserLiked(true);
    setUserDisliked(false);
    fetchLikesAndDislikes();
  }, [addLikes, post.id, fetchLikesAndDislikes]);

  const handleDislike = useCallback(async () => {
    await addDislike(post.id);
    setUserLiked(false);
    setUserDisliked(true);
    fetchLikesAndDislikes();
  }, [addDislike, post.id, fetchLikesAndDislikes]);

  useEffect(() => {
    const fetchUser = async () => {
      await getUserInfoByUser({ id: post.postedBy });
    };
    fetchUser();
  }, [getUserInfoByUser, post.postedBy]);

  useEffect(() => {
    const foundUser = users?.find((user) => user.id === post.postedBy);
    if (foundUser) {
      setUserInfo(foundUser);
    }
  }, [users, post.postedBy]);

  useEffect(() => {
    fetchLikesAndDislikes();
  }, [fetchLikesAndDislikes]);

  useEffect(() => {
    getComments(post.id);
  }, [getComments, post.id]);

  useEffect(() => {
    const filtered = comments?.filter((item) => item.postId === post.id);
    setCountComments(filtered?.length || 0);
  }, [comments, post.id]);

  const cardRef = useRef();
  useGSAP(() => {
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: 'power2.out',
    });
  }, { scope: cardRef });

  return (
    <div ref={cardRef} className="flex justify-center w-full max-w-sm p-3">
      <div className="w-full bg-white rounded-xl shadow-md p-4 space-y-4 transition hover:shadow-lg hover:scale-[1.02] duration-300">
        <div className='flex justify-between'>
          <Link to={`/profile/${post.postedBy}`} className="flex items-center space-x-4">
            <img
              className="w-10 h-10 rounded-full border-2 border-gray-300"
              src={userInfo.avatar || 'https://via.placeholder.com/40'}
              alt={`${userInfo.name}'s avatar`}
            />
            <div>
              <h1 className="text-lg font-semibold text-gray-800">{userInfo.name}</h1>
              <p className="text-sm text-gray-500">{createdAt}</p>
            </div>

          </Link>
          {

            user.id===post.postedBy?<div className='border border-gray-300  rounded-full  flex items-center'>
              
                 <FontAwesomeIcon onClick={()=>setIsUpdate((prev)=>!prev)} className='text-2xl py-1 px-5 cursor-pointer text-gray-400' icon={faEllipsisV} />
            </div>:""
          }

        </div>
          {isUpdate&&<UpdatePostCard close={setIsUpdate} post={post}/>}

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h2>
          {parsedImage && (
            <img className="rounded-lg shadow-sm max-h-44 object-cover  w-full" src={parsedImage} alt="Post visual" />
          )}
          {parsedVideo && (
            <video className="rounded-lg shadow-sm w-full" controls src={parsedVideo} />
          )}
          <p className="text-gray-700 text-sm">{post.description}</p>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between text-sm text-gray-600">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 hover:text-blue-500 ${userLiked ? 'text-blue-500' : ''}`}
              aria-label="Like post"
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>{likes}</span>
            </button>

            <button
              onClick={handleDislike}
              className={`flex items-center gap-1 hover:text-red-500 ${userDisliked ? 'text-red-500' : ''}`}
              aria-label="Dislike post"
            >
              <FontAwesomeIcon icon={faThumbsDown} />
              <span>{dislikes}</span>
            </button>

            <button
              onClick={() => setIsOpenComments(!isOpenComments)}
              className="flex items-center gap-1 hover:text-gray-800"
              aria-label="Toggle comments"
            >
              <FontAwesomeIcon icon={faComment} />
              <span>{countComments} Comment{countComments !== 1 ? 's' : ''}</span>
            </button>
          </div>

          {isOpenComments && <CommentComponents postId={post.id} />}
        </div>
      </div>
    </div>
  );
};

function CommentComponents({ postId }) {
  const [description, setDescription] = useState('');
  const { addComment, comments, getComments } = useComments();
  const [showComments, setShowComments] = useState([]);

  const scrollRef = useRef();

  const handleSubmit = useCallback(async () => {
    if (!description.trim()) return;
    await addComment({ description, postId });
    setDescription('');
    await getComments(postId);
  }, [addComment, description, postId, getComments]);

  useEffect(() => {
    getComments(postId);
  }, [getComments, postId]);

  useEffect(() => {
    if (comments?.length > 0) {
      setShowComments(comments.filter((item) => item.postId === postId));
    }
  }, [comments, postId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [showComments]);

  return (
    <div className="mt-4 space-y-2">
      <div ref={scrollRef} className="max-h-28 overflow-auto pr-1 space-y-2">
        {showComments.map((item, idx) => (
          <div key={item.id || idx} className="bg-gray-100 rounded-md p-2 text-sm shadow">
            <p>{item.description}</p>
            <p className="text-[10px] text-gray-500 mt-1">{Days(item.createdAt).format('DD/MM/YYYY')}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center mt-2">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-lg outline-none"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-r-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default PostCard;
