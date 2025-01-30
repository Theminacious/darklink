import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'


const DashBoardPage = async () => {
    //Authentication
    const auth = await onAuthenticateUser()
    if(auth.status === 201 || auth.status === 200){
          return redirect(`/dashboard/${auth.user?.workspace[0].id}`)
            //redirect to /login
        }
    if(auth.status === 400 || auth.status === 500 || auth.status === 404){
        return redirect('/auth/sign-in')
    }

    // if account? redirect to /onboarding
  return (
    <div>page</div>
  )
}

export default DashBoardPage