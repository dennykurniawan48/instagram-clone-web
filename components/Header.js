import Image from "next/image"
import {
    SearchIcon,
    PlusCircleIcon,
    UserGroupIcon,
    HeartIcon,
    PaperAirplaneIcon,
    MenuIcon
} from "@heroicons/react/outline"

import{
    HomeIcon
}from '@heroicons/react/solid'
import { useSession } from "next-auth/react"
import {signIn, signOut} from "next-auth/react"
import { useRouter } from "next/router"
import { useRecoilState } from "recoil"
import {modalState} from "../atoms/modalAtom"

function Header() {
    const {data: session} = useSession()
    const router = useRouter()
    const [open, setOpen] = useRecoilState(modalState)
    const myLoader = ({ src, width, quality }) => {
        return `${src}?w=${width}&q=${quality || 75}`
    }
    return (
        <div className="shadow-sm border-b-1 bg-white">
            <div className="flex justify-between bg-white max-w-6xl mx-5 xl:mx-auto items-center">
                <div onClick={() => router.push('/')} className="relative w-24 h-10 hidden lg:inline-grid cursor-pointer">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2880px-Instagram_logo.svg.png" loader={myLoader} layout="fill" objectFit="contain"/>
                </div>
                <div onClick={() => router.push('/')} className="relative w-10 h-10 lg:hidden flex-shrink-0 cursor-pointer">
                    <Image src="https://1000logos.net/wp-content/uploads/2017/02/insta-logo.png" loader={myLoader} width={500} height={500} objectFit="contain"/>
                </div>
                <div className="max-w-xs">
                    <div className="relative mt-1 p-3 rounded-md">
                        <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-500"/>
                        </div>
                        <input className="bg-gray-50 block w-full pl-10 sm:text-sm border-gray-300 focus:ring-black focus:border-black rounded-md" type="text" placeholder="Search"/>
                    </div>
                </div>
                <div className="flex items-center justify-end space-x-4">
                    <HomeIcon onClick={() => router.push('/')} className="navBtn"/>
                    <MenuIcon className="h-6 w-6 md:hidden cursor-pointer"/>
                   { session ? <>
                   <div className="relative navBtn">
                        <PaperAirplaneIcon className="navBtn rotate-45"/>
                        <div className="absolute flex items-center justify-center w-5 h-5 -top-3 -right-2 text-white bg-red-500 rounded-full">
                            3
                        </div>
                    </div>
                    <PlusCircleIcon onClick={() => {setOpen(true)}} className="navBtn"/>
                    <UserGroupIcon className="navBtn"/>
                    <HeartIcon className="navBtn"/>
                    <img src={session.user.image} onClick={signOut} className="h-10 rounded-full"/>
                </> : <button className="text-xs md:text-lg" onClick={signIn}>Sign In</button>}
                 </div>
            </div>
        </div>
    )
}

export default Header
