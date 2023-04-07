import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MobileLayout from "./moble/components/Layout/Layout";

const MobileHome = lazy(() => import("./moble/pages/Home/Home"));

const MobileRotue = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
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
