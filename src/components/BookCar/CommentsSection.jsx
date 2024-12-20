import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { ref, push, onValue } from "firebase/database";
import { database } from "../../config/firebase";
import AuthContext from "../../context/AuthContext";

const CommentsSection = ({ carId, canComment }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    content: "",
  });
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    if (!carId) return;

    const commentsRef = ref(database, `comments/${carId}`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const commentsArray = Object.entries(data).map(([id, comment]) => ({
          id,
          ...comment,
        }));
        setComments(commentsArray);
      }
    });

    return () => unsubscribe();
  }, [carId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { content } = newComment;

    if (!content) {
      alert("Please fill out all fields!");
      return;
    }

    const commentsRef = ref(database, `comments/${carId}`);
    push(commentsRef, {
      userId: user.id,
      name: user.unique_name,
      email: user.email,
      role: user.role,
      content,
      timestamp: Date.now(),
      avatar: user.image_url,
      replies: [],
    });

    setNewComment({ name: "", email: "", content: "" });
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();

    if (!replyContent) {
      alert("Reply content cannot be empty!");
      return;
    }

    const replyRef = ref(database, `comments/${carId}/${replyingTo}/replies`);
    push(replyRef, {
      userId: user.id,
      name: user.unique_name,
      role: user.role,
      avatar: user.image_url,
      content: replyContent,
      timestamp: Date.now(),
    });

    setReplyingTo(null);
    setReplyContent("");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 mt-1">
      <h2 className="text-3xl font-bold italic mb-4 text-gray-800">Comments</h2>
      <div className="p-6 bg-slate-100 rounded-lg shadow-lg">
        <div className="space-y-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex flex-col space-y-4">
              <div className="flex space-x-4">
                <img
                  src={comment.avatar || "https://via.placeholder.com/40"}
                  alt={`${comment.name} avatar`}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">{comment.name}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{comment.content}</p>
                  <button
                    className="text-sm text-blue-500 hover:underline mt-2"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    Reply
                  </button>
                </div>
              </div>

              {comment.replies &&
                Object.values(comment.replies).map((reply, index) => (
                  <div
                    key={index}
                    className="ml-12 p-4 bg-gray-100 rounded-lg flex space-x-4"
                  >
                    <img
                      src={reply.avatar || "https://via.placeholder.com/40"}
                      alt={`${reply.name} avatar`}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <h5 className="font-semibold">{reply.name}</h5>
                      <p className="text-gray-700">{reply.content}</p>
                      <span className="text-sm text-gray-500">
                        {new Date(reply.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}

              {replyingTo === comment.id && (
                <form onSubmit={handleReplySubmit} className="ml-12 space-y-4">
                  <textarea
                    placeholder="Write your reply here"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    rows="3"
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-black text-white py-2 px-4 rounded-lg"
                  >
                    Post Reply
                  </button>
                  <button
                    type="button"
                    className="text-sm text-gray-500 ml-4"
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Leave a Comment</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                name="content"
                placeholder="Write your comment here"
                value={newComment.content}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                rows="5"
                disabled={!canComment}
              ></textarea>
            </div>
            <button
              type="submit"
              className={`py-2 px-4 rounded-lg ${
                canComment
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-red-300 text-white cursor-not-allowed"
              }`}
              disabled={!canComment}
            >
              {canComment ? "Post Comment" : "Comment Disabled"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

CommentsSection.propTypes = {
  carId: PropTypes.string.isRequired,
  canComment: PropTypes.bool.isRequired,
};

export default CommentsSection;
