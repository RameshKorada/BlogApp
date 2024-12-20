import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Posts from "../Posts/app";
import { FaSearch } from "react-icons/fa";
import SearchHistory from "../SearchHistory";
import SelectedFriendProfile from "../SelectedFriendProfile";
import Header from "../Header";
import Cookies from "js-cookie";
import { BsEmojiNeutral, BsEmojiHeartEyes } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import "./index.css";

const Home = () => {
  const [backendData, setBackendData] = useState("");
  const [blogsDataList, setBlogsDataList] = useState([]);
  const [findAfriend, setFindAfriend] = useState("");
  const [FriendsData, setFriendsData] = useState([]);
  const [isFriendSelected, setIsFriendSelected] = useState(false);
  const [selectedFriendData, setSelectedFriendData] = useState({});
  const [isFriendChanged, setIsFriendChanged] = useState(false);
  const [getFriendRequest, setGetFriendRequest] = useState(false);
  const [friendRequestList, setFriendRequestList] = useState([]);
  const [isReqestIconClicked, setIsReqestIconClicked] = useState(false);
  const [isTheUserRequestedYou, setIsTheUserRequestedYou] = useState(false);
  const [isAcceptButtonClickedHome, setIsAcceptButtonClickedHome] = useState(false);
  const [filterDataInput, setFilterDataInput] = useState("");
  const isClicked=useSelector((state)=>state.isClicked)


  useEffect(() => {
    if (Cookies.get("jwtToken")) {
      blogsDataFromtheBackend();
      friendRequestApi();
    }
  }, []);

  const blogsDataFromtheBackend = async () => {
    const username = Cookies.get("username");

    const apiurl = `http://localhost:3004/allblogsdata/${username}`;
    const response = await fetch(apiurl);

    if (response.status === 200) {
      const blogsData = await response.json();
      setBlogsDataList(blogsData);
    }
  };

  const findaFriendInputFiled = (e) => {
    const value = e.target.value;
    setFindAfriend(value);
    setIsReqestIconClicked(false);
    findingAFriend(value);
  };

  const findingAFriend = async (query) => {
    if (query.length > 0) {
      const apiurl = `http://localhost:3004/searchafriend/${query}`;
      const response = await fetch(apiurl);
      const resData = await response.json();

      if (response.status === 200) {
        setFriendsData(resData);
      }
    } else {
      setFriendsData([]);
      setIsFriendSelected(false);
    }
  };

  const isFriendSelectedFun = (selectedFriend) => {
    setIsFriendSelected(true);
    setSelectedFriendData(selectedFriend);
    setIsFriendChanged(true);

    const filterFriendRequest = friendRequestList.filter(
      (each) => each.followReqestedUserName === selectedFriend.username
    );

    setIsTheUserRequestedYou(filterFriendRequest.length === 1);
  };

  const friendRequestApi = async () => {
    const username = Cookies.get("username");

    const apiurl = `http://localhost:3004/friendrequest/${username}`;
    const response = await fetch(apiurl);
    const parsedData = await response.json();

    if (response.ok) {
      setFriendRequestList(parsedData);
      setGetFriendRequest(parsedData.length > 0);
    }
  };

  const onRequestIconClicked = () => {
    setIsReqestIconClicked((prev) => !prev);
  };

  const onFriendRequestName = (friendRequestData) => {
    setIsFriendSelected(true);
    setSelectedFriendData({
      username: friendRequestData.followReqestedUserName,
      isRequestedBack: friendRequestData.isRequestedBack,
      isRequestAccept: friendRequestData.isRequestAccept,
    });
    setIsFriendChanged(true);
    setIsTheUserRequestedYou(true);
    setIsAcceptButtonClickedHome(false);
  };

  const onAcceptButtonHome = (friendRequestData) => {
    setIsAcceptButtonClickedHome(true);
    setIsFriendSelected(true);
    setSelectedFriendData({
      username: friendRequestData.followReqestedUserName,
      isRequestedBack: friendRequestData.isRequestedBack,
      isRequestAccept: friendRequestData.isRequestAccept,
    });
    setIsFriendChanged(true);
    setIsTheUserRequestedYou(true);
  };

  const afterClickOnAcceptButton = () => {
    friendRequestApi();
  };

  const findaBlog = (e) => {
    setFilterDataInput(e.target.value);
  };

  const jwtToken = Cookies.get("jwtToken");
  if (!jwtToken) {
    return <Navigate to="/login" />;
  }

  const filterDataAndAllBlogs = blogsDataList.filter((each) =>
    each?.blog_Title?.includes(filterDataInput)
  );

  return (
    <>
      <div className="home-main-container">
        <Header />
      </div>
      <div className="HomeAndLeftsideSection">
        <div
          className={
            isClicked ? "search-profile-section-off" : "search-profile-section"
          }
        >
          <h1 className="find-your-buddy">Find Your Buddy</h1>
          <div className="find-container">
            <div className="find-container-mini">
              <input
                type="text"
                placeholder="Find a friend"
                className="find-a-friend-input-field"
                onChange={findaFriendInputFiled}
                value={findAfriend}
              />
              <FaSearch className="search-icon" onClick={() => findingAFriend(findAfriend)} />
            </div>
            {getFriendRequest ? (
              <div className="count-icon-container">
                <BsEmojiHeartEyes size={27} onClick={onRequestIconClicked} />
                <span className="count-span">{friendRequestList.length}</span>
              </div>
            ) : (
              <BsEmojiNeutral size={27} className="icon-no-reuest" />
            )}
          </div>

          {FriendsData.length > 0 && (
            <div
              className={
                isClicked
                  ? "friends-search-history-off"
                  : "friends-search-history"
              }
            >
              {FriendsData.map((each) => (
                <SearchHistory
                  key={each.id}
                  each={each}
                  isFriendSelectedFun={isFriendSelectedFun}
                />
              ))}
            </div>
          )}
          {isReqestIconClicked && (
            <div className="all-requests-container">
              {friendRequestList.map((each) => (
                <div className="each-request-container">
                  <span
                    className="request-username"
                    onClick={() => onFriendRequestName(each)}
                  >
                    {each.followReqestedUserName}
                  </span>
                  <div className="accept-button-cancelContainer">
                    {each.isRequestAccept === "true" ? (
                      <button className="Accept-button">Follow Back</button>
                    ) : (
                      <button
                        className="Accept-button"
                        onClick={() => onAcceptButtonHome(each)}
                      >
                        Accept
                      </button>
                    )}
                    <MdCancel size={25} className="cancel-icon" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isFriendSelected ? (
          <div className={isClicked ? "home-container-off" : "home-container"}>
            <div className="post-container">
              <div className="search-input-container">
                <h1 className="search-blog">Search Blog</h1>
                <input className="searchBlog" onChange={findaBlog} />
              </div>
              {filterDataAndAllBlogs.length > 0 &&
                filterDataAndAllBlogs.map((eachBlog) => (
                  <Posts eachBlog={eachBlog} />
                ))}
            </div>
          </div>
        ) : (
          <div className={isClicked?"friend-profile-container-off":"friend-profile-container"}>
            <SelectedFriendProfile
              findAfriend={findAfriend}
              onPostClicked={setIsFriendChanged}
              selectedFriendData={selectedFriendData}
              isFriendChanged={isFriendChanged}
              isTheUserRequestedYou={isTheUserRequestedYou}
              isAcceptButtonClickedHome={isAcceptButtonClickedHome}
              afterClickOnAcceptButton={afterClickOnAcceptButton}
              isClicked={isClicked}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
