import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../Header";
import BlogsDisplaying from "../BlogsDisplaying";
import "./index.css";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";

const MyBlogs = () => {
  const [blogsData, setBlogsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isClicked=useSelector(state=>state.isClicked)

  useEffect(() => {
    gettingBlogsDataFromBackend();
  }, []);

  const gettingBlogsDataFromBackend = async () => {
    try {
      const username = Cookies.get("username");
      const apiUrl = `http://localhost:3004/myblogs/${username}`;
      const apicallingForGettingBlogsData = await fetch(apiUrl);

      if (apicallingForGettingBlogsData.status === 200) {
        const data = await apicallingForGettingBlogsData.json();
        setBlogsData(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteBlog = async (blog_id) => {
    const apiUrl = `http://localhost:3004/deleteblog/${blog_id}`;
    const res = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 200) {
      gettingBlogsDataFromBackend();
    }
  };

  const noBlogsView = () => {
    return (
      <div className="no-blogs-view">
        <img
          className="no-blogs-view-image"
          src="https://assets.hongkiat.com/uploads/mobile-app-empty-state-designs/12-empty-state-mobile-app-designs.jpg"
          alt="No Blogs found"
        />
        <br />
        <Link to="/postyourblog" className="postyourblog_link">
          Please click on here to write a BLOG...
        </Link>
      </div>
    );
  };

  const jwtToken = Cookies.get("jwtToken");

  if (jwtToken === undefined) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="all-my-blogs-container">
      <Header />
      {isLoading ? (
        <div className="my-blogs-container">
          <ReactLoading type={"spin"} color={"#3498db"} height={"50px"} width={"50px"} />
        </div>
      ) : (
        <div className={isClicked? "my-blogs-container-off":"my-blogs-container"}>
          {blogsData.length !== 0 ? (
            blogsData.map((eachBlog) => (
              <BlogsDisplaying
                eachBlog={eachBlog}
                deleteBlog={deleteBlog}
                key={eachBlog.B_id}
              />
            ))
          ) : (
            noBlogsView()
          )}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
