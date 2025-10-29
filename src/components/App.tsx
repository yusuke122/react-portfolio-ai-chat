import React, { useEffect } from 'react';
import { Header } from './Layout/Header';
import { ChatInterface } from './Chat/ChatInterface';
import { Editor } from './Editor/Editor';
import { useTheme } from '../hooks/useTheme';
import '../styles/custom.scss';
import { motion, AnimatePresence } from 'framer-motion';

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
                    <div className="content-grid">
                        <motion.div
                            className="editor-section"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                        >
                            <h2>Code Editor</h2>
                            <p>Write and edit your code with real-time assistance</p>
                            <Editor />
                        </motion.div>
                        <motion.div
                            className="chat-section"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.3, delay: 0.7 }}
                        >
                            <h2>AI Chat</h2>
                            <p>Get instant help and suggestions from our AI assistant</p>
                            <ChatInterface />
                        </motion.div>
                    </div>
                </motion.main>
            </AnimatePresence>
        </div>
    );
};

export default App;