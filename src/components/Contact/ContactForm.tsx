import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Contact.scss';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSuccess: () => void;
  onError: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSuccess, onError }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('pages.contact.errors.firstNameRequired');
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('pages.contact.errors.lastNameRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('pages.contact.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('pages.contact.errors.emailInvalid');
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = t('pages.contact.errors.subjectRequired');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('pages.contact.errors.messageRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        onError();
      }
    } catch (error) {
      console.error('Error sending email:', error);
      onError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-grid">
      <div className="contact-section">
        <motion.h1 
          className="contact-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t('pages.contact.title')}
        </motion.h1>
        
        <motion.form 
          className="contact-form" 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="name-row">
            <div className="form-field">
              <label htmlFor="lastName">{t('pages.contact.lastName')} *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder={t('pages.contact.placeholders.lastName')}
              />
              <div className="error-text-container">
                {errors.lastName && <p className="error-text">{errors.lastName}</p>}
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="firstName">{t('pages.contact.firstName')} *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder={t('pages.contact.placeholders.firstName')}
              />
              <div className="error-text-container">
                {errors.firstName && <p className="error-text">{errors.firstName}</p>}
              </div>
            </div>
          </div>
          
          <div className="form-field">
            <label htmlFor="email">{t('pages.contact.email')} *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('pages.contact.placeholders.email')}
            />
            <div className="error-text-container">
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
          </div>
          
          <div className="form-field">
            <label htmlFor="subject">{t('pages.contact.subject')} *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder={t('pages.contact.placeholders.subject')}
            />
            <div className="error-text-container">
              {errors.subject && <p className="error-text">{errors.subject}</p>}
            </div>
          </div>
          
          <div className="form-field">
            <label htmlFor="message">{t('pages.contact.message')} *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t('pages.contact.placeholders.message')}
            />
            <div className="error-text-container">
              {errors.message && <p className="error-text">{errors.message}</p>}
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-button neon-glow" 
            disabled={isSubmitting}
          >
            {isSubmitting ? t('pages.contact.sending') : t('pages.contact.send')}
          </button>
        </motion.form>
      </div>
    </div>
  );
};