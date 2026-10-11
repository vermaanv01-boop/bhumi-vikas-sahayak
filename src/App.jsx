import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Regulations from './pages/Regulations';
import SavedDocuments from './pages/SavedDocuments';
import About from './pages/About';
import { askQuestion } from './services/assistantService';

export default function App() {
  const [language, setLanguage] = useState('en');
  const [selectedLocation, setSelectedLocation] = useState('bhopal');
  const [activeNav, setActiveNav] = useState('home');
  const [activeRightTab, setActiveRightTab] = useState('answer');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Persistence for Recent Queries
  const [recentQuestions, setRecentQuestions] = useState(() => {
    try {
      const stored = localStorage.getItem('bhumi_recent_queries');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Persistence for Saved Queries
  const [savedQuestions, setSavedQuestions] = useState(() => {
    try {
      const stored = localStorage.getItem('bhumi_saved_queries');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [currentResult, setCurrentResult] = useState(null);

  // Handle navigation requests
  const handleNavSelection = (navId) => {
    if (navId === 'ask') {
      setActiveNav('home');
      // Scroll to question input if needed
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (navId === 'location') {
      setActiveNav('home');
      setActiveRightTab('location');
    } else if (navId === 'recent') {
      setActiveNav('home');
    } else {
      setActiveNav(navId);
    }
  };

  // Handler for querying directly from Regulations or other pages
  const handleQueryFromElsewhere = async (questionText) => {
    setActiveNav('home');
    setActiveRightTab('answer');
    try {
      const res = await askQuestion({
        question: questionText,
        language,
        location: selectedLocation
      });
      setCurrentResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  // Handler for opening a saved question from the Saved Documents page
  const handleOpenSavedQuestion = (savedItem) => {
    setActiveNav('home');
    setActiveRightTab('answer');
    setCurrentResult({
      question: savedItem.question,
      answer: savedItem.answer,
      status: savedItem.status || 'answered',
      sources: savedItem.sources || [],
      language
    });
  };

  return (
    <div className="app-container">
      <Header
        language={language}
        setLanguage={setLanguage}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />

      <div className="app-body">
        <Sidebar
          activeNav={activeNav}
          setActiveNav={handleNavSelection}
          savedCount={savedQuestions.length}
          language={language}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
        />

        <main className="main-content">
          {activeNav === 'home' && (
            <Home
              language={language}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              recentQuestions={recentQuestions}
              setRecentQuestions={setRecentQuestions}
              savedQuestions={savedQuestions}
              setSavedQuestions={setSavedQuestions}
              currentResult={currentResult}
              setCurrentResult={setCurrentResult}
              activeRightTab={activeRightTab}
              setActiveRightTab={setActiveRightTab}
            />
          )}

          {activeNav === 'regulations' && (
            <Regulations
              onAskQuestion={handleQueryFromElsewhere}
              language={language}
            />
          )}

          {activeNav === 'saved' && (
            <SavedDocuments
              savedQuestions={savedQuestions}
              setSavedQuestions={setSavedQuestions}
              onOpenQuestion={handleOpenSavedQuestion}
              language={language}
            />
          )}

          {activeNav === 'about' && (
            <About language={language} />
          )}
        </main>
      </div>
    </div>
  );
}
