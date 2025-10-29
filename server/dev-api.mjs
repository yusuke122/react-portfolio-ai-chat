import express from 'express';
import { Resend } from 'resend';
import React from 'react';
import { render } from '@react-email/render';
import { Html, Head, Body, Container, Heading, Text, Hr } from '@react-email/components';
import dotenv from 'dotenv';
import path from 'path';

// Load env from .env.local if present
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const app = express();
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

// Email template component (same as serverless)
const ContactEmail = ({ lastName, firstName, email, message }) => (
  React.createElement(Html, null,
    React.createElement(Head, null),
    React.createElement(Body, { style: { backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' } },
      React.createElement(Container, { style: { margin: '24px auto', backgroundColor: '#ffffff', borderRadius: 8, padding: 24, border: '1px solid #e5e7eb' } },
        React.createElement(Heading, { style: { fontSize: 20, margin: '0 0 12px 0' } }, 'お問い合わせありがとうございます'),
        React.createElement(Text, null, '以下の内容で受け付けました。ご確認ください。'),
        React.createElement(Hr, null),
        React.createElement(Text, null, React.createElement('strong', null, 'お名前: '), lastName, ' ', firstName),
        React.createElement(Text, null, React.createElement('strong', null, 'メールアドレス: '), email),
        React.createElement(Text, null, React.createElement('strong', null, 'お問い合わせ内容:')),
        React.createElement(Text, { style: { whiteSpace: 'pre-wrap' } }, message),
        React.createElement(Hr, null),
        React.createElement(Text, null, '本メールに心当たりがない場合は、このメールを破棄してください。')
      )
    )
  )
);

app.post('/api/send-email', async (req, res) => {
  try {
    const { lastName, firstName, email, message } = req.body || {};
    if (!lastName || !firstName || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const subject = 'お問い合わせありがとうございます';
    const html = await render(React.createElement(ContactEmail, { lastName, firstName, email, message }));

    const result = await resend.emails.send({
      from: 'AI Chat Portfolio <onboarding@resend.dev>',
      to: email,
      subject,
      html,
    });

    return res.status(200).json({ ok: true, id: result.data?.id });
  } catch (error) {
    console.error('Email send error (dev):', error);
    return res.status(500).json({ error: 'Failed to send email', details: error?.message });
  }
});

const PORT = 8787;
app.listen(PORT, () => {
  console.log(`Dev API listening on http://localhost:${PORT}`);
});
