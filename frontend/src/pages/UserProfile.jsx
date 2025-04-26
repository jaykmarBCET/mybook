import React, { useEffect } from 'react'
import {Navigate, useParams} from 'react-router-dom'
import useRowStore from '../../store/rowapi/row.api';
import PostCard from '../components/PostCard';
import useUserStore from '../../store/user/User.api';


 function UserProfile() {
    const {id}= useParams();
    const {profile,getProfileByUserId} = useRowStore()
    const user = useUserStore().user

    useEffect(()=>{
      getProfileByUserId(Number(id))
    },[getProfileByUserId,id])
   
    if(!user){
       return <Navigate to={'/login'}/>
    }
  return (
    <div>
      {
        profile&&(
          <div>
            {
              profile&&(
                <div className='relative mb-20'>
                  <img className='w-full relative h-40 object-cover'  src={profile.coverImage} alt="" />
                  <div className='flex left-1/2 -bottom-16  flex-col justify-center absolute'>
                    <img className='w-28 h-28 rounded-full ' src={profile.avatar} alt="" />
                    <h1 className='text-center text-xl px-2 py-2 shadow-xl bg-gray-100 font-bold my-1 rounded-xl uppercase'>{profile.name}</h1>
                  </div>
                </div>
                
              )
            }
            <div className='flex flex-wrap justify-center gap-x-3 gap-y-2 mx-2 my-2'>

            {
              profile.posts.map((item,idx)=>(
                <div key={idx}>
                  <PostCard post={item}/>
                </div>
              ))
            }
            </div>
          </div>
        )
      }
    </div>
  )
}

export default UserProfile