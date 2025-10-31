import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import './Header.scss';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Open nav by default on desktop and close on mobile
  useEffect(() => {
    const apply = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      setIsMenuOpen(desktop);
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (!isDesktop) {
      setIsMenuOpen(false);
    }
    setIsLanguageMenuOpen(false);
  }, [location.pathname, isDesktop]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        if (!isDesktop && isMenuOpen) {
          setIsMenuOpen(false);
        }
        setIsLanguageMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!isDesktop && isMenuOpen) {
          setIsMenuOpen(false);
        }
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen, isLanguageMenuOpen, isDesktop]);

  const menuItems = [
    { path: '/', label: t('nav.home') },
    { path: '/chat', label: t('nav.chat') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const languages = [
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsLanguageMenuOpen(false);
    // モバイルでは言語変更後にメインメニューも閉じる
    if (!isDesktop) {
      setIsMenuOpen(false);
    }
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === i18n.language) || languages[0];
  };

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
    <header className="header" ref={headerRef}>
      <div className="header-content">
        <Link to="/" className="logo">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI Chat Portfolio
          </motion.span>
        </Link>

        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <AnimatePresence>
          <motion.nav
            id="main-navigation"
            className={`nav-links ${isMenuOpen ? 'open' : ''}`}
            initial={isDesktop ? 'open' : 'closed'}
            animate={isDesktop || isMenuOpen ? 'open' : 'closed'}
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
                  onClick={() => {
                    if (!isDesktop) {
                      setIsMenuOpen(false);
                    }
                    setIsLanguageMenuOpen(false);
                  }}
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
              {theme === 'dark' ? '☀️' : '🌙'}
            </motion.button>

            <div 
              className="language-selector"
              onMouseEnter={() => isDesktop && setIsLanguageMenuOpen(true)}
              onMouseLeave={() => isDesktop && setIsLanguageMenuOpen(false)}
            >
              <motion.button
                className="language-toggle"
                onClick={() => !isDesktop && setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="language-flag">{getCurrentLanguage().flag}</span>
                <span className="language-text">{getCurrentLanguage().name}</span>
                <span className="language-arrow">▼</span>
              </motion.button>

              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    className="language-menu"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {languages.map((language) => (
                      <motion.button
                        key={language.code}
                        className={`language-option ${i18n.language === language.code ? 'active' : ''}`}
                        onClick={() => changeLanguage(language.code)}
                        whileHover={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="language-flag">{language.flag}</span>
                        <span>{language.name}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.nav>
        </AnimatePresence>
      </div>
    </header>
  );
};
