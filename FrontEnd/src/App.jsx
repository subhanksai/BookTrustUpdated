// App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./Pages/Navbar"; // Import Navbar component
import Form from "./Pages/Home"; // Your Main page component
import FetchDataForm from "./Pages/FetchDataForm"; // Fetch page component
import "./CSS/main.css";
import UpdateForm from "./Pages/UpdateForm";
import BalancePage from "./Pages/BalancePage";

function App() {
  return (
    <Router>
      {" "}
      {/* Wrap your app with Router to enable routing */}
      <Navbar /> {/* This will be available across all pages */}
      <div className="container container-fluid  body  m-5 ms-0 me-0 ">
        {" "}
        {/* Main container */}
        <Routes>
          {" "}
          {/* Define routes */}
          <Route path="/" element={<Form />} /> {/* Main Page Route */}
          <Route path="/fetch" element={<FetchDataForm />} />{" "}
          {/* Fetch Data Page Route */}
          <Route path="/update" element={<UpdateForm />} />{" "}
          {/* Update Page Route */}
          <Route path="/balance" element={<BalancePage />} />{" "}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
