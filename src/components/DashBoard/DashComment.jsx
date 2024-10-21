import { useEffect, useState } from "react";
import axios from 'axios'; 
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";

const DashComments = () => {
  const [comments, setComments] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [showModal, setShowModal] = useState(false); 
  const [commentIdToDelete, setCommentIdToDelete] = useState(""); 

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('/api/comments'); 
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []);

  const filteredComments = comments.filter(
    (comment) =>
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.postId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const displayedComments = filteredComments.slice(indexOfFirstComment, indexOfLastComment);

  const handleDeleteComment = () => {
    axios.delete(`/api/comments/${commentIdToDelete}`)
      .then(() => {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentIdToDelete)
        );
        setShowModal(false);
      })
      .catch(error => console.error('Error deleting comment:', error));
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 mt-6">
      <div className="py-8">
        {/* Tiêu đề và tìm kiếm */}
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold leading-tight">Comments</h2>
          <input
            type="text"
            placeholder="Search by content, Post ID, or User ID..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
            }}
          />
        </div>

        {/* Bảng hiển thị comments */}
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">ID</th>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Date Updated</th>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Content</th>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Likes</th>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Post ID</th>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">User ID</th>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedComments.map((comment) => (
                  <tr key={comment.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{comment.id}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(comment.updatedAt).toLocaleDateString()}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{comment.content}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{comment.numberOfLikes}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{comment.postId}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{comment.userId}</td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment.id);
                        }}
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <HiTrash className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {displayedComments.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">No comments found matching your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Phần phân trang */}
            <div className="px-5 py-5 bg-white border-t flex flex-col sm:flex-row items-center sm:justify-between">
              <span className="text-xs sm:text-sm text-gray-900">Showing {indexOfFirstComment + 1} to {Math.min(indexOfLastComment, filteredComments.length)} of {filteredComments.length} Entries</span>
              <div className="inline-flex mt-2 sm:mt-0">
                {/* Nút Prev */}
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`text-sm px-4 py-2 rounded-l border ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                >
                  Prev
                </button>

                {/* Các nút số trang */}
                {[...Array(Math.ceil(filteredComments.length / commentsPerPage))].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`text-sm px-4 py-2 border-t border-b border-gray-200 ${currentPage === index + 1 ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                  >
                    {index + 1}
                  </button>
                ))}

                {/* Nút Next */}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredComments.length / commentsPerPage)}
                  className={`text-sm px-4 py-2 rounded-r border ${currentPage === Math.ceil(filteredComments.length / commentsPerPage) ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">Are you sure you want to delete this comment?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>Yes, I m sure</Button>
              <Button color="gray" onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashComments;
