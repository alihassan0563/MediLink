import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [pharmacy, setPharmacy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  // Function to validate token and get user data
  const validateToken = async (token, userType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${userType}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        // Token is invalid, remove from localStorage
        localStorage.removeItem(`${userType}_token`);
        localStorage.removeItem(`${userType}_user`);
        return null;
      }
    } catch (error) {
      console.error(`Error validating ${userType} token:`, error);
      // On network error, remove invalid tokens
      localStorage.removeItem(`${userType}_token`);
      localStorage.removeItem(`${userType}_user`);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const customerToken = localStorage.getItem("customer_token");
        const pharmacyToken = localStorage.getItem("pharmacy_token");
        const adminToken = localStorage.getItem("admin_token");
        
        // Validate tokens and get fresh user data
        if (customerToken) {
          const customerData = await validateToken(customerToken, 'customer');
          if (customerData) {
            setCustomer(customerData);
            // Update localStorage with fresh data
            localStorage.setItem("customer_user", JSON.stringify(customerData));
          }
        }
        
        if (pharmacyToken) {
          const pharmacyData = await validateToken(pharmacyToken, 'pharmacy');
          if (pharmacyData) {
            setPharmacy(pharmacyData);
            // Update localStorage with fresh data
            localStorage.setItem("pharmacy_user", JSON.stringify(pharmacyData));
          }
        }

        if (adminToken) {
          const adminData = await validateToken(adminToken, 'admin');
          if (adminData) {
            setAdmin(adminData);
            localStorage.setItem("admin_user", JSON.stringify(adminData));
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loginCustomer = (user, token) => {
    // Clear pharmacy session if exists (mutual exclusion)
    if (pharmacy) {
      localStorage.removeItem("pharmacy_token");
      localStorage.removeItem("pharmacy_user");
      setPharmacy(null);
    }
    if (admin) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      setAdmin(null);
    }
    localStorage.setItem("customer_token", token);
    localStorage.setItem("customer_user", JSON.stringify(user));
    setCustomer(user);
  };

  const loginPharmacy = (user, token) => {
    // Clear customer session if exists (mutual exclusion)
    if (customer) {
      localStorage.removeItem("customer_token");
      localStorage.removeItem("customer_user");
      setCustomer(null);
    }
    if (admin) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      setAdmin(null);
    }
    localStorage.setItem("pharmacy_token", token);
    localStorage.setItem("pharmacy_user", JSON.stringify(user));
    setPharmacy(user);
  };

  const loginAdmin = (user, token) => {
    if (customer) {
      localStorage.removeItem("customer_token");
      localStorage.removeItem("customer_user");
      setCustomer(null);
    }
    if (pharmacy) {
      localStorage.removeItem("pharmacy_token");
      localStorage.removeItem("pharmacy_user");
      setPharmacy(null);
    }
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(user));
    setAdmin(user);
  };

  const logout = () => {
    localStorage.removeItem("customer_token");
    localStorage.removeItem("customer_user");
    localStorage.removeItem("pharmacy_token");
    localStorage.removeItem("pharmacy_user");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setCustomer(null);
    setPharmacy(null);
    setAdmin(null);
    
    // Navigate to home page after logout
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      customer, 
      pharmacy, 
      admin,
      isLoading, 
      loginCustomer, 
      loginPharmacy, 
      loginAdmin,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 