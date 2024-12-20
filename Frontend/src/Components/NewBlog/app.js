import { useState } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Header from "../Header";
import "./index.css";

const NewBlog = () => {
  const [blogText, setBlogText] = useState("");
  const [blogLength, setBlogLength] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const isClicked=useSelector(state=>state.isClicked)

  const onTextArea = (event) => {
    setBlogText(event.target.value);
    setBlogLength(false);
  };

  const onBlogTitle = (e) => {
    setBlogTitle(e.target.value);
  };

  const onPostButtonClick = async () => {
    const username = Cookies.get("username");
    const blogUrl = `http://localhost:3004/postyourblogToBackEnd`;

    const blogTextDetails = {
      blogText,
      username,
      blogTitle,
    };

    const blogDetails = {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(blogTextDetails),
    };

    console.log(blogText.length, blogTitle);

    if (blogText.length > 300 && blogTitle.length > 10) {
      setBlogLength(true);
      try {
        console.log(blogUrl, blogDetails);
        await fetch(blogUrl, blogDetails);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("length is less");
      setBlogLength(true);
    }
  };

  const blogsPostStatus =
    blogText.length > 300 && blogTitle.length > 10
      ? "Blog post successfully!!!"
      : "The blog should contain 300 characters, and the title should be limited to 10 characters!!!";

  return (
    <div>
      <Header />

      <div className={isClicked?"blogs-container-off":"blogs-container"}>
        <div className="area-container">
          <input
            placeholder="Enter Blog Title here..."
            onChange={onBlogTitle}
            value={blogTitle}
          />
          <textarea
            onChange={onTextArea}
            className={isClicked?"text-area-container-off":"text-area-container"}
            placeholder="Start Your Blog From Here..."
            rows={16}
            cols={100}
          />
          <div className="post-button-container">
            <button
              onClick={onPostButtonClick}
              type="button"
              className="post-button"
            >
              POST
            </button>
          </div>

          {blogLength && <p>{blogsPostStatus}</p>}
        </div>
        <div className="interact-blogs-containers">
          {/* <h1 className="post-title">Share your wonderful experiences to all</h1>
          <InteractContainer/> */}
        </div>
      </div>
    </div>
  );
};

export default NewBlog;
