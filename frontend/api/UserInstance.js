import axios from 'axios';


const baseURL = import.meta.env.VITE_API_BACKEND_URL
export const backendHostUrl=import.meta.env.VITE_API_BACKEND_BASE_URL;

const token = window.localStorage.getItem("token")

export const UserApiInstance = axios.create({
    baseURL: `${baseURL}/profile`,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${token}`
    }
});

export const PostApiInstance = axios.create({
    baseURL: `${baseURL}/post`,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${token}`
    }
})

export const PostLikeApiInstance = axios.create({
    baseURL: `${baseURL}/post-like`,
    withCredentials: true,
})

export const ChatApiInstance = axios.create({
    baseURL: `${baseURL}/chat`,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${token}`
    }
})
export const CommentApiInstance = axios.create({
    baseURL: `${baseURL}/comment`,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${token}`
    }
})

export const CommentLikeApiInstance = axios.create({
    baseURL: `${baseURL}/comment-like`,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${token}`
    }
})

export const FriendApiInstance = axios.create({
    baseURL: `${baseURL}/friend`,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${token}`
    }
})

export const RequestApiInstance = axios.create({
    baseURL: `${baseURL}/request`,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${token}`
    }
})

export const EmailVerifyApiInstance = axios.create({
    baseURL: `${baseURL}/email`,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${token}`
    }
})

export const RowApiData = axios.create({
    baseURL: `${baseURL}/row-data`,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${token}`
    }
})

export const CallApiInstance = axios.create({
    baseURL: `${baseURL}/call`,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${token}`
    }
})

export const aiApiInstance = axios.create({
    baseURL: `${baseURL}/ai`,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${token}`
    }
})