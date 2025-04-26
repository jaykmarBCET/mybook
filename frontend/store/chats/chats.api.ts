import { ChatApiInstance } from "../../api/UserInstance";
import { create } from "zustand";
import useUserStore from "../user/User.api";

interface chatInfo {
  id: number;
  file: string | null;
  fileId: string | null;
  description: string | null;
  chatSender: number;
  chatReceiver: number;
}

interface userInfo {
  name: string;
  id: number;
  avatar: string;
}

interface chatStore {
  chats: chatInfo[]; 
  selectedUser: userInfo;
  subscribed: boolean;
  isLoading:boolean | false
  sendChat: (data: FormData) => Promise<void>;
  getChats: () => Promise<void>;
  updateChats: (data:{chatId:number,description:string}) => Promise<void>;
  deleteChat: (chatId: number) => Promise<void>;
  setSelectedUser: (userInfo: userInfo) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

const useChatsStore = create<chatStore>((set, get) => ({
  chats: [],
  selectedUser: { name: "", avatar: "", id: 0 },
  subscribed: false,
  isLoading:false,
  sendChat: async (data: FormData) => {
    set({isLoading:true})
    try {
      const response = await ChatApiInstance.post(
        `?receiver=${get().selectedUser?.id}`,
        data
      );
      set((state) => ({ chats: [...state.chats, response.data] }));
    } catch (error) {
      console.error("Failed to send chat:", error);
    }finally{
      set({isLoading:false})
    }
  },

  getChats: async () => {
    set({isLoading:true})
    try {
      const response = await ChatApiInstance.get(
        `?receiver=${get().selectedUser.id}`
      );
      if (Array.isArray(response.data)) {
        set({ chats: response.data });
      } else {
        set({ chats: [] });
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    }finally{
      set({isLoading:false})
    }
  },

  updateChats: async (data) => {
    set({isLoading:true})
    try {
      const response = await ChatApiInstance.put(
        `/${data.chatId}?chatId=${data.chatId}`,
        data
      );
      const updatedChat = response.data;
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.id === updatedChat.id ? updatedChat : chat
        ),
      }));
    } catch (error) {
      console.error("Failed to update chat:", error);
    }finally{
      set({isLoading:false})
    }
  },

  deleteChat: async (chatId: number) => {
    set({isLoading:true})
    try {
      await ChatApiInstance.delete(`/${chatId}?chatId=${chatId}`);
      set((state) => ({
        chats: state.chats.filter((chat) => chat.id !== chatId),
      }));
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }finally{
      set({isLoading:false})
    }
  },

  setSelectedUser: (userInfo: userInfo) => {
    set({ selectedUser: userInfo, chats: [] }); 
  },

  subscribeToMessages: () => {
    const { selectedUser, subscribed } = get();
    const socket = useUserStore.getState().socket;
    const currentUser = useUserStore.getState().user;

    if (!socket || !selectedUser || subscribed) return;

    socket.on("newMessage", (newMessage: chatInfo) => {
      console.log(newMessage)
      if (
        newMessage.chatSender === currentUser?.id ||
        newMessage.chatReceiver === currentUser?.id
      ) {
        set((state) => ({ chats: [...state.chats, newMessage] }));
      }
    });

    set({ subscribed: true });
  },

  unsubscribeFromMessages: () => {
    const socket = useUserStore.getState().socket;
    socket?.off("newMessage");
    set({ subscribed: false });
  },
}));

export default useChatsStore;
