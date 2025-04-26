import toast from "react-hot-toast";
import { RowApiData } from "../../api/UserInstance";
import { create } from 'zustand';

export interface UserInfo {
  name: string;
  id: number;
  avatar: string;
}

export interface PostInfo {
  title: string;
  postedBy: number;
  description?: string;
  images?: string[];
  videos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchUserInfo {
  name: string;
  id: number;
}

export interface Friend {
  id: string;
  friendBy: string;
  userId: string;
}

export interface ProfileInfo {
  name: string;
  id: string;
  bio:string;
  avatar: string;
  coverImage: string;
  posts: PostInfo[];
  friends: Friend[];
}

export interface RowInfo {
  users: UserInfo[] | [];
  profile: ProfileInfo | null;
  posts: PostInfo[] | null;
  friends: Friend[] | null;
  searchedUser: UserInfo[] | null;
  searchedPost: PostInfo[] | null;
  searchedFriend: Friend[] | null;
  getUserInfoByUser: (data: SearchUserInfo) => Promise<void>;
  getPostByUserInfo: (data: SearchUserInfo) => Promise<void>;
  getFriendByUserInfo: (data: SearchUserInfo) => Promise<void>;
  searchUserInfoByUserData: (data: SearchUserInfo) => Promise<void>;
  searchPostByUserInfo: (data: SearchUserInfo) => Promise<void>;
  searchFriendByUserInfo: (data: SearchUserInfo) => Promise<void>;
  searchByPostTitle: (data: { title: string }) => Promise<void>;
  getProfileByUserId: (data: number) => Promise<void>;
}

const useRowStore = create<RowInfo>((set, get) => ({
  users: [],
  profile: null,
  posts: null,
  friends: null,
  searchedFriend: null,
  searchedUser: null,
  searchedPost: null,

  getUserInfoByUser: async ({ name, id }) => {
    try {
      const response = await RowApiData.post('/get-user-info', { name, id });

      if (response.data?.message) {
        toast.error(response.data.message);
        return;
      }

      const newUser = response.data;
      const currentUsers = get().users || [];

      const alreadyExists = currentUsers.some(user => user.id === newUser.id);
      if (!alreadyExists) {
        set({ users: [...currentUsers, newUser] });
      }

    } catch (error: any) {
      console.log(error.message)
    }
  },

  getFriendByUserInfo: async (data) => {
    try {
      const response = await RowApiData.post("/get-friend-info", data);
      if (response.data?.message) {
        toast.error(response.data.message);
      } else {
        const currentFriends = get().friends || [];
        set({ friends: [...currentFriends, ...response.data] });
      }
    } catch (error: any) {
      console.log(error.message)
    }
  },

  getPostByUserInfo: async (data) => {
    try {
      const response = await RowApiData.post('/get-posts-by-user-info', data);
      if (response.data?.message) {
        toast.error(response.data.message);
      } else {
        set({ posts: response.data });
      }
    } catch (error: any) {
      console.log(error.message)
    }
  },

  searchUserInfoByUserData: async (data) => {
    try {
      const response = await RowApiData.post('/search-user-info-by-user-data', data);
      if (response.data?.message) {
        toast.error(response.data.message);
      } else {
        set({ searchedUser: response.data });
      }
    } catch (error: any) {
      console.log(error.message)
    }
  },

  searchByPostTitle: async (data) => {
    try {
      const response = await RowApiData.post('/search-post-title', data);
      if (response.data?.message) {
        toast.error(response.data.message);
      } else {
        set({ searchedPost: response.data });
      }
    } catch (error: any) {
      console.log(error.message)
    }
  },

  searchFriendByUserInfo: async (data) => {
    try {
      const response = await RowApiData.post('/search-friend-by-user-info', data);
      if (response.data?.message) {
        toast.error(response.data.message);
      } else {
        set({ searchedFriend: response.data });
      }
    } catch (error: any) {
      console.log(error.message)
    }
  },

  searchPostByUserInfo: async (data) => {
    try {
      const response = await RowApiData.post('/search-post-by-user-info', data);
      if (response.data?.message) {
        toast.error(response.data.message);
      } else {
        set({ searchedPost: response.data });
      }
    } catch (error: any) {
      console.log(error.message)
    }
  },

  getProfileByUserId: async (id) => {
    try {
      const response = await RowApiData.post('/get-profile-by-user-id', { id });
      if (response.data?.message) {
        toast.error(response.data.message);
      } else {
        set({ profile: response.data });
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }

}));

export default useRowStore;
