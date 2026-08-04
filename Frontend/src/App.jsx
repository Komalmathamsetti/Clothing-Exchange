import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Common/Home";
import Login from "./pages/Common/Login";
import Register from "./pages/Common/Register";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;