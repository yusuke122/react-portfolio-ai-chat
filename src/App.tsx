import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './hooks/useTheme';
import { Header } from './components/Layout/Header';
import { Home } from './pages/index';
import { ChatInterface } from './components/Chat/ChatInterface';
import { Editor } from './components/Editor/Editor';
import Contact from './pages/Contact';
import ContactSuccess from './pages/ContactSuccess';
import ContactError from './pages/ContactError';
import './styles/custom.scss';

const App: React.FC = () => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      x: -200
    },
    enter: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      x: 200,
      transition: {
        duration: 0.3
      }
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
                    <Home />
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
                    <ChatInterface />
                  </motion.div>
                </AnimatePresence>
              }
            />
            <Route
              path="/editor"
              element={
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    variants={pageVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                    className="editor-page"
                  >
                    <Editor />
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
                  >
                    <Contact />
                  </motion.div>
                </AnimatePresence>
              }
            />
            <Route
              path="/contact/success"
              element={
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    variants={pageVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                  >
                    <ContactSuccess />
                  </motion.div>
                </AnimatePresence>
              }
            />
            <Route
              path="/contact/error"
              element={
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    variants={pageVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                  >
                    <ContactError />
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