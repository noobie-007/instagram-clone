import React, {useState, useEffect} from 'react';
import './Post.css';
import { db } from './firebase'; 
import Avatar from "@material-ui/core/Avatar";
import { Button } from '@material-ui/core';
import firebase from 'firebase';

function Posts ({postId, user, username, caption, imageUrl}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState(''); 

    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className="post">
            <div className="post-header">
                <Avatar
                    className="post-avatar"
                    alt="Remy Sharp"
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>
            
            <img className="post-image"
            src={imageUrl}
            alt=""
             />
            <h4 className="post_text"><strong>{username}</strong> : {caption}</h4> 

            <div className="post-comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {user && (
                <form className="post-commentBox">
                    <input
                        className="post-input"
                        type="text"
                        placeholder="Add a Comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                        disabled={!comment}
                        className="post-button"
                        type="submit"
                        onClick={postComment}
                        >
                        Post
                    </Button>
                </form>
            )}
            
        </div>
    )
}

export default Posts