import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import "./App.css";
import Destination from "./pages/Destination";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/destination/:name" element={<Destination />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;