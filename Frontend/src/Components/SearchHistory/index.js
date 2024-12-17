import "./index.css";

const SearchHistory = ({ each, isFriendSelectedFun }) => {
  const onFriendSelect = () => {
    isFriendSelectedFun(each);
  };

  //console.log(each)
  return (
    <div className="friends-search-container">
      <p className="friends-history-name">
        <button
          className="friends-history-name-button"
          onClick={onFriendSelect}
        >
          {/* {" "} */}
          {each.username}
        </button>
      </p>
    </div>
  );
};

export default SearchHistory;
