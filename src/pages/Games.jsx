// javascript
import React from 'react';

export default function Games() {
  return React.createElement(
    'div',
    { style: { padding: 32 } },
    React.createElement(
      'h2',
      { style: { color: '#0ff', fontFamily: "'Orbitron', Arial, sans-serif" } },
      'Página Games'
    ),
    React.createElement(
      'p',
      { style: { color: '#fff' } },
      'Bem-vindo à página de Games!'
    )
  );
}
