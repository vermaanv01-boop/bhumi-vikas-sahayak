import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SUGGESTED_QUESTIONS, UI_TRANSLATIONS } from '../data/demoData';

export default function SuggestedQuestions({ onSelectQuestion, language = 'en' }) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <section className="suggested-questions-container" aria-label="Suggested regulatory questions">
      <div className="section-eyebrow-row">
        <h3 className="section-title">{t.suggestedHeading}</h3>
        <span className="section-badge">QUICK INQUIRY</span>
      </div>

      <div className="suggested-questions-grid">
        {SUGGESTED_QUESTIONS.map((q) => {
          const text = language === 'hi' ? q.hi : q.en;
          return (
            <button
              key={q.id}
              type="button"
              className="suggested-card"
              onClick={() => onSelectQuestion(text)}
            >
              <span className="card-query-text">{text}</span>
              <ArrowUpRight size={14} className="card-arrow" />
            </button>
          );
        })}
      </div>

      <style>{`
        .suggested-questions-container {
          margin-bottom: 30px;
        }

        .section-eyebrow-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .section-title {
          font-family: var(--font-sans);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .section-badge {
          font-size: 9.5px;
          letter-spacing: 0.06em;
          font-weight: 600;
          color: var(--primary);
          background-color: var(--soft-green);
          padding: 1px 6px;
          border-radius: 2px;
        }

        .suggested-questions-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 7px;
        }

        .suggested-card {
          background-color: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 3px;
          padding: 9px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          transition: background-color 0.15s ease, border-color 0.15s ease;
          gap: 10px;
        }

        .suggested-card:hover {
          background-color: var(--soft-green);
          border-color: #B5C4B1;
        }

        .card-query-text {
          font-size: 13px;
          color: var(--text-main);
          font-weight: 400;
          line-height: 1.35;
        }

        .card-arrow {
          color: var(--primary);
          flex-shrink: 0;
          opacity: 0.7;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .suggested-card:hover .card-arrow {
          opacity: 1;
          transform: translate(1px, -1px);
        }
      `}</style>
    </section>
  );
}
