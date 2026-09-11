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
import SwapRequests from "./pages/Cloth Swaping pages/SwapingRequests";
import SwapHistory from "./pages/Cloth Swaping pages/SwapingHistory";
import Messages from "./pages/Common/Messages";
import NearbySwaps from "./pages/Cloth Swaping pages/NearbySwaps";
import ValueCalculator from "./pages/Cloth Swaping pages/valueCaluculator";
import DisputeDetails from "./pages/Cloth Swaping pages/DisputeDetails";
import MyDisputes from "./pages/Cloth Swaping pages/MyDisputes";
import RaiseDisputes from "./pages/Cloth Swaping pages/RaiseDisputes";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminListings from "./pages/Admin/AdminListings";
import AdminSwaps from "./pages/Admin/AdminSwaps";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AdminDisputes from "./pages/Admin/AdminDisputes";
import AdminDisputeDetails from "./pages/Admin/AdminDisputeDetails";
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
        <Route path="/swap-requests" element={<SwapRequests/>}/>
        <Route path="/history" element={<SwapHistory/>}/>
        <Route path="/messages" element={<Messages/>}/>
        <Route path="/nearby-swaps" element={<NearbySwaps/>}/>
        <Route path="/value-calculator" element={<ValueCalculator/>}/>
        <Route path="/raise-dispute" element={<RaiseDisputes />}/>
        <Route path="/disputes" element={<MyDisputes />}/>
        <Route path="/disputes/:id" element={<DisputeDetails />}/>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/users" element={<AdminUsers/>}/>
        <Route path="/admin/listings" element={<AdminListings/>}/>
        <Route path="/admin/swaps" element={<AdminSwaps/>}/>
        <Route path="/admin/analytics" element={<AdminAnalytics/>}/>
        <Route path="/admin/disputes" element={<AdminDisputes />}/>
        <Route path= "/admin/disputes/:id" element={<AdminDisputeDetails/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;