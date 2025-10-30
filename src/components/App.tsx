import React, { useEffect } from 'react';
import { Header } from './Layout/Header';
import { ChatInterface } from './Chat/ChatInterface';
import { useTheme } from '../hooks/useTheme';
import '../styles/custom.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { Contact } from './Contact/Contact';

const App: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div className={`app-container ${theme}`}>
            <Header />
            <AnimatePresence>
                <motion.main
                    className="main-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="welcome-section"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1>Welcome to AI Chat Portfolio</h1>
                        <p>An interactive platform for code editing and AI-powered conversations</p>
                    </motion.div>
                    <motion.div
                        className="chat-section"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3, delay: 0.7 }}
                    >
                      <ChatInterface />
                    </motion.div>
                    <motion.div
                        className="contact-section"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3, delay: 0.7 }}
                    >
                        <Contact />
                    </motion.div>
                </motion.main>
            </AnimatePresence>
        </div>
    );
};

export default App;