
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BuyMedicine from "./pages/BuyMedicine";
import CustomerAuth from "./pages/CustomerAuth";
import PharmacyAuth from "./pages/PharmacyAuth";
import SelectPharmacy from "./pages/SelectPharmacy";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import { AuthProvider } from "./AuthContext";
import UserRequests from "./pages/UserRequests";
import Footer from "./component/Footer";
import Contact from "./pages/Contact";
import TestPopup from "./pages/TestPopup";
import About from "./pages/About";
import LoginChoice from "./pages/LoginChoice";
import ScrollToTop from "./component/ScrollToTop";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManagePharmacies from "./pages/ManagePharmacies";
import ManageCustomers from "./pages/ManageCustomers";
import ManageOrders from "./pages/ManageOrders";
import AdminRoute from "./AdminRoute";

function App() {
  return ( 
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/buy-medicine" element={<BuyMedicine />} />
          <Route path="/login" element={<LoginChoice />} />
          <Route path="/customer-auth" element={<CustomerAuth />} />
          <Route path="/pharmacy-auth" element={<PharmacyAuth />} />
          <Route path="/select-pharmacy" element={<SelectPharmacy />} />
          <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
          <Route path="/user-requests" element={<UserRequests />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test-popup" element={<TestPopup />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/pharmacies" element={<AdminRoute><ManagePharmacies /></AdminRoute>} />
          <Route path="/admin/customers" element={<AdminRoute><ManageCustomers /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;


