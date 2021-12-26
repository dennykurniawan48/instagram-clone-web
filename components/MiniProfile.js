import { useSession } from "next-auth/react"
import {signOut} from "next-auth/react"

function MiniProfile() {
    const {data: session} = useSession()
    return (
        <div className="flex ml-10 mt-14 items-center justify-between">
            <img src={session.user.image} className="w-16 h-16 rounded-full border"/>
            <div className="px-2">
                <p className="font-bold">{session.user.name}</p>
                <p className="text-gray-400 text-sm">Welcome to instagram</p>
            </div>
            <button onClick={signOut} className="text-sm font-semibold text-blue-400">Sign out</button>
        </div>
    )
}

export default MiniProfile