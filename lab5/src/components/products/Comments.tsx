import {useEffect, useState} from "react";
import type CommentData from "./CommentData.ts";
import Comment from "./Comment.tsx";

function Comments() {
    const [comments, setComments] = useState<CommentData[]>([]);

    useEffect(() => {
        fetch('https://dummyjson.com/comments')
            .then(response => response.json())
            .then(data => setComments(data.comments))
    }, []);

    return (
        <>
            {comments.map(comment => <Comment key={comment.id} {...comment}/>)}
        </>
    );
}

export default Comments;