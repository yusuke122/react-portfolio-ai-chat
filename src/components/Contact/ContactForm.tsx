import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
      newErrors.firstName = '名前を入力してください';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = '姓を入力してください';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = '件名を入力してください';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'メッセージを入力してください';
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
          お問い合わせ
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
              <label htmlFor="firstName">名前 *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="山田"
              />
              <div className="error-text-container">
                {errors.firstName && <p className="error-text">{errors.firstName}</p>}
              </div>
            </div>
            
            <div className="form-field">
              <label htmlFor="lastName">姓 *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="太郎"
              />
              <div className="error-text-container">
                {errors.lastName && <p className="error-text">{errors.lastName}</p>}
              </div>
            </div>
          </div>
          
          <div className="form-field">
            <label htmlFor="email">メールアドレス *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="yamada@example.com"
            />
            <div className="error-text-container">
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
          </div>
          
          <div className="form-field">
            <label htmlFor="subject">件名 *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="お問い合わせの件名"
            />
            <div className="error-text-container">
              {errors.subject && <p className="error-text">{errors.subject}</p>}
            </div>
          </div>
          
          <div className="form-field">
            <label htmlFor="message">メッセージ *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="お問い合わせ内容をこちらにご記入ください"
            />
            <div className="error-text-container">
              {errors.message && <p className="error-text">{errors.message}</p>}
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? '送信中...' : '送信'}
          </button>
        </motion.form>
      </div>
    </div>
  );
};