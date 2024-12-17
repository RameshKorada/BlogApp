const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");

const cors = require("cors");

app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");



const dbPath = path.join(__dirname, "userData.db");
let db = null;

const { v4: uuid } = require("uuid");

// db connection and server start

// console.com

initializngDbandStartTheServer = async () => {
  console.log("asdssda");
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3004, () => {
      console.log("server running at 3004 port");
    });
  } catch (e) {
    console.log(e.message);
  }
};

initializngDbandStartTheServer();

// user login api
app.post("/login", async (req, res) => {
  const dataFromForm = req.body;
  const { username, password } = dataFromForm;
  console.log("asds");

  try {
    //verifying username and password

    const gettingUsernameAndPasswordDetails = `SELECT * FROM usersRegister WHERE username = '${username}'`;

    const requestingToDb = await db.all(gettingUsernameAndPasswordDetails);
    const gettingUserPassword = requestingToDb[0];
    console.log(requestingToDb);
    if (requestingToDb.length === 0) {
      res
        .status(401)
        .json({ error: "User not existed,Please create an account" });
    } else if (requestingToDb.length === 1) {
      const passwordFromBackEnd = gettingUserPassword.password;
      if (passwordFromBackEnd === password) {
        console.log("yes correct");
        const jwtToken = jwt.sign({ username }, "asd");
        res.status(200).send({ jwtToken });
      } else {
        res.status(401).send({ error: "Password Incorrect" });
      }
    }
    // }else{
    //     const passwordFromBackEnd=gettingUserPassword.password

    //     console.log(passwordFromBackEnd)
    //     res.status(401).json({error:"Password Incorrect"})
    // }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// USER REGISTER DATA INSERTNG INTO DB
app.post("/signup", async (req, res) => {
  const { name, username, password, email } = req.body;
  const gettingRows = `SELECT * FROM usersRegister;`;
  const lastRowCount = await db.all(gettingRows);
  let id = lastRowCount.length + 1;
  const insertingRegisterUserDetailsQuery = `INSERT INTO usersRegister 
    (id,name,username,email,password) VALUES 
    (${id},'${name}','${username}','${email}','${password}'); `;

  const insertingNewUser = await db.run(insertingRegisterUserDetailsQuery);

  console.log(lastRowCount.length);
});

app.get("/home", async (req, res) => {
  // res.header("Access-control-allow-origin","http://localhost:3000")
  const pullingData = `SELECT * FROM usersRegister;`;
  const data = await db.all(pullingData);
  const date = new Date();
  res.send(data);
});

// inserting blogs data into blogsData table
app.post("/postyourblogToBackEnd", async (req, res) => {
  //   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    const { blogText, username,blogTitle} = req.body;
    console.log(blogText, username,blogTitle);
    let blog_id = uuid();
    console.log(blogTitle,'blogTitle');

    const selectQueryForInsertingBlogText = `INSERT INTO blogsData (username,blogText,B_Id,blog_Title) VALUES ('${username}','${blogText}','${blog_id}','${blogTitle}');`;

    const insertingIntoBlogsDataTable = await db.run(
      selectQueryForInsertingBlogText
    );
    console.log(insertingIntoBlogsDataTable, "its inserted");
  } catch (error) {
    console.log(error.message);
  }
});

// sending blogs data from blogsData table to front end
// http://localhost:3004/myblogs/?username=${username}  myblogs/?username=${username}

app.get("/myblogs/:username/", async (req, res) => {
  const { username } = req.params;
  console.log(username, "username");

  try {
    const blogsQuery = `SELECT * FROM blogsData where username ='${username}';`;
    const gettingBlogsDataFromDB = await db.all(blogsQuery);
    //console.log(gettingBlogsDataFromDB)
    res.status(200).send(JSON.stringify(gettingBlogsDataFromDB));
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// all blogs data for displyaing in Home container

app.get("/allblogsdata/:username", async (req, res) => {
  const { username } = req.params;

  const selectingBlogsData = `SELECT * FROM blogsData where username!='${username}'`;

  try {
    const dbReqest = await db.all(selectingBlogsData);
    res.status(200).send(JSON.stringify(dbReqest));
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// deleting the blog
app.delete("/deleteblog/:blog_id", async (req, res) => {
  try {
    const { blog_id } = req.params;
    console.log(blog_id, req.params);
    const deletingBlog = `Delete from blogsData where B_Id ='${blog_id}'`;
    const dbresponce = await db.run(deletingBlog);
    res
      .status(200)
      .send(JSON.stringify({ response: "Blog Deleted Successfully" }));
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

// find a friend by search

app.get("/searchafriend/:search_friend", async (req, res) => {
  try {
    const { search_friend } = req.params;

    const searchQuery = `select * from usersRegister where username like '%${search_friend}%'`;
    const searchRes = await db.all(searchQuery);
    res.status(200).send(JSON.stringify(searchRes));
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

// password chaning

// app.post("/changepassword", async(req,res)=>{

//     try{
//         const passwordObject=req.body
//         const oldPass=passwordObject.oldPassword
//         console.log('change passwords')

//        // checking old password correct or wrong
//         const queryForOldPassword=`select * from usersRegister'`
//         // const dbRes=await db.get(queryForOldPassword)

//         // if (dbRes){
//         //     console.log(dbRes,'asdssaas')
//         // }
//         // console.log(dbRes,'db res')
//         res.status(200).send(JSON.stringify('asdsa'))

//     }catch{
//         res.status(500).json({ error: 'Failed to change password' });
//     }
// })

//

app.post("/changepassword", async (req, res) => {
  try {
    const { oldPassword, newPassword, reEnterNewPassword, username } = req.body;
    const dbquery = `select * from usersRegister where password='${oldPassword}' and username='${username}'`;
    const dbResult = await db.get(dbquery);
    // console.log(dbResult)
    if (dbResult === undefined) {
      //    console.log("sassdsa")
      return res
        .status(401)
        .send(JSON.stringify({ error: "Incorrect Old Password" }));
    }

    if (newPassword === reEnterNewPassword) {
      const dbquerychangepass = `update usersRegister set password='${newPassword}' where username='${username}'`;
      const dbrespasschange = await db.run(dbquerychangepass);
      //    console.log(dbrespasschange,'db res change')
      res
        .status(200)
        .send(JSON.stringify({ message: "Password Changes successfully." }));
    } else {
      res
        .status(401)
        .send(JSON.stringify({ error: "Re enterted password is wrong." }));
    }
  } catch {
    res.status(500).send(JSON.stringify({ error: `password cant'b changed` }));
  }
});

// api for displaying the searched frined blogs data

app.get("/showfriendblogs/:friendusername", async (req, res) => {
  try {
    const { friendusername } = req.params;
    const queryForfriedBlogs = `select * from blogsData where username='${friendusername}'`;
    const dbrequestres = await db.all(queryForfriedBlogs);
    res.status(200).send(JSON.stringify(dbrequestres));
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

// friend request app

app.post("/followrequest", async (req, res) => {
  const { followReqestedUserName, requestedUsername } = req.body;
  console.log(followReqestedUserName, requestedUsername, req.body);
  let follow_Id = uuid();

  try {
    const insertQuery = `INSERT INTO followRequest
        (id,followReqestedUserName,requestedUsername)
        VALUES
        ('${follow_Id}','${followReqestedUserName}','${requestedUsername}')`;

    const dbRequest = await db.run(insertQuery);
    if (dbRequest) {
      res.status(200).send({ message: "Requested Successfully" });
    } else {
      res.status(401).send({ message: "Failed to Requested" });
    }
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

//follow request back

app.post("/followrequestback", async (req, res) => {
  const { followReqestedUserName, requestedUsername } = req.body;
  console.log(followReqestedUserName, requestedUsername, req.body);
  let follow_Id = uuid();

  try {
    const insertQuery = `INSERT INTO followRequest
        (id,followReqestedUserName,requestedUsername,isRequestedBack)
        VALUES
        ('${follow_Id}','${followReqestedUserName}','${requestedUsername}','true')`;

    const dbRequest = await db.run(insertQuery);
    if (dbRequest) {
      res.status(200).send({ message: "Requested Successfully" });
    } else {
      res.status(401).send({ message: "Failed to Requested" });
    }
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/followrequestChecking/:username/:loginUsername", async (req, res) => {
  const { username, loginUsername } = req.params;

  const queryForGettingData = `SELECT * FROM followRequest where requestedUsername='${username}' and followReqestedUserName='${loginUsername}'`;

  const dbReqest = await db.all(queryForGettingData);

  try {
    if (dbReqest) {
      res.status(200).send(JSON.stringify(dbReqest));
    } else {
      console.log(dbReqest);
      res.status(200).send(JSON.stringify([]));
    }
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/friendrequest/:username", async (req, res) => {
  const { username } = req.params;
  console.log(username);
  try {
    const queryForGettingAllFriendRequest = `SELECT * FROM followRequest WHERE requestedUsername='${username}'`;
    const dbRequest = await db.all(queryForGettingAllFriendRequest);
    if (dbRequest.length > 0) {
      res.status(200).send(JSON.stringify(dbRequest));
    } else {
      res.status(200).send(JSON.stringify(dbRequest));
    }
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/friendrequestaccepted/", async (req, res) => {
  const { requestedUsername, loginUsername } = req.body;
  console.log(requestedUsername, loginUsername);

  try {
    const queryForAccecptRequest = `
     UPDATE followRequest SET isRequestAccept='${true}'
     WHERE requestedUsername='${loginUsername}' 
     and followReqestedUserName='${requestedUsername}' `;

    const dbRequest = await db.run(queryForAccecptRequest);
    console.log(dbRequest);

    res.status(200).send(JSON.stringify({ message: "Accepted" }));
  } catch {
    res.status(500).send("Internal Server Error");
  }
});
// const QueryForAcceptedFriendData=`SELECT * FROM followRequest WHERE requestedUsername='${loginUsername}'
//  and followReqestedUserName='${requestedUsername}' `
// const dbRequestData=await db.all(QueryForAcceptedFriendData)

app.get(
  "/afteruseraccepctrequest/:loginusername/:requestedUsername/",
  async (req, res) => {
    const { loginusername, requestedUsername } = req.params;
    console.log(loginusername, requestedUsername);
    try {
      const queryForafteruseraccepctrequest = `SELECT * FROM followrequest
         WHERE requestedUsername='${loginusername}' 
        AND followReqestedUserName='${requestedUsername}' `;

      const dbReqest = await db.all(queryForafteruseraccepctrequest);
      console.log(dbReqest);
      res.status(200).send(JSON.stringify(dbReqest));
    } catch {
      res.status(500).send("Internal Server Error");
    }
  }
);

// interaction data for each blog likes , dislikes and comments

app.post("/interactionData", async (req, res) => {
  const {
    commentText,
    loginUserName,
    blogPostedUserName,
    isLiked,
    isUnliked,
    blogId,
  } = req.body;
  console.log(blogId);
  // const blogId=uuid()

  const time = new Date();
  console.log(time);

  const insertingQuery = `
    INSERT INTO PostInteraction (
    blogID, isUserLiked, isUserUnliked, isUserCommented, loginUserID, likedUserID,BlogPostedUserId,commentTime)
    VALUES
    ('${blogId}','${isLiked}','${isUnliked}','${commentText}','${loginUserName}','${loginUserName}','${blogPostedUserName}','${time}');
`;

  const dbRun = await db.run(insertingQuery);
  console.log(req.body, "hey buddy");

  res.send(dbRun);
});

// get all the comments belongs to each comment
app.get("/comments/:blogId", async (req, res) => {
  const {blogId} = req.params;
  console.log(blogId, "bg id is");

const queryForGetAllComments = `
SELECT * FROM PostInteraction WHERE blogId = '${blogId}';
`

const dbReq=await db.all(queryForGetAllComments)
console.log(dbReq,'db res')
  res.send(JSON.stringify(dbReq));
});
