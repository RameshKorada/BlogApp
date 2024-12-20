import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login/app";
import SignUpPage from "./Components/SignUpPage";
import NewBlog from "./Components/NewBlog/app";
import MyBlogs from "./Components/MyBlogs";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/postyourblog" element={<NewBlog />} />
        <Route path="/myblogs" element={<MyBlogs />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
