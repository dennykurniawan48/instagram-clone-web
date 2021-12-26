import React from 'react'
import { getProviders, signIn as signInProvider } from "next-auth/react"
import Header from '../../components/Header';

function signin({providers}) {
    return (
        <>
        <Header/>
      {Object.values(providers).map((provider) => (
          <div className='flex flex-col justify-center items-center text-center max-h-full'>
          <img className='w-80 mt-10' src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2880px-Instagram_logo.svg.png'/>
          <p>This is not real app, just educational purpose only.</p>
          <div key={provider.name} className='mt-40'>
          <button className='bg-blue-400 p-2 rounded-lg text-white' onClick={() => signInProvider(provider.id, {callbackUrl: '/'})}>
            Sign in with {provider.name}
          </button>
        </div>
        </div>
      ))}
        </>
    )
}

export const getServerSideProps = async (context) => {
    const providers = await getProviders();
    return {
        props:{
            providers
        }
    }
  }

export default signin
