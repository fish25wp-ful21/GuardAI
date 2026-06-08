import React, { useMemo } from 'react';
import { EDUCATION_CARDS } from '../../utils/constants';

export default function Education() {
  const cards = useMemo(() => EDUCATION_CARDS, []);

  return (
    <div className="fade-in">
      <h2 style={{ color: '#ff8844', fontSize: '18px', marginBottom: '12px' }}>📖 Privacy Education</h2>
      <div>
        {cards.map((card, idx) => (
          <div key={idx} className="card">
            <h3 style={{ color: '#ff884 orange' }}>{card.icon} {card.title}</h3>
            <p style={{ fontSize: '13px', color: '#b0b0cc' }}>{card.description}</p>
            <p style={{ fontSize: '11px', color: '#8888aa', marginTop: '6px' }}>💡 {card.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

