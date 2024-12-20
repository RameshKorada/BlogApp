import "./index.css";
import { useSelector } from "react-redux";

const BlogsDisplaying = ({ eachBlog, deleteBlog }) => {
  const blogText = eachBlog.blogText;

  const isClicked=useSelector(state=>state.isClicked)
  const deletingBlog = () => {
    deleteBlog(eachBlog.B_Id);
    console.log(typeof deleteBlog);
  };

  return (
    <div className={isClicked?"blogs-displaying-container-off":"blogs-displaying-container"}>
      <p>{blogText}</p>
      <button type="button" className="delete-button" onClick={deletingBlog}>
        Delete Blog
      </button>
    </div>
  );
};

export default BlogsDisplaying;
