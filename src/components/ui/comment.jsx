import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { db } from "../../configs/firebase";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { formatDistanceToNow } from "date-fns";
import "./comment.css";

function Comment({ carId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // Tracks which comment is being replied to
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log("Fetching comments for carId:", carId);
        const q = query(
          collection(db, "comments"),
          where("carId", "==", carId),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const commentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched comments:", commentsData);
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [carId]);

  const handleAddComment = async () => {
    if (newComment.trim() === "" || newComment.split(" ").length > 40) {
      alert("Comment must be between 1 and 40 words.");
      return;
    }

    setLoading(true);
    try {
      const newCommentObj = {
        carId,
        comment: newComment,
        likes: 0,
        replies: [], // Initialize with an empty replies array
        createdAt: new Date().toISOString(),
      };
      console.log("Adding comment:", newCommentObj);
      await addDoc(collection(db, "comments"), newCommentObj);
      console.log("Comment added successfully!");
      setComments((prevComments) => [newCommentObj, ...prevComments]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, {
        likes: increment(1),
      });

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        )
      );
      console.log(`Liked comment with ID: ${commentId}`);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleReply = async (commentId) => {
    if (replyText.trim() === "") {
      alert("Reply cannot be empty.");
      return;
    }

    try {
      const commentRef = doc(db, "comments", commentId);
      const newReply = {
        text: replyText,
        createdAt: new Date().toISOString(),
      };

      await updateDoc(commentRef, {
        replies: arrayUnion(newReply),
      });

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...(comment.replies || []), newReply] }
            : comment
        )
      );
      setReplyText("");
      setReplyingTo(null);
      console.log(`Replied to comment with ID: ${commentId}`);
    } catch (error) {
      console.error("Error replying to comment:", error);
    }
  };

  return (
    <div className="comment-section">
      <h3>Anonymous Comments</h3>
      <div className="add-comment">
        <textarea
          placeholder="Write your comment (max 40 words)..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          maxLength={255}
        ></textarea>
        <button onClick={handleAddComment} disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <p className="comment-text">{comment.comment}</p>
            <div className="comment-meta">
              <span className="comment-time">
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </span>
              <button
                className="like-button"
                onClick={() => handleLike(comment.id)}
              >
                {comment.likes > 0 ? (
                  <AiFillHeart className="liked" style={{ color: "red" }} />
                ) : (
                  <AiOutlineHeart />
                )}
                {comment.likes}
              </button>
              <button
                className="reply-button"
                onClick={() => setReplyingTo(comment.id)}
              >
                Reply
              </button>
            </div>

            {/* Reply Input */}
            {replyingTo === comment.id && (
              <div className="reply-input">
                <textarea
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
                <button onClick={() => handleReply(comment.id)}>Post Reply</button>
              </div>
            )}

            {/* Display Replies */}
            <div className="replies-list">
              {comment.replies &&
                comment.replies.map((reply, index) => (
                  <div key={index} className="reply-item">
                    <p>{reply.text}</p>
                    <span className="reply-time">
                      {formatDistanceToNow(new Date(reply.createdAt))} ago
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comment;