import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Home.scss';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <motion.div
      className="home-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="home-content">
        <motion.div
          className="header-section"
          variants={itemVariants}
        >
          <h1 className="home-title display-4 mb-4">
            {t('pages.home.title')}
          </h1>
          
          <p className="home-description lead mb-4">
            {t('pages.home.description')}
          </p>
        </motion.div>

        <motion.div
          className="features-preview"
          variants={itemVariants}
        >
          <div className="feature-cards">
            <div 
              className="feature-card clickable"
              onClick={() => handleCardClick('/chat')}
            >
              <h4>⚡ AIチャット</h4>
              <p>AIとチャットで簡単に画像作成</p>
            </div>
            <div 
              className="feature-card clickable"
              onClick={() => handleCardClick('/contact')}
            >
              <h4>📧 お問い合わせ</h4>
              <p>フィードバックやご要望はこちら</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="demo-video-section"
          variants={itemVariants}
        >
          <div className="video-container">
            <video
              className="demo-video"
              autoPlay
              loop
              muted
              playsInline
              poster="/videos/editor-demo-poster.jpg"
            >
              <source src="/videos/editor-demo.mp4" type="video/mp4" />
              <source src="/videos/editor-demo.webm" type="video/webm" />
              <p>お使いのブラウザは動画の再生をサポートしていません。</p>
            </video>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;