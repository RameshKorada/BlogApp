import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import "./index.css";

const Profile = ({ userName }) => {
  const [ChangePassword, setChangePassword] = useState(false);
  const [showHideProfile, setshowHideProfile] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterNewPassword, setReEnterNewPassword] = useState("");
  const [incorrectOldPassword, setIncorrectOldPassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successMessageValue, setsuccessMessageValue] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newpassLength, setnewpassLength] = useState(false);
  const [profileImage,setprofileImage]=useState("")

  const dispatcher=useDispatch()


  // useEffect(()=>{

  //     console.log('use effect')
  //     if (successMessageValue===true){
  //         const timer = setTimeout(() => {
  //             setSuccessMessage('');
  //             setChangePassword(false);
  //             setshowHideProfile(true);
  //         }, 3000);

  //         return () => clearTimeout(timer);

  //     }

  // })

  const onChangePassword = () => {
    setChangePassword(true);
    setshowHideProfile(false);
    setIncorrectOldPassword(false);
    setPasswordMismatch(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const onBackButton = () => {
    setChangePassword(false);
    setshowHideProfile(true);
    setIncorrectOldPassword(false);
    setPasswordMismatch(false);
    setSuccessMessage("");
    setErrorMessage("");
    setsuccessMessageValue(false);
    setOldPassword("");
    setNewPassword("");
    setReEnterNewPassword("");
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    console.log("yes cmng")
    console.log(newPassword, reEnterNewPassword, oldPassword);

    const postUrl = "http://localhost:3004/changepassword";
    const otherData = {
      oldPassword,
      newPassword,
      reEnterNewPassword,
      username: Cookies.get("username"),
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(otherData),
    };

    if (newPassword.length > 7) {
      setnewpassLength(false);

      try {
        const res = await fetch(postUrl, options);
        console.log(res);

        if (res.status === 200) {
          console.log("Password changed successfully");
          setSuccessMessage("Password changed successfully.");
          setsuccessMessageValue(true);
          setIncorrectOldPassword(false);
          setPasswordMismatch(false);
          setNewPassword("");
          setOldPassword("");
          setReEnterNewPassword("");
        } else if (res.status === 401) {
          const errorData = await res.json();
          console.log(errorData);
          if (errorData.error === "Incorrect Old Password") {
            setErrorMessage("Incorrect Old Password");
            setIncorrectOldPassword(true);
            setPasswordMismatch(false);
            setSuccessMessage("");
            setsuccessMessageValue(false);
          } else if (errorData.error === "Re enterted password is wrong.") {
            console.log("re enter pass");
            setErrorMessage("Passwords do not match");
            setPasswordMismatch(true);
            setIncorrectOldPassword(false);
            setSuccessMessage("");
            setsuccessMessageValue(false);
          }
        } else {
          setErrorMessage("Password change failed");
          setIncorrectOldPassword(true);
          setPasswordMismatch(true);
          setsuccessMessageValue(false);
        }
      } catch (error) {
        console.error("Error fetching:", error);
        setErrorMessage("Network error occurred, please try again.");
        setIncorrectOldPassword(true);
        setPasswordMismatch(true);
      }
    } else {
      console.log("else")
      setnewpassLength(true)
    }
  };

  const onEnterOldPassword = (e) => {
    setOldPassword(e.target.value);
  };

  const onEnterNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const onReEnterNewPassword = (e) => {
    setReEnterNewPassword(e.target.value);
  };

  const onProfileIcon=(e)=>{
    
    const file = e.target.files[0]; // Get the selected file
    console.log(file,'file')
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a temporary URL for the file
      setprofileImage(imageUrl);
      dispatcher({type:"ProfileImage", value:imageUrl})
    }

  }

  return (
    <div>
      {showHideProfile && (
        <div>
          <h2>Profile Section</h2>
          <input type="file" onChange={onProfileIcon}/>
          {/* <img src={profileImage}/> */}
          <p>Username: {Cookies.get("username")}</p>
          <p>Email: example@example.com</p>
          <button onClick={onChangePassword}>Change Password?</button>
        </div>
      )}

      {ChangePassword && (
        <div>
          <form className="changePassword-form" onSubmit={onSubmitForm}>
            <input
              className="password-filed"
              value={oldPassword}
              onChange={onEnterOldPassword}
              type="password"
              placeholder="Enter your old password"
            />
            <br />
            {incorrectOldPassword && <span>{errorMessage}</span>}
            <input
              className="password-filed"
              value={newPassword}
              onChange={onEnterNewPassword}
              type="password"
              placeholder="Enter New Password"
            />
            <br />
            <input
              className="password-filed"
              value={reEnterNewPassword}
              onChange={onReEnterNewPassword}
              type="password"
              placeholder="Re-Enter New Password"
            />
            <br />
            {passwordMismatch && <span>{errorMessage}</span>}
            <br />
            {successMessageValue && <span>{successMessage}</span>}
            <br />
            <button className="back-submit-Button" onClick={onBackButton}>
              Back
            </button>
            <button className="back-submit-Button" type="submit">
              Submit
            </button>
            {newpassLength && (
              <span>Password must be more than 7 characters...</span>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
