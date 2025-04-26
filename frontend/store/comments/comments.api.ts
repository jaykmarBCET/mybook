import {CommentApiInstance} from '../../api/UserInstance'
import {create} from 'zustand'

export interface CommentInfo{
    id:number;
    description:string;
    postId:string;
    commentedBy:number;
    createdAt:Date;
    updatedAt:Date;
}

export interface commentRequestInfo{
    description:string;
    postId:string;
}

export interface commentStore{
    comments:[CommentInfo] | null;
    addComment:(commentRequestInfo:commentRequestInfo)=>Promise<void>;
    getComments:(postId:number)=>Promise<void>;
    deleteComments:(commentId:Number)=>Promise<void>;
}

const useCommentStore = create<commentStore>((set,get)=>({
    comments:null,
    addComment:async(commentRequestInfo)=>{
        const response = await CommentApiInstance.post('/',commentRequestInfo)
        if(response.data?.message){
            alert(response.data.message)
        }else{
            let comments = get().comments;
            comments?.push(response.data)
            set({comments})
        }
        
    },
    getComments:async(postId)=>{
        const response = await CommentApiInstance.get(`?postId=${postId}`)
        if(response.data.message){
            alert(response.data.message)
        }else{
            set({comments:response.data})
        }
    },
    deleteComments:async(commentId)=>{
        const response = await CommentApiInstance.delete(`/${commentId}`)
        console.log(response)
    }
}))

export default useCommentStore;