import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './hooks/useTheme';
import { Header } from './components/Layout/Header';
import Index from './pages/index';
import AiChatPage from './pages/aiChat';
import ContactPage from './pages/contact';
import './styles/custom.scss';

const App: React.FC = () => {
  const location = useLocation();
  const [isClient, setIsClient] = useState(false);

  // SSR時はアニメーションを無効化
  useEffect(() => {
    setIsClient(true);
  }, []);

  const pageVariants = {
    initial: {
      opacity: isClient ? 0 : 1,
      x: isClient ? -200 : 0
    },
    enter: {
      opacity: 1,
      x: 0,
      transition: isClient ? {
        type: "spring",
        stiffness: 300,
        damping: 30
      } : { duration: 0 }
    },
    exit: {
      opacity: isClient ? 0 : 1,
      x: isClient ? 200 : 0,
      transition: isClient ? {
        duration: 0.3
      } : { duration: 0 }
    }
  };

  return (
    <ThemeProvider>
      <div className="app-container">
        <Header />
        <div className="main-content">
          <Routes location={location}>
            <Route
              path="/"
              element={
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    variants={pageVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                  >
                    <Index />
                  </motion.div>
                </AnimatePresence>
              }
            />
            <Route
              path="/chat"
              element={
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    variants={pageVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className="chat-page"
                  >
                    <AiChatPage />
                  </motion.div>
                </AnimatePresence>
              }
            />
            <Route
              path="/contact"
              element={
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    variants={pageVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className="contact-page"
                  >
                    <ContactPage />
                  </motion.div>
                </AnimatePresence>
              }
            />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;