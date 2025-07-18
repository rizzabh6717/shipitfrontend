import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { LocationProvider } from './contexts/LocationContext';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import SenderDashboard from './pages/SenderDashboard';
import DriverDashboard from './pages/DriverDashboard';
import CreateParcel from './pages/CreateParcel';
import LiveTracking from './pages/LiveTracking';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Navbar from './components/Navbar';

function App() {
  return (
    <WalletProvider>
      <LocationProvider>
        <Router>
          <div className="min-h-screen bg-gray-900 text-white">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/sender" element={
                <>
                  <Navbar />
                  <SenderDashboard />
                </>
              } />
              <Route path="/driver" element={
                <>
                  <Navbar />
                  <DriverDashboard />
                </>
              } />
              <Route path="/create-parcel" element={
                <>
                  <Navbar />
                  <CreateParcel />
                </>
              } />
              <Route path="/track/:parcelId" element={
                <>
                  <Navbar />
                  <LiveTracking />
                </>
              } />
              <Route path="/analytics" element={
                <>
                  <Navbar />
                  <AnalyticsDashboard />
                </>
              } />
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1F2937',
                  color: '#F9FAFB',
                  border: '1px solid #374151',
                },
              }}
            />
          </div>
        </Router>
      </LocationProvider>
    </WalletProvider>
  );
}

export default App;