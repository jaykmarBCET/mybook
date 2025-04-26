import axios from 'axios';


const baseURL = import.meta.env.VITE_API_BACKEND_URL

export const UserApiInstance = axios.create({
  baseURL: `${baseURL}/profile`,
  withCredentials: true,
});

export const PostApiInstance = axios.create({
    baseURL:`${baseURL}/post`,
    withCredentials:true
})

export const PostLikeApiInstance = axios.create({
    baseURL:`${baseURL}/post-like`,
    withCredentials:true,
})

export const ChatApiInstance = axios.create({
    baseURL:`${baseURL}/chat`,
    withCredentials:true
})
export const CommentApiInstance = axios.create({
    baseURL:`${baseURL}/comment`,
    withCredentials:true
})

export const CommentLikeApiInstance = axios.create({
    baseURL:`${baseURL}/comment-like`,
    withCredentials:true
})

export const FriendApiInstance = axios.create({
    baseURL:`${baseURL}/friend`,
    withCredentials:true
})

export const RequestApiInstance = axios.create({
    baseURL:`${baseURL}/request`,
    withCredentials:true
})

export const EmailVerifyApiInstance = axios.create({
    baseURL:`${baseURL}/email`,
    withCredentials:true
})

export const RowApiData = axios.create({
    baseURL:`${baseURL}/row-data`,
    withCredentials:true
})

export const CallApiInstance = axios.create({
    baseURL:`${baseURL}/call`,
    withCredentials:true
})

export const aiApiInstance = axios.create({
    baseURL:`${baseURL}/ai`,
    withCredentials:true
})