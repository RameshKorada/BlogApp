import { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login/app";
import SignUpPage from "./Components/SignUpPage";
import NewBlog from "./Components/NewBlog/app";
import MyBlogs from "./Components/MyBlogs";
import "./App.css";

class App extends Component {
  // componentDidMount() {
  //   console.log("iam Component Did mount method");
  //   this.apiCallingFromBackEnd();
  // }

  // apiCallingFromBackEnd = async () => {
  //   const apicalling = await fetch("http://localhost:3007/");
  //   const dataParsing = await apicalling.json();
  //   console.log(dataParsing);
  // };

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/postyourblog" component={NewBlog} />
          <Route exact path="/myblogs" component={MyBlogs} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
