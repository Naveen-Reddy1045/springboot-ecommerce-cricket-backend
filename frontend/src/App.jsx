import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import BuyerOrders from './pages/BuyerOrders';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, AuthContext } from './context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="page-container glass"><div className="container">Loading...</div></div>;
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
     return <Navigate to="/" />; // fallback
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Buyer routes */}
            <Route path="/cart" element={
              <PrivateRoute><Cart /></PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute><Profile /></PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute><BuyerOrders /></PrivateRoute>
            } />
            
            {/* Seller routes */}
            <Route path="/seller" element={
              <PrivateRoute allowedRoles={['SELLER', 'ADMIN']}><SellerDashboard /></PrivateRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <PrivateRoute allowedRoles={['ADMIN']}><AdminDashboard /></PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
