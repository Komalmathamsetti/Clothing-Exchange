import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Common/Home";
import Login from "./pages/Common/Login";
import Register from "./pages/Common/Register";
import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import CustomerProfile from "./pages/Customer/Profile";
import EditProfile from "./pages/Customer/EditProfile";
import AddClothing from "./pages/Customer/AddClothing";
import MyListings from "./pages/Customer/MyListings";
import EditClothing from "./pages/Customer/EditClothing";
import BrowseClothes from "./pages/Customer/BrowseClothes";
import ClothingDetails from "./pages/Customer/ClothingDetails";
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
        <Route path="/add-clothing" element={<AddClothing/>}/>
        <Route path="/my-listings" element={<MyListings/>}/>
        <Route path="/edit-clothing/:id" element={<EditClothing/>}/>
        <Route path="/browse-clothes" element={<BrowseClothes/>}/>
        <Route path="/clothing/:id" element={<ClothingDetails/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;