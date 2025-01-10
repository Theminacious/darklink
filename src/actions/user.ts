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
            },
        })
        return {status:200, user:newUser}
        
    }
    catch(e){
        return {status:500}
    }
}