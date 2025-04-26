import React, { useCallback, useEffect, useRef, useState } from 'react';
import './home.css';
import SearchBar from '../components/SearchBar';
import PostCard from '../components/PostCard';
import FriendCard from '../components/FriendCard';
import RequestCard from '../components/RequestCard';
import { Link, Navigate } from 'react-router-dom';

import usePostStore from '../../store/posts/Post.api';
import useRowStore from '../../store/rowapi/row.api';
import useUserStore from '../../store/user/User.api';
import useFriendStore from '../../store/friends/friends.api';

function HomePage() {
  const { getPost, posts } = usePostStore();
  const { searchedPost, searchedUser, users } = useRowStore();
  const { user } = useUserStore();
  const { requests, getAllRequests, getAllFriends, friends } = useFriendStore();
  const [page, setPage] = useState(1);
  const [isFull, setIsFull] = useState(false);
  const [filterUser, setFilterUser] = useState([]);

  const postBoxRef = useRef();

  const handelFilter = useCallback(() => {
    const filteredUsers =
      users?.filter(
        (u) =>
          user?.id !== u.id &&
          !friends?.some((f) => f.friendBy === u.id || f.userId === u.id) &&
          !requests?.some((r) => r.requestedBy === u.id || r.requestReceiver === u.id)
      ) || [];

    setFilterUser(filteredUsers);
  }, [friends, requests, user?.id, users]);

  const fetchPosts = useCallback(async (pg) => {
    await getPost(pg);
  }, [getPost]);

  useEffect(() => {
    fetchPosts(1);
    getAllRequests();
    getAllFriends();
  }, [fetchPosts, getAllRequests, getAllFriends]);

  useEffect(() => {
    handelFilter();
  }, [handelFilter]);

  useEffect(() => {
    if (requests.length === 0 && filterUser.length === 0) {
      setIsFull(true);
    } else {
      setIsFull(false);
    }
  }, [requests, filterUser]);

  const handelScroll = async () => {
    const scrollBox = postBoxRef.current;
    const atBottom =
      scrollBox.scrollTop + scrollBox.clientHeight >= scrollBox.scrollHeight - 10;

    if (atBottom) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchPosts(nextPage);
    }
  };

  if (!user) return <Navigate to={'/login'} />;

  return (
    <div className="homepage mx-1">
      <div className={`${isFull ? 'h-screen' : 'rounded-xl mt-3 h-screen overflow-auto shadow-md bg-gray-100 px-2 py-4'}`}>
        <SearchBar />

        {(searchedUser?.length > 0 || searchedPost?.length > 0) && (
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {searchedUser?.map((item, idx) => (
              <Link
                to={`/profile/${item.id}`}
                className="flex gap-2 my-2 h-12 min-w-60 px-3 py-2 rounded-2xl shadow shadow-blue-300 justify-center bg-blue-100 hover:bg-blue-500 transition-all duration-300"
                key={idx}
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src={item.avatar || '/default-avatar.png'}
                  alt="avatar"
                />
                <h1 className="text-sm font-medium text-gray-700">{item.name}</h1>
              </Link>
            ))}
            {searchedPost?.map((item, idx) => (
              <PostCard post={item} key={idx} />
            ))}
          </div>
        )}

        <div
          ref={postBoxRef}
          onScroll={handelScroll}
          className="mt-4 h-[500px] overflow-y-auto flex flex-wrap gap-y-2 gap-x-3 justify-center items-center"
        >
          {posts && posts.length > 0 ? (
            posts.map((item, idx) => <PostCard post={item} key={idx} />)
          ) : (
            <p className="text-gray-500">No posts available</p>
          )}
        </div>
      </div>

      {/* Render requests/suggestions only when available */}
      {(requests.length > 0 || filterUser.length > 0) && (
        <div className="rounded-xl mt-2 shadow-md bg-gray-100 ml-2 p-3">
          <div className="flex flex-wrap justify-center items-start gap-4">
            {requests.map((item, idx) => (
              <RequestCard request={item} key={idx} />
            ))}
            {filterUser.map((item, idx) => (
              <FriendCard user={item} key={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
