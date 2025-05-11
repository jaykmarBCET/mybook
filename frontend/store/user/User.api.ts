import { create } from 'zustand';
import { UserApiInstance,backendHostUrl } from '../../api/UserInstance';
import { toast } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

export interface UserInfo {
  name: string;
  email: string;
  id: number;
  avatar?: string;
  coverImage?: string;
  avatarId?: string;
  coverImageId?: string;
  dob?: Date;
  bio?: string;
}

interface UserData {
  user: UserInfo | null;
  isLoading: boolean;
  error?: string | null;
  socket: Socket | null;
  onlineUsers: number[] | null;

  currentUser: () => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; dob: Date; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<UserInfo>) => Promise<void>;
  deleteUser: () => Promise<void>;
  deleteUserVerify: (data: any) => Promise<void>;
  recoverUser: (data: any) => Promise<void>;
  resetPassword:(data:{email:string})=>Promise<void>;
  verifyPassword:(data:{email:string,password:string,otp:number})=>Promise<void>;
  recoverUserVerify: () => Promise<void>;
  connectSocket: () => Promise<void>;
  disconnectSocket: () => Promise<void>;
  createRegisterVerify:(email:string)=> Promise<string>;
  emailTokenVerify:(token:string)=>Promise<string>;
}

const useUserStore = create<UserData>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  socket: null,
  onlineUsers: null,

  currentUser: async () => {
    try {
      set({ isLoading: true });
      const res = await UserApiInstance.get('/current-user');
      if(res.status===400){
        toast.error(res.data.message)
        set({isLoading:false})
        return
      }
      
      set({ user: res.data, isLoading: false });
      await get().connectSocket();
      
    } catch (err: any) {
      toast.error("Failed to fetch user.");
      set({ isLoading: false, error: err.message });
    }
  },

  login: async ({ email, password }) => {
    try {
      set({ isLoading: true });
      const res = await UserApiInstance.post('/login', { email, password });
      if(res.status===400){
        toast.error(res.data.message)
        set({isLoading:false})
        return;
      }
      localStorage.setItem("token",res.data.token)
      set({ user: res.data, isLoading: false });
      toast.success("Login successful!");
      await get().connectSocket();
    } catch (err: any) {
      toast.error("Login failed!");
      set({ isLoading: false, error: err.message });
    }
  },

  register: async (data) => {
    try {
      set({ isLoading: true });
      const res = await UserApiInstance.post('/register', data);
      if(res.status>350){
        toast.error(res.data.message)
        return;
      }
      localStorage.setItem("token",res.data.token)
      set({ user: res.data, isLoading: false });
      toast.success("Registration successful!");
      await get().connectSocket();
    } catch (err: any) {
      toast.error("Registration failed!");
      set({ isLoading: false, error: err.message });
    }
  },

  logout: async () => {
    try {
      await UserApiInstance.get('/logout');
      await get().disconnectSocket();
      set({ user: null });
      toast.success("Logged out!");
    } catch (err: any) {
      toast.error("Logout failed!");
    }
  },

  updateUser: async (data) => {
    try {
      
      const res = await UserApiInstance.put('/update-profile', data);
      set({ user: res.data });
      toast.success("User updated!");
    } catch (err: any) {
      toast.error("Update failed!");
    }
  },
  resetPassword:async(data)=>{
    set({isLoading:true})
   const response =  await UserApiInstance.post('/reset-password',data)
   toast(response.data.message)
     set({isLoading:false})
  },
  verifyPassword:async(data)=>{
    set({isLoading:true})
    const response = await UserApiInstance.post('/reset-password-verify',data)
     toast(response.data.message)
     set({isLoading:false})
  },
  deleteUser: async () => {
    try {
      await UserApiInstance.delete('/delete-user');
      await get().disconnectSocket();
      set({ user: null });
      toast.success("Account deleted.");
    } catch (err: any) {
      toast.error("Delete failed!");
    }
  },

  deleteUserVerify: async (data) => {
    try {
      await UserApiInstance.post('/delete-user.verify', data);
      toast.success("Verification successful.");
    } catch (err: any) {
      toast.error("Verification failed!");
    }
  },

  recoverUser: async (data) => {
    try {
      await UserApiInstance.post('/recover-user', data);
      toast.success("Recovery email sent.");
    } catch (err: any) {
      toast.error("Recovery failed!");
    }
  },

  recoverUserVerify: async () => {
    try {
      const res = await UserApiInstance.post('/recover-user-verify');
      set({ user: res.data });
      toast.success("Account recovered.");
      await get().connectSocket();
    } catch (err: any) {
      toast.error("Recovery verification failed!");
    }
  },

  connectSocket: async () => {
    const { user, socket } = get();
    if (!user) return;

    if (socket && socket.connected) return;
    
    console.log(backendHostUrl)
    const newSocket = io("https://4zh6cf-3000.csb.app" , {
      withCredentials: true,
      query: { userId: String(user.id) },
    });

    set({ socket: newSocket });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    newSocket.on('getOnlineUsers', (userIds: number[]) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: async () => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.disconnect();
      set({ socket: null, onlineUsers: null });
      console.log('Socket disconnected manually');
    }
  },
  // TODO: complete this before exam
  emailTokenVerify:async(token:string)=>{
    const response = await UserApiInstance.post(`/verify-user?token=${token}`)
    if(response.status===200){
      
      toast.success("verify successfully")
     
      return "ok";
    }
    toast.error(response.data.message)
    return response.data.message;

  },
  // TODO: complete this before exam
  createRegisterVerify:async(email:String)=>{
    const response = await UserApiInstance.post("/create-register-verify",{email})
    if(response.status===200){
      toast.success("token generated successfully")
      
      return  "ok";
    }
    toast.error(response.data.message)
    return response.data.message
  }
}));

export default useUserStore;
