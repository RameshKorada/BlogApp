import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Profile from "../Profile";
import Cookies from "js-cookie";
import { useState } from "react";
import { MdOutlineNightlight } from "react-icons/md";
import { MdOutlineNightlightRound } from "react-icons/md";

import { useDispatch,useSelector } from "react-redux";


import "./index.css";

const Header = (props) => {
  const username = Cookies.get("username");
  const [showProfile, setshowProfile] = useState(false);
  const [canChangePassword, setcanChangePassword] = useState(false);
  const [backButton, setbackButton] = useState(false);
  const state=useSelector((state)=>state.isClicked)
  const profileImageState=useSelector((state)=>state.profileImage)
  console.log(state,"state value")

  const dispatcher=useDispatch()
  const onLogoutButton = () => {
    const usernameFromLocalstorage = Cookies.get("username");
    Cookies.remove(usernameFromLocalstorage);
    Cookies.remove("jwtToken");

    const { history } = props;
    history.replace("/login");

    // navigate("/")
  };

  const toggleProfile = () => {
    console.log(showProfile)
    setshowProfile(preState=>!preState)
    // this.setState((prevState) => ({
    //   showProfile: !prevState.showProfile,
    // }));
  };

  // changing password and username

  const changePassword = () => {
    setcanChangePassword(true)
    setbackButton(true)
    // this.setState({ canChangePassword: true, backButton: true });
  };

  const backButtonFun = () => {
    setcanChangePassword(false)
    setbackButton(false)
    // this.setState({ canChangePassword: false, backButton: false });
  };

  // on change color
  const onChangeColor=()=>{
    dispatcher({type:"change color",isClicked:!state})
    
    console.log("on chnage color")
  }

  return (
    <div className="header-main-contaner">
      <div className={state?"header-container-off":"header-container"}>
        <div className="logo-find-container">
          {/* <h1>Logo</h1> */}
          {/* <br /> */}
          <div>
            <img
              className="profile-image"
              // src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
              src={profileImageState}
              alt="profile"
              onClick={toggleProfile}
            />
          </div>
          <span>{username}</span>
          <button className="changeColorButton" onClick={onChangeColor}>{
            state? <MdOutlineNightlightRound color="black" />:
            <MdOutlineNightlightRound color="white" />
          }
         
          </button>
          
           
          
        </div>

        <div className="header-ul-container">
          <ul className="header-ul-container">
            <Link className="header-Buttons" to="/">
              <li className="header-li">Home</li>
            </Link>
            <Link className="header-Buttons" to="/myblogs">
              <li className="header-li">My Blogs</li>
            </Link>
            <Link className="header-Buttons" to="/postyourblog">
              <li className="header-li">Post Blog</li>
            </Link>
            <button className="header-Buttons" onClick={onLogoutButton}>
              <li className="header-li">Logout</li>
            </button>
          </ul>
        </div>
      </div>

      {showProfile && (
        <div className="profile-section">
          <Profile />
        </div>
      )}
    </div>
  );
};

// class Header extends Component {
//   state = {
//     showProfile: false,
//     canChangePassword: false,
//     backButton: false,
//     // Track whether to show profile section
//   };

// // using dispatcher

// dispatcher=useDispatch()

//   onLogoutButton = () => {
//     const usernameFromLocalstorage = Cookies.get("username");
//     Cookies.remove(usernameFromLocalstorage);
//     Cookies.remove("jwtToken");

//     const { history } = this.props;
//     history.replace("/login");
//   };

//   toggleProfile = () => {
//     this.setState((prevState) => ({
//       showProfile: !prevState.showProfile,
//     }));
//   };

//   // changing password and username

//   changePassword = () => {
//     this.setState({ canChangePassword: true, backButton: true });
//   };

//   backButtonFun = () => {
//     this.setState({ canChangePassword: false, backButton: false });
//   };

//   onChangeColor=()=>{
//     console.log("changed")
//     dispatcher({isClicked:true})
//   }

//   render() {
//     const {
//       findAfriend,
//       FriendsData,
//       showProfile,
//       canChangePassword,
//       backButton,
//     } = this.state;

//     const username = Cookies.get("username");
//     console.log(username);

//     return (
//       <div className="header-main-contaner">
//         <div className="header-container">
//           <div className="logo-find-container">
//             <h1>Logo</h1>
//             <br />
//             <div>
//               <img
//                 className="profile-image"
//                 src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
//                 alt="profile"
//                 onClick={this.toggleProfile}
//               />
//             </div>
//             <span>{username}</span>
//             <button onClick={this.onChangeColor}>Change Color</button>
//           </div>

//           <div className="header-ul-container">
//             <ul className="header-ul-container">
//               <Link className="header-Buttons" to="/">
//                 <li className="header-li">Home</li>
//               </Link>
//               <Link className="header-Buttons" to="/myblogs">
//                 <li className="header-li">My Blogs</li>
//               </Link>
//               <Link className="header-Buttons" to="/postyourblog">
//                 <li className="header-li">Post Blog</li>
//               </Link>
//               <button className="header-Buttons" onClick={this.onLogoutButton}>
//                 <li className="header-li">Logout</li>
//               </button>
//             </ul>
//           </div>
//         </div>

//         {showProfile && (
//           <div className="profile-section">
//             <Profile />
//           </div>
//         )}
//       </div>
//     );
//   }
// }

export default withRouter(Header);
