import { useState, useEffect } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { HiOutlineChatBubbleLeft } from "react-icons/hi2";
import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import Comments from "../Comments/app";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";


import "./index.css";

const Posts = ({ eachBlog }) => {
  const state=useSelector(state=>state.isClicked)

  console.log(eachBlog);
  const [isLiked, setisLiked] = useState(false);
  const [isUnliked, setisUnliked] = useState(false);
  const [onCommentClicked, setonCommentClicked] = useState(false);
  const [onCommentInputText, setonCommentInputText] = useState("");
  const [showComment, setShowComment] = useState(false);

  const { username, blogText } = eachBlog;
  console.log(username, "username");

  const firstLetter = eachBlog.username.charAt(0).toUpperCase();

  useEffect(() => {
    const callCommentFun = async () => {
      if (showComment) {
        const url = `http://localhost:3004/comments/${eachBlog.B_Id}`;

        const apiCalling = await fetch(url);
        const apiRes = await apiCalling.json();
        console.log(apiRes,"api res s")
      }
    };
    callCommentFun()
  }, [showComment]);

  const onLikeButton = () => {
    // console.log(isLiked);
    setisLiked(!isLiked);
    if (isUnliked === true) {
      setisUnliked(!isUnliked);
    }
  };
  const onDislikeButton = () => {
    console.log(isUnliked);

    setisUnliked(!isUnliked);
    if (isLiked === true) {
      setisLiked(!isLiked);
    }
  };
  const onComment = () => {
    setonCommentClicked(!onCommentClicked);
  };

  const onCommentInput = (e) => {
    setonCommentInputText(e.target.value);
  };

  // api for sending comment data to backedn

  const OnCommentAdd = async () => {
    const interactionData = {
      commentText: onCommentInputText,
      loginUserName: Cookies.get("username"),
      blogId: eachBlog.B_Id,
      blogPostedUserName: eachBlog.username,
      isLiked,
      isUnliked,
    };
    console.log(eachBlog.B_Id, eachBlog.username);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(interactionData),
    };

    const postApi = "http://localhost:3004/interactionData";

    const apiRes = await fetch(postApi, options);

    console.log(apiRes, "apires");
  };

  const showCommentSection = async () => {
    setShowComment(!showComment);

    // make api call and get the all the comments to the respected post

    // const url=`http://localhost:3004/comments/${eachBlog.B_Id}`

    // const apiCalling=await fetch(url)
    // const apiRes=await apiCalling.json()
    // console.log(eachBlog)
  };

  return (
    <div className={state?"post-container-element-off":"post-container-element"}>
    <span className="blog-title">{eachBlog?.blog_Title}</span>
      <p className="blog-text-para">{eachBlog.blogText}</p>
      <div className="name-letter-alignment">
        <span className="first-letter">{firstLetter}</span>
        <span className="span-post-icons username-post">{username}</span>
        <span className="span-post-icons" onClick={onLikeButton}>
          {/* {" "} */}
          {isLiked ? <AiFillLike /> : <AiOutlineLike />} Like
        </span>
        <span className="span-post-icons" onClick={onDislikeButton}>
          {isUnliked ? <AiFillDislike /> : <AiOutlineDislike />} Unlike
        </span>
        <span className="span-post-icons" onClick={onComment}>
          <HiOutlineChatBubbleLeft /> Comment
        </span>
      </div>
      <div>
        {onCommentClicked && (
          <div>
            <input type="text" onChange={onCommentInput} />
            <button onClick={OnCommentAdd}>Add</button>
          </div>
        )}
      </div>
      {/* <div>
        <button onClick={showCommentSection}>Show Comments</button>
        {showComment && <Comments />}
      </div> */}
    </div>
  );
};

export default Posts;
