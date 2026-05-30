import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Login from "./pages/login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import AddItem from "./pages/AddItem";
import ForgotPassword from "./pages/ForgotPassword";
import MyItems from "./pages/MyItems";
import EditItem from "./pages/EditItem";
import MyClaims from "./pages/MyClaims";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Pages WITHOUT Layout */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* Pages WITH Layout */}
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/add" element={<Layout><AddItem /></Layout>} />
        <Route path="/my-items" element={<MyItems />} />
        <Route path="/edit/:id" element={<EditItem />} />
        <Route path="/my-claims" element={<MyClaims />} />
        <Route path="/notifications" element={<Notifications />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;