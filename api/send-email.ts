import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import React from 'react';
import { render } from '@react-email/render';
import { Html, Head, Body, Container, Heading, Text, Hr } from '@react-email/components';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email template component
const ContactEmail = ({ lastName, firstName,  subject, email, message }: any) => (
  React.createElement(Html, null,
    React.createElement(Head, null),
    React.createElement(Body, { style: { backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' } },
      React.createElement(Container, { style: { margin: '24px auto', backgroundColor: '#ffffff', borderRadius: 8, padding: 24, border: '1px solid #e5e7eb' } },
        React.createElement(Heading, { style: { fontSize: 20, margin: '0 0 12px 0' } }, 'お問い合わせありがとうございます'),
        React.createElement(Text, null, '以下の内容で受け付けました。ご確認ください。'),
        React.createElement(Hr, null),
        React.createElement(Text, null, React.createElement('strong', null, 'お名前: '), lastName, ' ', firstName),
        React.createElement(Text, null, React.createElement('strong', null, 'メールアドレス: '), email),
        React.createElement(Text, null, React.createElement('strong', null, '件名: '), subject),
        React.createElement(Text, null, React.createElement('strong', null, 'お問い合わせ内容:')),
        React.createElement(Text, { style: { whiteSpace: 'pre-wrap' } }, message),
        React.createElement(Hr, null),
        React.createElement(Text, null, '本メールに心当たりがない場合は、このメールを破棄してください。')
      )
    )
  )
);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { lastName, firstName, email, subject, message } = req.body || {};

    if (!lastName || !firstName || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const html = await render(React.createElement(ContactEmail, { lastName, firstName, email, subject, message }));

    const result = await resend.emails.send({
      from: 'AI Chat Portfolio <onboarding@resend.dev>',
      to: email,
      subject:'お問い合わせありがとうございます。',
      html,
    });

    return res.status(200).json({ ok: true, id: result.data?.id });
  } catch (error: any) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
