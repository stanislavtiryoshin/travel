import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Home = lazy(() => import("./pages/Home/Home"));
const Register = lazy(() => import("./pages/Register/Register"));
const Login = lazy(() => import("./pages/Login/Login"));
const Hotel = lazy(() => import("./pages/Hotel/Hotel"));
const Order = lazy(() => import("./pages/Order/Order"));
const AddHotel = lazy(() => import("./pages/AddHotel/AddHotel"));
const AddTour = lazy(() => import("./pages/AddTour/AddTour"));
const AdminHotel = lazy(() => import("./pages/AddHotel/AdminHotel"));
const AddRoom = lazy(() => import("./pages/AddRoom/AddRoom"));
const AddCamp = lazy(() => import("./pages/AddCamp/AddCamp"));
const EditCamp = lazy(() => import("./pages/AddCamp/EditCamp"));
const EditTour = lazy(() => import("./pages/AddTour/EditTour"));
const AdminRoom = lazy(() => import("./pages/AddRoom/AdminRoom"));
const Table = lazy(() => import("./components/Table"));
const Requests = lazy(() => import("./pages/Requests/Requests"));
const Test = lazy(() => import("./pages/Test/Test"));

const DesktopRoute = () => {
  return (
    <Suspense fallback={<>Loading...</>}>
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

            <Route path="/test" element={<Test />} />
          </Routes>
        </Layout>
      </Router>
    </Suspense>
  );
};

export default DesktopRoute;
