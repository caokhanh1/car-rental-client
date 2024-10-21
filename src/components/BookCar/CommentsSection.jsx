
const CommentsSection = () => {
  const comments = [
    {
      id: 1,
      name: "Lucy Carlson",
      date: "Jul 12",
      avatar: "https://via.placeholder.com/40", // Replace with actual avatar image URL
      comment:
        "This is a sample comment. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: 2,
      name: "Lora Leigh",
      date: "Jul 10",
      avatar: "https://via.placeholder.com/40", // Replace with actual avatar image URL
      comment:
        "Another sample comment. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.",
    },
    {
      id: 3,
      name: "Natalie Gordon",
      date: "Jul 8",
      avatar: "https://via.placeholder.com/40", // Replace with actual avatar image URL
      comment:
        "Yet another comment example. Phasellus scelerisque felis nec libero.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-slate-100 rounded-lg shadow-lg  ">
      {/* Comments List */}
      <div>
        <h3 className="text-2xl font-semibold mb-6">3 Comments</h3>
        <div className="space-y-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              <img
                src={comment.avatar}
                alt={`${comment.name} avatar`}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold">{comment.name}</h4>
                  <span className="text-sm text-gray-500">{comment.date}</span>
                </div>
                <p className="mt-2 text-gray-700">{comment.comment}</p>
                <button className="text-sm text-blue-500 hover:underline mt-2">
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Form */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Leave a Comment</h3>
        <form className="space-y-4">
          <div>
            <textarea
              placeholder="Write your comment here"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
              rows="5"
            ></textarea>
          </div>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Write your full name here"
              className="w-1/2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Write your email address"
              className="w-1/2 border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="bg-black text-white py-2 px-4 rounded-lg">
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentsSection;
