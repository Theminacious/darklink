"use server"

import { currentUser } from "@clerk/nextjs/server"
import { client } from '../lib/prisma'


export const onAuthenticateUser = async()=>{
    try{
        const user = await currentUser()
        if(!user){
           return {status:403}
        }

        
        const userExist  = await client.user.findUnique({
            where:{
                clerkid:user.id
            },
            include:{   
                workspace:{
                    where:{
                        User:{
                            clerkid:user.id,
                        },
                    },
                },
            },
        })
        if(userExist){
            return {status:200, user:userExist}
        }
        const newUser = await client.user.create({
            data:{
                clerkid:user.id,
                firstname:user.firstName,
                lastname:user.lastName,
                email:user.emailAddresses[0].emailAddress,
                image:user.imageUrl,
                studio:{
                    create:{},
                },
                subscription:{
                    create:{},
                },
                workspace:{
                    create:{
                        name:`${user.firstName}'s Workspace`,
                        type:'PERSONAL',
                    },
                },

            },
            include:{
                workspace:{
                    where:{
                        User:{
                            clerkid:user.id,
                        },
                    },
                },
                subscription:{
                    select:{
                        plan:true,
                    },
                },
            },
        })
        
        if(newUser){
            return {status:201, user:newUser}
        }
        return {status:400}
        
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch(e){
        return {status:500}
    }
}



export const getNotifications = async () => {
    try{
      const user = await currentUser();
      if(!user){
        return {status:404}
      }
      const notifications= await client.user.findUnique({
        where:{
            clerkid:user.id,
        },
        select:{
          notification:true,
          _count:{
            select:{
              notification:true,
            },
          },
        },
        })
        if(notifications && notifications.notification.length>0){
          return {status:200, data:notifications}
        }
        return {status:404,data:[]}
        
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch(error){
      return {status:400,data:[]}
    }
  }