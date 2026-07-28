import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Global User & Routing State
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('landing'); // 'landing', 'auth', 'dashboard', 'feedback'
  const [isAdminView, setIsAdminView] = useState(false);

  // Global Review Feed State
  const [reviews, setReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);

  // Restore User Session on App Mount
  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    const token = localStorage.getItem('userToken');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch Community Reviews
  const fetchReviews = async () => {
    setIsReviewsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/contacts');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
    setActiveTab('landing');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeTab,
        setActiveTab,
        isAdminView,
        setIsAdminView,
        reviews,
        isReviewsLoading,
        fetchReviews,
        handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
