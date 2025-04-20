import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/ProfileUser";
import About from "./pages/About";
import Faq from "./pages/Faq";
import Report from "./pages/Report";
import Myreport from "./pages/Myreport";
import ReportDetail from "./pages/Reportdetail";
import ChatApp from "./pages/ChatApp";
import ChatHistory from "./pages/ChatHistory";


const App = () => {
  return (
    <Router future={{ 
      v7_startTransition: true,
      v7_relativeSplatPath: true 
    }}>
      <div className="w-screen h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/chatapp" element={<ChatApp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />   
          <Route path="/report" element={<Report />} />
          <Route path="/my-reports" element={<Myreport />} />
          <Route path="/report/:id" element={<ReportDetail />} />
          <Route path="/chat-history" element={<ChatHistory />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;