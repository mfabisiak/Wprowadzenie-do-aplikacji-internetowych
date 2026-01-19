import styles from './Comment.module.css'

import type CommentData from "./CommentData.ts";
import {useState} from "react";

function Comment({id, body, postId, likes, user}: CommentData) {
    const [currentLikes, setCurrentLikes] = useState(likes);

    return (
        <div className={styles.comment}>
            <p>Comment ID: {id}</p>
            <h2>Author: {user.username}</h2>
            <p>PostId: {postId}</p>
            <p>{body}</p>
            <p>Likes: {currentLikes}</p>
            <button onClick={() => setCurrentLikes(prev => prev + 1)}>Like</button>
            <button onClick={() => setCurrentLikes(prev => prev - 1)}>Dislike</button>
        </div>

    );
}

export default Comment;