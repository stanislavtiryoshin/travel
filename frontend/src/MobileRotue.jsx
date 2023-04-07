import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MobileLayout from "./moble/components/Layout/Layout";
import Loader from "./moble/components/Loader/Loader";

const MobileHome = lazy(() => import("./moble/pages/Home/Home"));

const MobileRotue = () => {
  return (
    <Suspense fallback={<Loader />}>
      <MobileLayout>
        <Router>
          <Routes>
            <Route path="/" element={<MobileHome />} />
          </Routes>
        </Router>
      </MobileLayout>
    </Suspense>
  );
};

export default MobileRotue;
