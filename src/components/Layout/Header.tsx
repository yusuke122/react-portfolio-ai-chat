import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import './Header.scss';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { path: '/', label: t('nav.home') },
    { path: '/chat', label: t('nav.chat') },
    { path: '/editor', label: t('nav.editor') }
  ];

  const variants = {
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Portfolio
          </motion.span>
        </Link>

        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <AnimatePresence>
          <motion.nav
            className={`nav-links ${isMenuOpen ? 'open' : ''}`}
            initial="closed"
            animate={isMenuOpen ? 'open' : 'closed'}
            variants={variants}
          >
            {menuItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.button
              className="theme-toggle"
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </motion.button>
          </motion.nav>
        </AnimatePresence>
      </div>
    </header>
  );
};