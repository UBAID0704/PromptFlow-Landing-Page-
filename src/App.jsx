import React from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';

import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import Features from "./Features.jsx";
import AiModelsList from "./AiModelsList.jsx";
import CrudDashboard from "./CrudDashboard.jsx";
import AdminPanel from "./AdminPanel.jsx";
import Pricing from "./Pricing.jsx";
import Contact from "./Contact.jsx";
import Footer from "./Footer.jsx";

// Auth Components
import AuthModal from "./AuthModal.jsx";
import Dashboard from "./Dashboard.jsx";

// Feedback & Feature Components
import UserFeedbackForm from "./UserFeedbackForm.jsx";
import FileUpload from "./components/FileUpload.jsx";
import AnalyticsDashboard from "./components/AnalyticsDashboard.jsx";

function MainContent() {
  const { user, setUser, activeTab, setActiveTab, isAdminView, setIsAdminView } = useApp();

  return (
    <div className="app-container" style={{ background: '#0a0c10', minHeight: '100vh', color: '#fff' }}>
      <Navbar />

      {/* GLOBAL ADMIN VIEW: When activated, replaces normal page content */}
      {isAdminView ? (
        <div style={{ paddingTop: '5rem', paddingBottom: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
          <AdminPanel onSwitchToPublic={() => setIsAdminView(false)} />
        </div>
      ) : (
        <>
          {/* Main Landing View */}
          {activeTab === 'landing' && (
            <>
              <div id="home"><Hero /></div>
              <div id="features"><Features /></div>
              <AiModelsList />

              {/* Standalone File Upload Section */}
              <div id="upload" style={{ padding: '2rem 1rem' }}>
                <FileUpload />
              </div>

              {/* Data Visualization Section */}
              <div id="analytics" style={{ padding: '2rem 1rem' }}>
                <AnalyticsDashboard />
              </div>

              {/* Public Reviews & Feedback Display */}
              <div id="reviews" style={{ padding: '2rem 1rem' }}>
                <CrudDashboard onSwitchToAdmin={() => setIsAdminView(true)} />
              </div>

              <div id="pricing"><Pricing /></div>
              <div id="contact"><Contact /></div>
            </>
          )}

          {/* Standalone Upload Tab View */}
          {activeTab === 'upload' && (
            <div style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
              <FileUpload />
            </div>
          )}

          {/* Standalone Analytics Tab View */}
          {activeTab === 'analytics' && (
            <div style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
              <AnalyticsDashboard />
            </div>
          )}

          {/* Dedicated Feedback Submission Form */}
          {activeTab === 'feedback' && (
            <div style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
              <UserFeedbackForm />
            </div>
          )}

          {/* Authentication Route */}
          {activeTab === 'auth' && (
            <AuthModal 
              onLoginSuccess={(loggedInUser) => {
                setUser(loggedInUser);
                setActiveTab('dashboard');
              }} 
            />
          )}

          {/* Protected Dashboard Route */}
          {activeTab === 'dashboard' && (
            user ? (
              <Dashboard user={user} />
            ) : (
              <AuthModal 
                onLoginSuccess={(loggedInUser) => {
                  setUser(loggedInUser);
                  setActiveTab('dashboard');
                }} 
              />
            )
          )}
        </>
      )}

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
