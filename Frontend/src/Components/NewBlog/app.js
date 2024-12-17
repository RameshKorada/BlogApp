import { Component } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
//import InteractContainer from "../InteractContainer/app"
import "./index.css";

class NewBlog extends Component {
  state = { blogText: "", blogLength: false, blogTitle:""};

  onTextArea = (event) => {
    this.setState({ blogText: event.target.value, blogLength: false });
  };

  onPostButtonClick = async () => {
    const { blogText , blogTitle} = this.state;
    //   console.log(blogText)
    const username = Cookies.get("username");
    //console.log(username,"me posted")
    const blogUrl = `http://localhost:3004/postyourblogToBackEnd`;



    const blogTextDetails = {
      blogText,
      username,
      blogTitle:blogTitle
    };

    const blogDetails = {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(blogTextDetails),
    };

    console.log(blogText.length,blogTitle);
    

    if (blogText.length > 300 && blogTitle.length>10) {
      this.setState({ blogLength: true });

      try {
        console.log(blogUrl, blogDetails);
        await fetch(blogUrl, blogDetails);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("length is less");
      this.setState({ blogLength: true });
    }
  };


  onBlogTitle=(e)=>{
    console.log(e.target.value)
    this.setState({blogTitle:e.target.value})

  }

  render() {
    const { blogLength, blogText,blogTitle } = this.state;
    const blogsPostStatus =
      blogText.length > 300 && blogTitle.length>10
        ? "Blog post Succesfully !!!"
        : "The blog should contain 300 characters, and the title should be limited to 10 characters !!!";
    return (
      <div>
        <Header />

        <div className="blogs-container">
          <div className="area-container">
            {/* <textarea rows={16}  cols={100} className="text-area-container" placeholder="Start Your Blog From Here..."/> */}
            <input placeholder="Enter Blog Title here..." onChange={this.onBlogTitle} value={blogTitle}/>
            <textarea
              onChange={this.onTextArea}
              className="text-area-container"
              placeholder="Start Your Blog From Here..."
              rows={16}
              cols={100}
            />
            <div className="post-button-container">
              <button
                onClick={this.onPostButtonClick}
                type="button"
                className="post-button"
              >
                POST
              </button>
            </div>
          
            {   blogLength && <p>{blogsPostStatus}</p>}
          </div>
          <div className="interact-blogs-containers">
            {/* <h1 className="post-title">Share your wonderfull experiences to all</h1>
                    
                 
                    <InteractContainer/>
                    
                    */}
          </div>
        </div>
      </div>
    );
  }
}

export default NewBlog;
