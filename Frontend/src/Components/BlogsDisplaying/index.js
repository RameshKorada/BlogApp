import "./index.css";

const BlogsDisplaying = ({ eachBlog, deleteBlog }) => {
  const blogText = eachBlog.blogText;

  const deletingBlog = () => {
    deleteBlog(eachBlog.B_Id);
    console.log(typeof deleteBlog);
  };

  return (
    <div className="blogs-displaying-container">
      <p>{blogText}</p>
      <button type="button" className="delete-button" onClick={deletingBlog}>
        Delete Blog
      </button>
    </div>
  );
};

export default BlogsDisplaying;
