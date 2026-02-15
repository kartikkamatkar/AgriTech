import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import CropManagement from '../pages/CropManagement';
import MarketInsights from '../pages/MarketInsights';
import Resources from '../pages/Resources';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Community from '../pages/Community';
import PostDetail from '../pages/PostDetail';
import Chatbot from '../pages/Chatbot';
import GovernmentSchemes from '../pages/GovernmentSchemes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/crop-management" element={<CropManagement />} />
      <Route path="/market-insights" element={<MarketInsights />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/community" element={<Community />} />
      <Route path="/community/:postId" element={<PostDetail />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/schemes" element={<GovernmentSchemes />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
