// javascript
import React from 'react';
import { FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from 'react-icons/fa6';

const SOCIAL = [
  { href: 'https://www.instagram.com/playradarhub/', label: 'Instagram', Icon: FaInstagram },
  { href: 'https://www.tiktok.com/@playradarhub?is_from_webapp=1&sender_device=pc', label: 'TikTok', Icon: FaTiktok },
  { href: 'https://youtube.com/@playradarhub?si=0EXOJ8hFkq3XWvma', label: 'YouTube', Icon: FaYoutube },
  { href: 'https://x.com/playradarhub', label: 'X', Icon: FaXTwitter },
];

export default function About() {
  return React.createElement(
    'div',
    {
      style: {
        padding: 32,
        color: '#fff',
        fontFamily: "'Orbitron', Arial, Verdana, sans-serif",
        maxWidth: 500,
        margin: '0 auto',
      },
    },
    React.createElement('h2', { style: { color: '#0ff', marginBottom: 16 } }, 'About PlayRadarHub'),
    React.createElement(
      'p',
      { style: { fontSize: 18, marginBottom: 16, fontFamily: "'Space Grotesk', sans-serif" } },
      "Hi! I'm the developer of this project, which is just getting started but already aims to grow more and more, bringing accessibility and ease to the reader. Feel free to follow the news and updates!"
    ),
    React.createElement(
      'p',
      { style: { fontSize: 13, color: '#aaa', marginBottom: 24 } },
      'All the information displayed here is sourced from the IGDB website.'
    ),
    React.createElement(
      'div',
      { style: { display: 'flex', gap: 24, marginTop: 32 } },
      ...SOCIAL.map(({ href, label, Icon }) =>
        React.createElement(
          'a',
          {
            key: label,
            href,
            target: '_blank',
            rel: 'noopener noreferrer',
            'aria-label': `Open ${label} in a new tab`,
            style: { color: 'inherit', display: 'inline-flex', alignItems: 'center' },
          },
          React.createElement(Icon, { size: 36, style: { color: '#fff' }, title: label })
        )
      )
    ),
    React.createElement(
      'p',
      { style: { marginTop: 12, color: '#888', fontSize: 14 } },
      'Thanks for visiting.'
    )
  );
}
