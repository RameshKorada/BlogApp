import { Component } from "react";
import { Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../Header";
import BlogsDisplaying from "../BlogsDisplaying";
import "./index.css";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";

class MyBlogs extends Component {
  state = { blogsData: [], isLoading: true };

  componentDidMount() {
    this.gettingBlogsDataFromBackend();
  }

  updateBlogsData = (blogsListData) => {
    this.setState({ blogsData: blogsListData });
  };

  gettingBlogsDataFromBackend = async () => {
    try {
      const username = Cookies.get("username");

      const apiUrl = `http://localhost:3004/myblogs/${username}`;

      const apicallingForGettingBlogsData = await fetch(apiUrl);
      // console.log(apicallingForGettingBlogsData)
      if (apicallingForGettingBlogsData.status === 200) {
        const data = await apicallingForGettingBlogsData.json();
        //  console.log(data,"ads")
        this.updateBlogsData(data);
        this.setState({ isLoading: false });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // function for delete the blog in backend
  deleteBlog = async (blog_id) => {
    console.log(blog_id);

    //sending request to backend for deleting the record.
    const apiUrl = `http://localhost:3004/deleteblog/${blog_id}`;
    const res = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);

    if (res.status === 200) {
      this.gettingBlogsDataFromBackend();
      console.log(res);
    }
  };

  noBlogsView = () => {
    return (
      <div className="no-blogs-view">
        <img
          className="no-blogs-view-image"
          src="https://assets.hongkiat.com/uploads/mobile-app-empty-state-designs/12-empty-state-mobile-app-designs.jpg"
          alt="No Blogs found"
        />
        <br />{" "}
        <Link to="/postyourblog" className="postyourblog_link">
          Please click on here for write a BLOG...
        </Link>
      </div>
    );
  };

  render() {
    const jwtToken = Cookies.get("jwtToken");
    const { blogsData, isLoading } = this.state;
    //  console.log('redirect')
    console.log(blogsData.length);
    if (jwtToken === undefined) {
      return <Redirect to="/login" />;
    }
    return (
      <div className="all-my-blogs-container">
        <div>
          <Header />
        </div>
        {isLoading ? (
          <div className="my-blogs-container">
            <ReactLoading
              type={"spin"}
              color={"#3498db"}
              height={"50px"}
              width={"50px"}
            />
          </div>
        ) : (
          <div className="my-blogs-container">
            {blogsData.length !== 0 ? (
              <div>
                {" "}
                {blogsData.map((eachBlog) => (
                  <BlogsDisplaying
                    eachBlog={eachBlog}
                    deleteBlog={this.deleteBlog}
                    key={eachBlog.B_id}
                  />
                ))}
              </div>
            ) : (
              <div>{this.noBlogsView()}</div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default MyBlogs;
