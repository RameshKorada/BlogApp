import { Component } from "react";
import { Redirect } from "react-router-dom";
import Posts from "../Posts/app";
import { FaSearch } from "react-icons/fa";
import SearchHistory from "../SearchHistory";
import SelectedFriendProfile from "../SelectedFriendProfile";
//import Comments from "../Comments/app";
import Header from "../Header";
import Cookies from "js-cookie";
import { BsEmojiNeutral } from "react-icons/bs";
import { BsEmojiHeartEyes } from "react-icons/bs";
import { MdCancel } from "react-icons/md";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
console.log("hell home")

import "./index.css";

class Home extends Component {
  state = {
    backendData: "",
    blogsDataList: [],
    findAfriend: "",
    FriendsData: [],
    isFriendSelected: false,
    selectedFriendData: {},
    isFriendChanged: false,
    getFriendRequest: false,
    friendRequestList: [],
    isReqestIconClicked: false,
    isTheUserRequestedYou: false,
    isAcceptButtonClickedHome: false,
    filterDataInput: "",
  };

  componentDidMount() {
    // console.log("component did mount calling")

    if (Cookies.get("jwtToken")) {
      this.blogsDataFromtheBackend();
      this.friendRequestApi();
    }
  }

  updateBlogsDataToList = (blogsData) => {
    this.setState({ blogsDataList: blogsData });
  };

  blogsDataFromtheBackend = async () => {
    const username = Cookies.get("username");
    const { blogsDataList } = this.state;

    const apiurl = `http://localhost:3004/allblogsdata/${username}`;
    const jsonBlogsData = await fetch(apiurl);

    try {
      if (jsonBlogsData.status === 200 && blogsDataList.length === 0) {
        const blogsData = await jsonBlogsData.json();
        // this.updateBlogsDataToList(blogsData)
        this.setState({ blogsDataList: blogsData });
        this.setState({ allBlogsData: blogsData });

        console.log(blogsData, "im calling again and again");
      }
    } catch (error) {}
  };

  findaFriendInputFiled = (e) => {
    const findAfriend = e.target.value;
    this.setState(
      { findAfriend, isReqestIconClicked: false },
      this.findingAFriend
    );
  };

  findingAFriend = async () => {
    const { findAfriend } = this.state;
    if (findAfriend.length > 0) {
      const apiurl = `http://localhost:3004/searchafriend/${findAfriend}`;
      const apires = await fetch(apiurl);
      const resData = await apires.json();
      //    console.log(resData);
      if (apires.status === 200) {
        this.setState({ FriendsData: resData });
      }
    } else {
      this.setState({ FriendsData: [], isFriendSelected: false });
    }
  };

  isFriendSelectedFun = (selectedFriend) => {
    // console.log(selectedFriend,'selected friend')
    this.setState({ isFriendSelected: true });
    this.setState({ selectedFriendData: selectedFriend });
    this.setState({ isFriendChanged: true });
    // this.setState({ isAcceptButtonClickedHome:false})
    const { friendRequestList } = this.state;
    //console.log(friendRequestList,selectedFriend)
    const filterFriendRequest = friendRequestList.filter(
      (each) => each.followReqestedUserName === selectedFriend.username
    );
    // console.log(filterFriendRequest,'filterFriendRequest')
    if (filterFriendRequest.length === 1) {
      this.setState({ isTheUserRequestedYou: true });
    } else {
      this.setState({ isTheUserRequestedYou: false });
    }
  };

  onPostClicked = (clicked) => {
    this.setState({ isFriendChanged: clicked });
  };

  // cheking friend request

  friendRequestApi = async () => {
    const username = Cookies.get("username");

    const api = `http://localhost:3004/friendrequest/${username}`;
    const apiResponce = await fetch(api);

    const parsedData = await apiResponce.json();

    //console.log(parsedData,'all friends requests')
    if (apiResponce.ok) {
      if (parsedData.length > 0) {
        //  console.log('yes it is calling')
        this.setState({ friendRequestList: parsedData });
        this.setState({ getFriendRequest: true });
      } else {
        this.setState({ getFriendRequest: false });
      }
    }
  };

  onRequestIconClicked = () => {
    this.setState((prev) => ({
      isReqestIconClicked: !prev.isReqestIconClicked,
    }));
  };

  // when user clicks on friend request username

  onFriendRequestName = (friendRequestData) => {
    //console.log("on friend request name",friendRequestData)
    let formatingSelectedFriendData = {
      username: friendRequestData.followReqestedUserName,
      isRequestedBack: friendRequestData.isRequestedBack,
      isRequestAccept: friendRequestData.isRequestAccept,
    };
    this.setState({
      isFriendSelected: true,
      selectedFriendData: formatingSelectedFriendData,
      isFriendChanged: true,
      isTheUserRequestedYou: true,
      isAcceptButtonClickedHome: false,
    });
  };

  // on onAcceptButtonHome clicked
  onAcceptButtonHome = (friendRequestData) => {
    let formatingSelectedFriendData = {
      username: friendRequestData.followReqestedUserName,
      isRequestedBack: friendRequestData.isRequestedBack,
      isRequestAccept: friendRequestData.isRequestAccept,
    };

    this.setState({
      isAcceptButtonClickedHome: true,
      isFriendSelected: true,
      selectedFriendData: formatingSelectedFriendData,
      isFriendChanged: true,
      isTheUserRequestedYou: true,
    });
  };

  // function to update the friends list data autometically after user click on accept button

  afterClickOnAcceptButton = () => {
    this.friendRequestApi();
  };

  findaBlog = (e) => {
    console.log(e.target.value);
    const { blogsDataList, allBlogsData } = this.state;

    this.setState({ filterDataInput: e.target.value });
    // if (e.target.value.length>=0){
    //   const filterData=blogsDataList.filter(each=>each.blogText.includes(e.target.value))
    //   console.log(filterData,'f')
    //   this.setState({blogsDataList:filterData})
    // }else{
    //   this.setState({blogsDataList:allBlogsData})

    //   console.log('else',allBlogsData)
    // }
  };

  render() {
    const { isClicked } = this.props; // Access state mapped to props
    console.log("isClicked called", isClicked);

    const jwtToken = Cookies.get("jwtToken");
    // console.log(jwtToken)

    if (jwtToken === undefined) {
      return <Redirect to="/login" />;
      //console.log("asd")
    }

    const {
      blogsDataList,
      findAfriend,
      FriendsData,
      isFriendSelected,
      selectedFriendData,
      isFriendChanged,
      getFriendRequest,
      friendRequestList,
      isReqestIconClicked,
      isTheUserRequestedYou,
      isAcceptButtonClickedHome,
      filterDataInput,
    } = this.state;

    console.log(blogsDataList, "blogsDataList");
    console.log(friendRequestList, "fl");
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
              isClicked
                ? "search-profile-section-off"
                : "search-profile-section"
            }
          >
            <h1 className="find-your-buddy">Find Your Buddy</h1>

            <div className="find-container">
              <div className="find-container-mini">
                {" "}
                <input
                  type="text"
                  placeholder="Find a friend"
                  className="find-a-friend-input-field"
                  onChange={this.findaFriendInputFiled}
                  value={findAfriend}
                />
                <FaSearch
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                    fontSize: "28px",
                  }}
                  className="search-icon"
                  onClick={this.findingAFriend}
                />
              </div>
              {getFriendRequest ? (
                <div className="count-icon-container">
                  <BsEmojiHeartEyes
                    size={27}
                    className=""
                    onClick={this.onRequestIconClicked}
                  />
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
                    isFriendSelectedFun={this.isFriendSelectedFun}
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
                      onClick={() => this.onFriendRequestName(each)}
                    >
                      {each.followReqestedUserName}
                    </span>
                    <div className="accept-button-cancelContainer">
                      {/* <button className="Accept-button" onClick={()=>this.onAcceptButtonHome(each)} >Accept</button> */}
                      {each.isRequestAccept === "true" ? (
                        <button className="Accept-button">Follow Back</button>
                      ) : (
                        <button
                          className="Accept-button"
                          onClick={() => this.onAcceptButtonHome(each)}
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

          {/* {!isFriendSelected || FriendsData.length===0 ||findAfriend.length===0 ?   */}
          {!isFriendSelected ? (
            <div
              className={isClicked ? "home-container-off" : "home-container"}
            >
              <div className="post-container">
                <div className="search-input-container">
                  <h1 className="search-blog">Search Blog</h1>
                  <input className="searchBlog" onChange={this.findaBlog} />
                </div>
                {filterDataAndAllBlogs.length > 0 &&
                  filterDataAndAllBlogs.map((eachBlog) => (
                    <Posts eachBlog={eachBlog} />
                  ))}
              </div>
            </div>
          ) : (
            <div className="friend-profile-container">
              <SelectedFriendProfile
                findAfriend={findAfriend}
                onPostClicked={this.onPostClicked}
                selectedFriendData={selectedFriendData}
                isFriendChanged={isFriendChanged}
                isTheUserRequestedYou={isTheUserRequestedYou}
                isAcceptButtonClickedHome={isAcceptButtonClickedHome}
                afterClickOnAcceptButton={this.afterClickOnAcceptButton}
                isClicked={isClicked}
              />
            </div>
          )}
          {}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isClicked: state.isClicked,
});

export default connect(mapStateToProps)(Home);
