import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Hotel from "./pages/Hotel/Hotel";
import Footer from "./components/Footer/Footer";
import Order from "./pages/Order/Order";
import AddHotel from "./pages/AddHotel/AddHotel";
import AdminHotel from "./pages/AddHotel/AdminHotel";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hotels/:hotelId" element={<Hotel />} />
          <Route path="/orders/new-order" element={<Order />} />
          <Route path="/dashboard/add-hotel" element={<AddHotel />} />
          <Route path="/dashboard/hotel/:hotelId" element={<AdminHotel />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
