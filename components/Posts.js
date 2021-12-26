import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useState } from "react";
import Post from "./Post";
import {useEffect} from "react"
import { db } from "../firebase";

function Posts() {
    const [posts, setPosts] = useState([])

    useEffect(() => (
        onSnapshot(query(collection(db, 'posts'), orderBy("timestamp", "desc")),
        snapshot => {
            setPosts(snapshot.docs)
        })
    ), [db])


    return (
        
        <div>
            {posts.map(post =>(
                <Post key={post.data().timestamp?.seconds} id={post.id} img={post.data().image} username={post.data().username} userImg={post.data().profileImg} caption={post.data().caption}/>
            ))}
        </div>
    )
}

export default Posts
