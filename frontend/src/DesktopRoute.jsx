import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Hotel from "./pages/Hotel/Hotel";
import Order from "./pages/Order/Order";
import AddHotel from "./pages/AddHotel/AddHotel";

import AddTour from "./pages/AddTour/AddTour";
import EditHotel from "./pages/AddHotel/EditHotel";
import AddRoom from "./pages/AddRoom/AddRoom";
import AddCamp from "./pages/AddCamp/AddCamp";
import EditCamp from "./pages/AddCamp/EditCamp";
import EditTour from "./pages/AddTour/EditTour";
import AdminRoom from "./pages/AddRoom/AdminRoom";
import Table from "./components/Table";
import Requests from "./pages/Requests/Requests";
import Test from "./pages/Test/Test";
import Tour from "./pages/Tour/Tour";
import Camp from "./pages/Camp/Camp";
import AddSanatorium from "./pages/AddSanatorium/AddSanatorium";
import EditSanatorium from "./pages/AddSanatorium/EditSanatorium";
import Manager from "./pages/Manager/Manager";

// const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
// const Home = lazy(() => import("./pages/Home/Home"));
// const Register = lazy(() => import("./pages/Register/Register"));
// const Login = lazy(() => import("./pages/Login/Login"));
// const Hotel = lazy(() => import("./pages/Hotel/Hotel"));
// const Order = lazy(() => import("./pages/Order/Order"));
// const AddHotel = lazy(() => import("./pages/AddHotel/AddHotel"));
// const AddTour = lazy(() => import("./pages/AddTour/AddTour"));
// const AdminHotel = lazy(() => import("./pages/AddHotel/AdminHotel"));
// const AddRoom = lazy(() => import("./pages/AddRoom/AddRoom"));
// const AddCamp = lazy(() => import("./pages/AddCamp/AddCamp"));
// const EditCamp = lazy(() => import("./pages/AddCamp/EditCamp"));
// const EditTour = lazy(() => import("./pages/AddTour/EditTour"));
// const AdminRoom = lazy(() => import("./pages/AddRoom/AdminRoom"));
// const Table = lazy(() => import("./components/Table"));
// const Requests = lazy(() => import("./pages/Requests/Requests"));
// const Test = lazy(() => import("./pages/Test/Test"));

const DesktopRoute = () => {
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

          <Route path="/dashboard/add-sanatorium" element={<AddSanatorium />} />
          <Route
            path="/dashboard/sanatorium/:sanatoriumId"
            element={<EditSanatorium />}
          />

          <Route path="/dashboard/hotel/:hotelId" element={<EditHotel />} />
          <Route
            path="/dashboard/hotel/:hotelId/add-room"
            element={<AddRoom />}
          />
          {/* edit room */}
          <Route path="/dashboard/room/:roomId" element={<AdminRoom />} />

          {/* <Route path="/tour/:sanatoriumId" element={<Tour />} /> */}
          <Route path="/tour/:tourId" element={<Tour />} />
          <Route path="/camp/:campId" element={<Camp />} />
          <Route path="/dashboard/managers" element={<Manager />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default DesktopRoute;
