import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Common/Home";
import Login from "./pages/Common/Login";
import Register from "./pages/Common/Register";
import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import CustomerProfile from "./pages/Customer/Profile";
import EditProfile from "./pages/Customer/EditProfile";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<CustomerDashboard/>}/>
        <Route path="/profile" element={<CustomerProfile/>}/>
        <Route path="/update-profile" element={<EditProfile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;