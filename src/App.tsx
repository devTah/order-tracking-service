import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import NoMatch from "./pages/NoMatch";
import Layout from "./components/Layout";

// const About = React.lazy(() => import("./pages/About"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route
            path="about"
            element={
              <React.Suspense fallback={<>Loading...</>}>
                <About />
              </React.Suspense>
            }
          /> */}
          <Route
            path="/"
            element={
              <React.Suspense fallback={<>Loading...</>}>
                <Dashboard />
              </React.Suspense>
            }
          />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
