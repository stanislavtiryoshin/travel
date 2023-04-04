import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Hotel from "./pages/Hotel/Hotel";
import Order from "./pages/Order/Order";
import AddHotel from "./pages/AddHotel/AddHotel";
import Layout from "./components/Layout";
import AddTour from "./pages/AddTour/AddTour";
import AdminHotel from "./pages/AddHotel/AdminHotel";
import AddRoom from "./pages/AddRoom/AddRoom";
import AddCamp from "./pages/AddCamp/AddCamp";
import EditCamp from "./pages/AddCamp/EditCamp";
import EditTour from "./pages/AddTour/EditTour";
import AdminRoom from "./pages/AddRoom/AdminRoom";
import Table from "./components/Table";
import Requests from "./pages/Requests/Requests";

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

          <Route path="/dashboard/add-tour" element={<AddTour />} />
          <Route path="/dashboard/tour/:id" element={<EditTour />} />

          <Route path="/dashboard/add-camp" element={<AddCamp />} />
          <Route path="/dashboard/camp/:id" element={<EditCamp />} />

          <Route path="/dashboard/hotel/:hotelId" element={<AdminHotel />} />
          <Route
            path="/dashboard/hotel/:hotelId/add-room"
            element={<AddRoom />}
          />
          <Route path="/dashboard/room/:roomId" element={<AdminRoom />} />
          {/* <Route path="/dashboard/requests" element={<Requests />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
