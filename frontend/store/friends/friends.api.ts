import { create } from 'zustand';
import { FriendApiInstance, RequestApiInstance } from '../../api/UserInstance';

interface requestInfo {
    id: number;
    requestedBy: number;
    requestReceiver: number;
    isAccept: boolean | false;
    createdAt: Date;
    updatedAt: Date;
}

interface friendInfo {
    id: number;
    friendBy: number;
    userId: number;
    createAt: Date;
    updatedAt: Date;
}

interface friendStoreInfo {
    friends: friendInfo[] | [];
    requests: requestInfo[] | [];
    users:[userInfo] | [];

    addFriend: (requestId: number) => Promise<void>;
    removeFriend: (friendId: number) => Promise<void>;
    sendRequest: (receiverId: number) => Promise<void>;
    getAllRequests: () => Promise<void>;
    getAllFriends: () => Promise<void>;
    getReceiverRequest: () => Promise<void>;
    cancelRequest: (requestReceiver: number) => Promise<void>;
    getUserInfo:(userId:number)=>Promise<{id:number;name:string;avatar:string}|void>;
}

interface userInfo{
    name:string;
    id:number;
    avatar:string;
}


const useFriendStore = create<friendStoreInfo>((set, get) => ({
    friends:[],
    requests: [],
    users:[],
    addFriend: async (requestId) => {
        const response = await FriendApiInstance.post(`/add/${requestId}`);
        if (response.data?.message) {
            console.log(response.data.message);
            return;
        }
        const currentFriends = get().friends || [];
        set({ friends: [...currentFriends, response.data] });
        get().getAllRequests()
    },

    removeFriend: async (friendId) => {
        await FriendApiInstance.delete(`/remove/${friendId}`);
        const friends = get().friends?.filter((item) => item.id !== friendId) || [];
        set({ friends });
    },

    sendRequest: async (receiverId) => {
        const response = await FriendApiInstance.post(`/send-request/${receiverId}`);
        if (response.data?.message) {
            console.log(response.data.message);
        } else {
            console.log('Request sent');
            get().getAllRequests(); 
            get().getReceiverRequest()
        }
    },

    getAllRequests: async () => {
        const response = await FriendApiInstance.get('/requests');
        set({ requests: response.data || [] });
    },

    getReceiverRequest: async () => {
        const response = await RequestApiInstance.get('/get-receiver-request');
        console.log(response.data)
        set({ requests: response.data || [] });
    },

    getAllFriends: async () => {
        const response = await FriendApiInstance.get('/all');
        
        set({ friends: response.data || [] });
    },

    cancelRequest: async (requestReceiver) => {
        await RequestApiInstance.delete(`/cancel-friend-request?requestReceiver=${requestReceiver}`);
        get().getAllRequests(); 
    },
    getUserInfo:async(userId)=>{
        const response = await FriendApiInstance.get(`/get-user-info?userId=${userId}`)
        if(response.data?.message){
            alert(response.data.message)
            return;
        }
        if(get().users.find((u)=>u.id===userId))return;
        const users = get().users
        set({users:[...users,response.data]})
        return response.data
    }
}));

export default useFriendStore;
