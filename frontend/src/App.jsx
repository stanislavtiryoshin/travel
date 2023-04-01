import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Hotel from "./pages/Hotel/Hotel";
import Order from "./pages/Order/Order";
import AddHotel from "./pages/AddHotel/AddHotel";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hotels/:hotelId" element={<Hotel />} />
          <Route path="/orders/new-order" element={<Order />} />
          <Route path="/dashboard/add-hotel" element={<AddHotel />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
