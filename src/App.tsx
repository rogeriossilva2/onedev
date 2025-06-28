import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CepGenerator from './components/CepGenerator';
import GitIgnoreGenerator from './components/GitIgnoreGenerator';
import FeedbackForm from './components/FeedbackForm';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookiePolicy from './components/CookiePolicy';
import LGPDInfo from './components/LGPDInfo';
import About from './components/About';

import CookieModal from './components/CookieModal';
import CookieSettingsModal, { CookieSettings } from './components/CookieSettings';

import { useAnalytics } from './hooks/useAnalytics';

function AppContent() {
  const [currentTool, setCurrentTool] = useState('dashboard');
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  
  const {
    cookieConsent,
    cookieSettings,
    trackToolUsage,
    acceptCookies,
    declineCookies,
    updateCookieSettings
  } = useAnalytics();

  useEffect(() => {
    const handleToolChange = (event: CustomEvent) => {
      const toolId = event.detail;
      setCurrentTool(toolId);
      
      // Track tool usage (sempre ativo - obrigatório)
      trackToolUsage(toolId);
    };

    window.addEventListener('toolChange', handleToolChange as EventListener);
    
    return () => {
      window.removeEventListener('toolChange', handleToolChange as EventListener);
    };
  }, [trackToolUsage]);

  // Show cookie modal if consent hasn't been given
  useEffect(() => {
    if (cookieConsent === null) {
      setShowCookieModal(true);
    }
  }, [cookieConsent]);

  const handleAcceptCookies = () => {
    acceptCookies();
    setShowCookieModal(false);
  };

  const handleDeclineCookies = () => {
    declineCookies();
    setShowCookieModal(false);
  };

  const handleCustomizeCookies = () => {
    setShowCookieModal(false);
    setShowCookieSettings(true);
  };

  const handleSaveCookieSettings = (settings: CookieSettings) => {
    updateCookieSettings(settings);
    acceptCookies(settings);
  };

  const renderCurrentTool = () => {
    switch (currentTool) {
      case 'dashboard':
        return <Dashboard />;
      case 'cep-generator':
        return <CepGenerator />;
      case 'gitignore-generator':
        return <GitIgnoreGenerator />;
      case 'feedback':
        return <FeedbackForm />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'cookies':
        return <CookiePolicy />;
      case 'lgpd':
        return <LGPDInfo />;
      case 'about':
        return <About />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Layout currentTool={currentTool}>
        {renderCurrentTool()}
      </Layout>

      {/* Cookie Modal */}
      <CookieModal
        isOpen={showCookieModal}
        onAccept={handleAcceptCookies}
        onDecline={handleDeclineCookies}
        onCustomize={handleCustomizeCookies}
      />

      {/* Cookie Settings Modal */}
      <CookieSettingsModal
        isOpen={showCookieSettings}
        onClose={() => setShowCookieSettings(false)}
        onSave={handleSaveCookieSettings}
        currentSettings={cookieSettings}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;