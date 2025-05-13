import { PostApiInstance,PostLikeApiInstance,aiApiInstance } from '../../api/UserInstance'
import { create } from 'zustand'
import toast, { Toast } from 'react-hot-toast'

export interface PostInfo {
  id: number
  title: string
  postedBy: number
  images: string[]
  videos: string[]
  description: string
  isPublic: boolean
  createAt: Date
  updatedAt: Date
}
export interface generateImageInfo{
  title:string;
  description:string;
  width?:number;
  height?: number;
  model?:string;
  prompt:string;
}
export interface postInterface {
  posts: PostInfo[] | null
  isLoading:boolean | false
  getPost: () => Promise<void>
  addSinglePostImage: (data: FormData) => Promise<void>
  addSingleVideo: (data: FormData) => Promise<void>
  getVideo: () => Promise<void>
  updateImage: (data: FormData,postInfo:{postId:number,publicId:string}) => Promise<void>
  updateVideo: (data: FormData,postInfo:{postId:number,publicId:string}) => Promise<void>
  updateTitleAndDescription: (data: object,postInfo:{postId:number}) => Promise<void>
  deletePost: (data: {postId:number}) => Promise<void>
  generateImage:(data:generateImageInfo)=>Promise<void>;
}

const usePostStore = create<postInterface>((set, get) => ({
  posts: null,
  isLoading:false,
  getPost: async (page=1) => {
    try {
      const res = await PostApiInstance.get(`/get-post?page=${page}`)
      
      set({ posts: res.data })
    } catch (err) {
      console.error('Error fetching posts:', err)
    }
  },

  addSinglePostImage: async (data: FormData) => {
    set({isLoading:true})
    try {
      await PostApiInstance.post('/add-image', data, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      await get().getPost()
      toast.success("image uploaded successfully")
    } catch (err) {
      console.error('Error adding image:', err)
      toast.error("Image upload fail")
    }finally{
      set({isLoading:false})
    }
  },
  generateImage:async(data)=>{
    set({isLoading:true})
    try {
      const response = await aiApiInstance.post('/generate-image',data);
      if(response.data?.message){
        alert(response.data.message)
        return;
      }
       await get().getPost()
       toast.success("image generated successfully")
    } catch (error) {
      console.log(error.message)
      toast.error("generating image fail")
    }finally{
      set({isLoading:false})
    }
  },
  addSingleVideo: async (data: FormData) => {
    try {
      await PostApiInstance.post('/add-video', data, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      await get().getPost()
    } catch (err) {
      console.error('Error adding video:', err)
    }
  },

  getVideo: async () => {
    try {
      await PostApiInstance.get('/add-video')
    } catch (err) {
      console.error('Error fetching videos:', err)
    }
  },

  updateImage: async (data: FormData,postInfo) => {
    try {
      await PostApiInstance.put(`/update-image?postId=${postInfo?.postId}&publicId=${postInfo.publicId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        
      })
      await get().getPost()
    } catch (err) {
      console.error('Error updating image:', err)
    }
  },

  updateVideo: async (data: FormData,postInfo) => {
    try {
      await PostApiInstance.put(`/update-video?postId=${postInfo?.postId}&publicId=${postInfo.publicId}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      await get().getPost()
    } catch (err) {
      console.error('Error updating video:', err)
    }
  },

  updateTitleAndDescription: async (data: object,postInfo) => {
    try {
      await PostApiInstance.put(`/update-title-description?postId=${postInfo.postId}`, data)
      await get().getPost()
    } catch (err) {
      console.error('Error updating title/description:', err)
    }
  },

  deletePost: async (data) => {
    set({isLoading:true})
    try {
      await PostApiInstance.delete('/delete-post', {
        params:{postId:data.postId}
      })
      await get().getPost()
    } catch (err) {
      console.error('Error deleting post:', err)
    }
    set({isLoading:false})
  },
  
  addLikes:async(postId:number)=>{
    const response = await PostLikeApiInstance.post(`/add-like?postId=${postId}`)
    return response.data;
  },
  addDislike:async(postId:number)=>{
    const response = await PostLikeApiInstance.post(`/add-dislike?postId=${postId}`)
    return response.data;
  },
  getLikes:async(postId:number)=>{
    const response = await PostLikeApiInstance.get(`/get-likes?postId=${postId}`)
    return response.data;
  },
  getDislikes:async(postId:number)=>{
    const response = await PostLikeApiInstance.get(`/get-dislikes?postId=${postId}`)
    return response.data
  },
  getLikeAndDislikes:async(postId:number)=>{
    const response = await PostLikeApiInstance.get(`/get-like-and-dislikes?postId=${postId}`)
    return response.data;
  },
  toggleLikeAndDislikes:async(postId:number)=>{
    const response = await PostApiInstance.get(`/toggle-like-dislike?postId=${postId}`)
    return response.data;
  },
  deleteDislike:async(postId:number)=>{
    const response = await PostApiInstance.delete(`/delete-dislike?postId=${postId}`)
    return response.data;
  },
  deleteLike:async(postId:number)=>{
    const response = await PostApiInstance.delete(`/delete-like?postId=${postId}`)
    return response;
  }
}))

export default usePostStore
