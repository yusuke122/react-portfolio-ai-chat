import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { sendContactEmail } from '@/utils/email';
import '../styles/custom.scss';

const ContactSchema = z.object({
  lastName: z.string().min(1, '苗字は必須です'),
  firstName: z.string().min(1, '名前は必須です'),
  email: z.string().email('メールアドレスの形式が正しくありません'),
  message: z.string().min(1, 'ご意見・お問い合わせは必須です').max(2000, '2000文字以内で入力してください'),
});

export type ContactFormValues = z.infer<typeof ContactSchema>;

export const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<keyof ContactFormValues>>(new Set());
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, trigger } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    mode: 'onChange',
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitAttempted(true);
    // 送信時に全フィールドをバリデーション
    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    try {
      await sendContactEmail(values);
      reset();
      setIsSubmitAttempted(false);
      setTouchedFields(new Set());
      navigate('/contact/success');
    } catch (e) {
      console.error('メール送信に失敗しました', e);
      navigate('/contact/error');
    }
  };

  const handleFieldTouch = (fieldName: keyof ContactFormValues) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
  };

  const shouldShowError = (fieldName: keyof ContactFormValues): boolean => {
    // メールアドレスは入力開始後常にチェック
    if (fieldName === 'email') {
      return (touchedFields.has(fieldName) || isSubmitAttempted) && !!errors[fieldName];
    }
    // その他のフィールドは入力開始後かつエラーがある場合、または送信ボタン押下後
    return (touchedFields.has(fieldName) || isSubmitAttempted) && !!errors[fieldName];
  };

  return (
    <div className="contact-page">
      <div className="contact-card">
        <h1 className="contact-title">ご意見・お問い合わせ</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
          <div className="name-row">
            <div className="form-field">
              <label htmlFor="lastName">苗字</label>
              <input 
                id="lastName" 
                type="text" 
                {...register('lastName', {
                  onChange: () => handleFieldTouch('lastName')
                })} 
              />
              <div className="error-text-container">
                {shouldShowError('lastName') && <p className="error-text">{errors.lastName?.message}</p>}
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="firstName">名前</label>
              <input 
                id="firstName" 
                type="text" 
                {...register('firstName', {
                  onChange: () => handleFieldTouch('firstName')
                })} 
              />
              <div className="error-text-container">
                {shouldShowError('firstName') && <p className="error-text">{errors.firstName?.message}</p>}
              </div>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email">メールアドレス</label>
            <input 
              id="email" 
              type="email" 
              {...register('email', {
                onChange: () => handleFieldTouch('email')
              })} 
            />
            <div className="error-text-container">
              {shouldShowError('email') && <p className="error-text">{errors.email?.message}</p>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="message">ご意見・お問い合わせ</label>
            <textarea 
              id="message" 
              rows={6} 
              {...register('message', {
                onChange: () => handleFieldTouch('message')
              })} 
            />
            <div className="error-text-container">
              {shouldShowError('message') && <p className="error-text">{errors.message?.message}</p>}
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? '送信中…' : '送信'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
