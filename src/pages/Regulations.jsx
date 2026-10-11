import React, { useState } from 'react';
import { BookOpen, Search, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';
import { REGULATIONS_OVERVIEW, REGULATION_DISCLAIMER } from '../data/demoData';

export default function Regulations({ onAskQuestion, language = 'en' }) {
  const [filterText, setFilterText] = useState('');

  const filteredChapters = REGULATIONS_OVERVIEW.filter(
    (item) =>
      item.title.toLowerCase().includes(filterText.toLowerCase()) ||
      item.rules.toLowerCase().includes(filterText.toLowerCase()) ||
      item.description.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="regulations-page-wrap">
      <div className="page-header-block">
        <div className="page-eyebrow">STATUTORY COMPENDIUM</div>
        <h1 className="page-title">Madhya Pradesh Bhumi Vikas Niyam, 2012</h1>
        <p className="page-desc">
          Systematic index of chapters, rules, and statutory development controls notified under the Madhya Pradesh Nagar Tatha Gram Nivesh Adhiniyam, 1973.
        </p>

        <div className="amendment-notice-box">
          <ShieldCheck size={16} className="notice-icon" />
          <div>
            <strong>Codification Status: </strong>
            Consolidated gazette amendments incorporated up to <strong>{REGULATION_DISCLAIMER.coverageDate}</strong>.
            Published for civic and architectural planning reference.
          </div>
        </div>
      </div>

      <div className="search-filter-row">
        <div className="search-input-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Filter by chapter, rule number, or subject matter..."
            className="filter-input"
          />
        </div>
        <span className="results-count">
          Showing {filteredChapters.length} of {REGULATIONS_OVERVIEW.length} chapters
        </span>
      </div>

      <div className="chapters-grid">
        {filteredChapters.map((ch, idx) => (
          <div key={idx} className="chapter-card">
            <div className="chapter-top">
              <span className="chapter-tag">{ch.chapter}</span>
              <span className="rules-span-tag">{ch.rules}</span>
            </div>

            <h3 className="chapter-title">{ch.title}</h3>
            <p className="chapter-desc">{ch.description}</p>

            <div className="chapter-footer">
              <button
                type="button"
                onClick={() => onAskQuestion(`What are the key provisions of ${ch.chapter}: ${ch.title}?`)}
                className="inquire-btn"
              >
                <span>Query provisions in {ch.chapter}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .regulations-page-wrap {
          padding: 36px 48px;
          max-width: 1040px;
          margin: 0 auto;
          width: 100%;
        }

        .page-header-block {
          margin-bottom: 28px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
        }

        .page-eyebrow {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          color: var(--primary);
          font-weight: 600;
          margin-bottom: 6px;
        }

        .page-title {
          font-size: 26px;
          color: var(--text-main);
          margin-bottom: 8px;
          font-weight: 600;
        }

        .page-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.55;
          margin-bottom: 16px;
          max-width: 760px;
        }

        .amendment-notice-box {
          background-color: #F3F6F1;
          border: 1px solid var(--border-color);
          border-radius: 3px;
          padding: 10px 14px;
          font-size: 12px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .notice-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        .search-filter-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-input-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 3px;
          padding: 7px 12px;
          flex: 1;
          max-width: 440px;
        }

        .search-icon {
          color: var(--text-light);
        }

        .filter-input {
          border: none;
          background: transparent;
          font-size: 13px;
          width: 100%;
          outline: none;
        }

        .results-count {
          font-size: 12px;
          color: var(--text-light);
          font-family: var(--font-mono);
        }

        .chapters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(460px, 1fr));
          gap: 16px;
        }

        .chapter-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          transition: border-color 0.15s ease;
        }

        .chapter-card:hover {
          border-color: #B2C2AF;
        }

        .chapter-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .chapter-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          color: var(--primary);
          background: var(--soft-green);
          padding: 2px 7px;
          border-radius: 2px;
        }

        .rules-span-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-light);
        }

        .chapter-title {
          font-family: var(--font-serif);
          font-size: 16px;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .chapter-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 16px;
          flex: 1;
        }

        .chapter-footer {
          border-top: 1px solid #ECEFEA;
          padding-top: 10px;
        }

        .inquire-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: var(--primary);
          transition: transform 0.15s ease;
        }

        .inquire-btn:hover {
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .regulations-page-wrap {
            padding: 20px 16px;
          }
          .chapters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
