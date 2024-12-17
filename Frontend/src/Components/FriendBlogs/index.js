import "./index.css";

const FriendsData = ({ eachBlog }) => {
  return (
    <div className="friend-blog">
      <p>{eachBlog.blogText}</p>
    </div>
  );
};



export default FriendsData;
