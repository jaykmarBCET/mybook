import { useCallback, useState } from "react";
import useRowStore from '../../store/rowapi/row.api';

function SearchBar() {
  const [search, setSearch] = useState("");
  const {
    searchByPostTitle,
    searchUserInfoByUserData,
    searchFriendByUserInfo,
    searchPostByUserInfo,
  } = useRowStore();

  const handleSubmit = useCallback(async () => {
    const data = { id: Number(search), name: search };
    await searchByPostTitle({ title: search });
    await searchFriendByUserInfo(data);
    await searchPostByUserInfo(data);
    await searchUserInfoByUserData(data);
  }, [
    search,
    searchByPostTitle,
    searchFriendByUserInfo,
    searchPostByUserInfo,
    searchUserInfoByUserData,
  ]);
  

  return (
    <div className="relative w-full max-w-xl mx-auto my-4">
      <input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        className="w-full pr-32 pl-5 py-3 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder:text-gray-500 font-medium transition-all duration-300"
        type="text"
        placeholder="Search what’s on your mind..."
      />
      <button
        onClick={handleSubmit}
        className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition-all duration-300"
        type="button"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
