import { useState, useEffect } from "react";
import FriendsData from "../FriendBlogs";
import Cookies from "js-cookie";
import "./index.css";

const SelectedFriendProfile = ({
  selectedFriendData,
  isFriendChanged,
  onPostClicked,
  findAfriend,
  isTheUserRequestedYou,
  isAcceptButtonClickedHome,
  afterClickOnAcceptButton,
  isClicked,
}) => {
  console.log(selectedFriendData, "selected f data");
  const [showAllBlogs, setshowAllBlogs] = useState(false);
  const [frinedBlogsList, setfrinedBlogsList] = useState([]);
  const [followSuccessStatus, setfollowSuccessStatus] = useState(false);
  const [isRequestAccept, setisRequestAccept] = useState(false);
  const [showingUnFollow, setshowingUnFollow] = useState(false);

  //console.log(isTheUserRequestedYou,isRequestAccept,isAcceptButtonClickedHome)

  useEffect(() => {
    //  console.log('use Effect calling')

    if (isFriendChanged) {
      setshowAllBlogs(false);
      //  console.log('if')
    } else {
      setshowAllBlogs(true);
      //  console.log('else')
    }
    checkingFollowList();
    checkingFollowBackuserRequest();

    apiForAfterRequestAccept();

    if (isAcceptButtonClickedHome) {
      //  console.log(isAcceptButtonClickedHome,'is home')
      onAcceptFriend();
      //   apiForAfterRequestAccept()
    }

    if (selectedFriendData.isRequestedBack === "true") {
      console.log("inside");
      // setfollowSuccessStatus(false)
    }
  }, [isFriendChanged, selectedFriendData]); //isFriendSelectedFun

  const onViewPost = () => {
    setshowAllBlogs(true);
    onPostClicked(false);
    friendsBlogsData();
  };

  const friendsBlogsData = async () => {
    const api = `http://localhost:3004/showfriendblogs/${selectedFriendData.username}`;
    //   console.log(selectedFriendData.username)
    const apiResponce = await fetch(api);
    const apiData = await apiResponce.json();
    try {
      if (apiResponce.ok) {
        //  console.log(apiData)
        setfrinedBlogsList(apiData);
      }
    } catch {}
  };

  // follow button

  const onFollowButton = async () => {
    //   console.log(selectedFriendData.username)
    const username = Cookies.get("username");

    const followApi = `http://localhost:3004/followrequest`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        followReqestedUserName: username,
        requestedUsername: selectedFriendData.username,
      }),
    };
    const aprResponce = await fetch(followApi, options);
    if (aprResponce.ok) {
      checkingFollowList();
    }
  };

  // getting data of selected user, whether the user follow or not
  const checkingFollowList = async () => {
    const userName = selectedFriendData.username;
    const loginUsername = Cookies.get("username");
    // console.log('apidaa')

    const followApiChecking = `http://localhost:3004/followrequestChecking/${userName}/${loginUsername}`;
    const apiRequest = await fetch(followApiChecking);
    const apiResponceParsed = await apiRequest.json();
    console.log(apiResponceParsed, "res");

    if (apiRequest.ok) {
      if (apiResponceParsed.length === 1) {
        console.log("inside res");
        setfollowSuccessStatus(true);
        const isAccpeptedRequest = apiResponceParsed[0].isRequestAccept;
        if (isAccpeptedRequest === "true") {
          setshowingUnFollow(true);
        }
      } else {
        setshowingUnFollow(false);

        setfollowSuccessStatus(false);
      }
    }
  };

  // onFriendRequest Accept Button

  const onAcceptFriend = async () => {
    const postApi = "http://localhost:3004/friendrequestaccepted";
    const requestingData = {
      requestedUsername: selectedFriendData.username,
      loginUsername: Cookies.get("username"),
    };

    // console.log(requestingData)

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(requestingData),
    };
    const apiCalling = await fetch(postApi, options);
    if (apiCalling.ok) {
      apiForAfterRequestAccept();
    }
    // console.log(apiCalling,'api calling')
  };

  // api for gettting data to check the loggin user whether followed or not

  const apiForAfterRequestAccept = async () => {
    const loginUsername = Cookies.get("username");

    const api = `http://localhost:3004/afteruseraccepctrequest/${loginUsername}/${selectedFriendData.username}/`;

    const apiRequest = await fetch(api);
    const parsedData = await apiRequest.json();

    if (apiRequest.ok) {

      if (parsedData.length !== 0) {
        const isFollowRequestAcceptData = parsedData[0].isRequestAccept;
        console.log(isFollowRequestAcceptData);
        if (isFollowRequestAcceptData === "true") {
          afterClickOnAcceptButton();
          setisRequestAccept(true);
        } else {
         
          setisRequestAccept(false);
        }
      } else {
        setisRequestAccept(false);
      }
    }
  };

  // on follow back button
  const onFollowBackButton = async () => {
    const username = Cookies.get("username");
    const followApi = `http://localhost:3004/followrequestBack`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        followReqestedUserName: username,
        requestedUsername: selectedFriendData.username,
      }),
    };
    const aprResponce = await fetch(followApi, options);
    if (aprResponce.ok) {
      checkingFollowBackuserRequest();
    }
  };
  const checkingFollowBackuserRequest = async () => {
    const username = Cookies.get("username");
    const userName = selectedFriendData.username;
    const loginUsername = Cookies.get("username");
    const followApiChecking = `http://localhost:3004/followrequestChecking/${userName}/${loginUsername}`;
    const apiRequest = await fetch(followApiChecking);
    const apiResponceParsed = await apiRequest.json();
    console.log(apiResponceParsed, "res on followback button");
    if (apiRequest.ok) {
      if (apiResponceParsed.length === 1) {
        setfollowSuccessStatus(true);
        const isAccpeptedRequest = apiResponceParsed[0].isRequestAccept;
        if (isAccpeptedRequest === "true") {
          setshowingUnFollow(true);
        }
      } else {
        setshowingUnFollow(false);
        setfollowSuccessStatus(false);
      }
    }
  };

  return (
    <div className="SelectedFriendProfile">
      <div className="selected-friend-image-username-container">
        <div className="selected-friend-image-username">
          <img
            className="frined-profile-image"
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
            alt="profile"
          />
          <span>{selectedFriendData.username}</span>
        </div>
        {/* <div className="followers-container">
          <button className="follow">Followers</button>
          <button className="follow">Following</button>
          {followSuccessStatus ? (
            <div>
              {showingUnFollow ? (
                <button className="follow">UnFollow</button>
              ) : (
                <button className="follow">Requested</button>
              )}
            </div>
          ) : (
            <div>
              {!isTheUserRequestedYou && (
                <button className="follow" onClick={onFollowButton}>
                  Follow
                </button>
              )}
              {isTheUserRequestedYou && !isRequestAccept && (
                <button
                  className="follow accept-request"
                  onClick={onAcceptFriend}
                >
                  Accept Request
                </button>
              )}

              {(isRequestAccept || isAcceptButtonClickedHome) && (
                <button
                  className="follow accept-request"
                  onClick={onFollowBackButton}
                >
                  Follow Back
                </button>
              )}
            </div>
          )}
        </div> */}
        {
          <div>
          <button>
            Follow
          </button>
          </div>
        }
      </div>

      <br />
      <div>
        <button onClick={onViewPost} className="view-post-button" type="button">
          View Posts
        </button>
        {/* {isTheUserRequestedYou&&!isRequestAccept&&<button className='follow accept-request' onClick={onAcceptFriend}>Accept Request</button>} */}
        {/* {(isRequestAccept||isAcceptButtonClickedHome)&&<button className='follow accept-request' >Follow Back</button>} */}
      </div>
      <hr className="hr-line" />
      <div className="Friend-Blogs-Data">
        <div>
          {showAllBlogs && (
            <div>
              {frinedBlogsList.map((each) => (
                <FriendsData eachBlog={each} key={each.B_Id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedFriendProfile;
