import{
    BookmarkIcon,
    ChatIcon,
    DotsHorizontalIcon,
    EmojiHappyIcon,
    HeartIcon,
    PaperAirplaneIcon
}from "@heroicons/react/outline"

import{
    HeartIcon as HeartIconFilled, LoginIcon
}from "@heroicons/react/solid"
import {useRef, useState, useEffect} from 'react'
import { useSession } from "next-auth/react"
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "../firebase"
import Moment from "react-moment"

function Post(props) {

    const {data: session} = useSession()
    const refComment = useRef("")
    const [comments, setComments] = useState([])
    const [likes, setLikes] = useState([])
    const [hasLike, setHasLikes] = useState(false)

    useEffect(() => (
        onSnapshot(collection(db, 'posts', props.id, 'likes'), snapshot => {
            setLikes(snapshot.docs)
        })
    ), [db, props.id])

    useEffect(() => (
        onSnapshot(query(collection(db, 'posts', props.id, 'comments'), orderBy("timestamp", "asc")),
        snapshot => {
            setComments(snapshot.docs)
        })
    ), [db, props.id])

    useEffect(() => (
        setHasLikes(likes.findIndex(like => (like.id == session.user.name)) != -1)
    ), [likes])

    const postLike = async () => {
        if(hasLike){
            console.log("Deleting")
            await deleteDoc(doc(db, 'posts', props.id, 'likes', session.user.name))
        }else{
            console.log("Add")
            await setDoc(doc(db, 'posts', props.id, 'likes', session.user.name),{
                name: session.user.name
            })
        }
    }

    const sendComment = async (e) => {
        e.preventDefault()
        const comment = refComment.current.value
        refComment.current.value = ""
        await addDoc(collection(db, 'posts', props.id, 'comments'), {
            comment: comment,
            name: session.user.name,
            profileImg: session.user.image,
            timestamp: serverTimestamp()
        })
    }
    
    return (
        <div className="bg-white rounded-sm my-7 border">
            <div className="flex items-center p-5">
                <img src={props.userImg} className="rounded-full h-12 w-12 p-1 mr-3 border object-contain font-bold" />
                <p className="flex-1">{props.username}</p>
                <DotsHorizontalIcon className="h-5"/>
            </div>
            <img src={props.img} className="object-cover w-full"/>
            {session && <div className="flex items-center justify-between p-4">
                <div className="flex space-x-4">
                    {hasLike ? (<HeartIconFilled onClick={postLike} className="btn text-red-500"/>) : (<HeartIcon onClick={postLike} className="btn"/>)}
                    
                    <ChatIcon className="btn"/>
                    <PaperAirplaneIcon className="rotate-45 btn"/>
                </div>
                <BookmarkIcon className="btn" />
            </div>}

            {likes.length > 0 && <div className="px-4">
                <p>{likes.length} menyukai</p>
            </div>}
            
            <p className="px-4 truncate py-2">
                <span className="font-bold">{props.username} </span>{props.caption}
            </p>

<div className="px-4 w-full max-h-40 overflow-y-scroll">
                {comments.map(comment => {
                    return <div className="py-2 flex items-center" key={comment.data().timestamp}>
                        <img src={comment.data().profileImg} className="w-8 h-8 rounded-full" />
                        <p className="text-sm px-2 flex-1"><span className="font-bold">{comment.data().name}</span> {comment.data().comment}</p>
                        <Moment fromNow className="text-sm text-gray-400">
                            {comment.data().timestamp?.toDate()}
                        </Moment>
                    </div>
})}
            </div>
            

            {session && <form className="p-4 flex">
                <EmojiHappyIcon className="h-7" />
                <input ref={refComment} className="border-none focus:ring-0 outline-none flex-1 px-4" placeholder="Tambahkan komentar" />
                <button type="submit" onClick={sendComment} className="font-sm text-blue-400">Post</button>
            </form>}
        </div>
    )
}

export default Post
