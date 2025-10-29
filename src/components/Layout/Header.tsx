import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/hooks/useTheme';
import './Header.scss';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'nav.home' },
    { path: '/portfolio', label: 'nav.portfolio' },
    { path: '/chat', label: 'nav.chat' },
    { path: '/editor', label: 'nav.editor' }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="header bg-light shadow-sm"
    >
      <nav className="navbar navbar-expand-lg navbar-light container">
        <motion.div 
          className="navbar-brand"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="text-decoration-none">
            Portfolio AI Chat
          </Link>
        </motion.div>

        <div className="navbar-nav ms-auto">
          {navItems.map(({ path, label }) => (
            <motion.div
              key={path}
              className="nav-item"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Link
                to={path}
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                {t(label)}
              </Link>
            </motion.div>
          ))}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="btn btn-outline-primary ms-2"
            onClick={toggleTheme}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </motion.button>
        </div>
      </nav>
    </motion.header>
  );
};