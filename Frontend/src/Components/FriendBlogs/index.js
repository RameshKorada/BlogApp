import {useSelector} from "react-redux"
import "./index.css";


const FriendsData = ({ eachBlog }) => {
  const isClicked=useSelector(state=>state.isClicked)
  return (
    <div className={isClicked?"friend-blog-off":"friend-blog"}>
      <p>{eachBlog.blogText}</p>
    </div>
  );
};



export default FriendsData;
