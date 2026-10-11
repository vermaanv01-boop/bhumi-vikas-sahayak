import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Share2,
  FileText,
  ExternalLink,
  AlertCircle,
  Check,
  Info,
  Scale
} from 'lucide-react';
import { UI_TRANSLATIONS } from '../data/demoData';

function renderInline(text) {
  if (!text) return text;
  const parts = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<strong key={match.index}>{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

function MarkdownRenderer({ content }) {
  if (!content) return null;

  const blocks = content.split(/\n\n+/);

  return (
    <div className="formatted-markdown-body">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed === '---' || trimmed === '***') {
          return <hr key={idx} className="md-hr" />;
        }

        if (trimmed.startsWith('#### ')) {
          return <h4 key={idx} className="md-h4">{renderInline(trimmed.replace(/^####\s+/, ''))}</h4>;
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={idx} className="md-h3">{renderInline(trimmed.replace(/^###\s+/, ''))}</h3>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={idx} className="md-h2">{renderInline(trimmed.replace(/^##\s+/, ''))}</h2>;
        }

        const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length >= 2 && lines.every((l) => l.startsWith('|') && l.endsWith('|'))) {
          const headerCells = lines[0].split('|').slice(1, -1).map((c) => c.trim());
          const dataRows = lines
            .slice(1)
            .filter((l) => !/^\|[-:| ]+\|$/.test(l))
            .map((r) => r.split('|').slice(1, -1).map((c) => c.trim()));

          return (
            <div key={idx} className="md-table-wrapper">
              <table className="md-table">
                <thead>
                  <tr>
                    {headerCells.map((h, hIdx) => (
                      <th key={hIdx}>{renderInline(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx}>{renderInline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s+/.test(trimmed)) {
          const listLines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
          const isOrdered = /^\d+\.\s+/.test(listLines[0]);
          if (isOrdered) {
            return (
              <ol key={idx} className="md-ol">
                {listLines.map((item, iIdx) => (
                  <li key={iIdx}>{renderInline(item.replace(/^\d+\.\s+/, ''))}</li>
                ))}
              </ol>
            );
          }
          return (
            <ul key={idx} className="md-ul">
              {listLines.map((item, iIdx) => (
                <li key={iIdx}>{renderInline(item.replace(/^[-*]\s+/, ''))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={idx} className="md-p">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export default function AnswerPanel({
  result,
  isLoading,
  onOpenSourceDoc,
  isSaved,
  onToggleSave,
  language = 'en'
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!result) return;
    const shareText = `Bhumi Vikas Sahayak\nQuestion: ${result.question}\n\nAnswer: ${result.answer}\n\nRules: ${result.sources?.map(s => s.ruleNumber).join(', ') || 'N/A'}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bhumi Vikas Sahayak - Building Regulations Inquiry',
          text: shareText,
          url: window.location.href
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was cancelled or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Ignore clipboard write error
    }
  };

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="answer-panel-loading" aria-live="polite">
        <div className="loading-header-row">
          <div className="skeleton-pill" style={{ width: '120px' }}></div>
          <div className="skeleton-pill" style={{ width: '80px' }}></div>
        </div>
        <div className="skeleton-line" style={{ width: '90%', height: '24px', margin: '14px 0' }}></div>
        <div className="skeleton-line" style={{ width: '100%' }}></div>
        <div className="skeleton-line" style={{ width: '95%' }}></div>
        <div className="skeleton-line" style={{ width: '75%' }}></div>
        <div className="skeleton-card" style={{ height: '140px', marginTop: '24px' }}></div>

        <style>{`
          .answer-panel-loading {
            padding: 24px;
            background: #FFFFFF;
            border: 1px solid var(--border-color);
            border-radius: 4px;
          }
          .skeleton-pill, .skeleton-line, .skeleton-card {
            background: linear-gradient(90deg, #EDF0EA 25%, #F7F9F5 50%, #EDF0EA 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 3px;
          }
          .skeleton-pill { height: 18px; }
          .skeleton-line { height: 14px; margin-bottom: 8px; }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          .loading-header-row {
            display: flex;
            justify-content: space-between;
          }
        `}</style>
      </div>
    );
  }

  // Empty State: No question yet
  if (!result) {
    return (
      <div className="answer-empty-state">
        <div className="empty-icon-wrap">
          <Scale size={32} strokeWidth={1.5} />
        </div>
        <h3 className="empty-title">{t.emptyAnswerTitle}</h3>
        <p className="empty-desc">{t.emptyAnswerDesc}</p>
        <div className="empty-footer-meta">
          <span>Madhya Pradesh Bhumi Vikas Niyam, 2012</span>
          <span>·</span>
          <span>Indexed to 6 March 2025</span>
        </div>

        <style>{`
          .answer-empty-state {
            background-color: #FFFFFF;
            border: 1px dashed var(--border-color);
            border-radius: 4px;
            padding: 56px 28px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            min-height: 380px;
          }
          .empty-icon-wrap {
            color: var(--primary);
            background-color: var(--soft-green);
            width: 56px;
            height: 56px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }
          .empty-title {
            font-size: 16px;
            color: var(--text-main);
            margin-bottom: 8px;
          }
          .empty-desc {
            font-size: 13px;
            color: var(--text-muted);
            max-width: 440px;
            line-height: 1.5;
            margin-bottom: 24px;
          }
          .empty-footer-meta {
            font-size: 11px;
            color: var(--text-light);
            display: flex;
            gap: 6px;
            font-family: var(--font-mono);
          }
        `}</style>
      </div>
    );
  }

  // Insufficient Evidence State
  if (result.status === 'insufficient_evidence') {
    return (
      <div className="answer-container insufficient-evidence">
        <div className="status-banner banner-warning">
          <AlertCircle size={15} />
          <span>INSUFFICIENT STATUTORY EVIDENCE</span>
        </div>

        <div className="panel-question-header">
          <span className="question-eyebrow">INQUIRY</span>
          <h2 className="panel-question-text">{result.question}</h2>
        </div>

        <div className="insufficient-body">
          <p className="insufficient-text">{result.answer}</p>
          <div className="insufficient-tips">
            <strong>Civic Research Guidance:</strong>
            <ul>
              <li>Confirm if the query relates to the MP Bhumi Vikas Niyam (2012) scope.</li>
              <li>Try searching standard terms: Setbacks, Building Height, Parking Norms, or Basement.</li>
              <li>Local municipal corporation Master Plan zones (e.g., Bhopal Master Plan) may hold specific land-use permissions.</li>
            </ul>
          </div>
        </div>

        <style>{`
          .answer-container {
            background-color: #FFFFFF;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            padding: 24px;
          }
          .status-banner {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.05em;
            padding: 4px 8px;
            border-radius: 2px;
            margin-bottom: 16px;
          }
          .banner-warning {
            background-color: #FBF4E8;
            color: #925807;
            border: 1px solid #EED7B0;
          }
          .panel-question-header {
            margin-bottom: 16px;
            padding-bottom: 14px;
            border-bottom: 1px solid #ECEFEA;
          }
          .question-eyebrow {
            font-size: 10px;
            font-weight: 600;
            color: var(--text-light);
            letter-spacing: 0.08em;
          }
          .panel-question-text {
            font-size: 18px;
            color: var(--text-main);
            margin-top: 4px;
            line-height: 1.35;
          }
          .insufficient-text {
            font-size: 14px;
            color: var(--text-main);
            line-height: 1.6;
            margin-bottom: 18px;
          }
          .insufficient-tips {
            background-color: var(--bg-main);
            border: 1px solid var(--border-color);
            border-radius: 3px;
            padding: 14px 16px;
            font-size: 12.5px;
            color: var(--text-muted);
          }
          .insufficient-tips ul {
            margin-top: 6px;
            padding-left: 20px;
          }
          .insufficient-tips li {
            margin-bottom: 4px;
          }
        `}</style>
      </div>
    );
  }

  // Answered State
  return (
    <article className="answer-container" aria-label="Regulatory Answer">
      {/* Top action header: status tag + save/share */}
      <div className="panel-top-bar">
        <div className="status-badge-wrap">
          <span className="status-pill verified">
            <span className="pulse-dot" />
            <span>STATUTORY RULE MATCH</span>
          </span>
          <span
            className={`demo-disclaimer-pill ${result.isLive ? 'live-rag-pill' : ''}`}
            title={result.isLive ? 'Grounded AI response generated from MP Bhumi Vikas Niyam, 2012' : 'Static demo dataset response'}
          >
            {result.isLive ? 'AI RAG VERIFIED' : 'DEMO PREVIEW'}
          </span>
        </div>

        <div className="panel-actions-group">
          <button
            type="button"
            onClick={onToggleSave}
            className={`action-btn ${isSaved ? 'saved' : ''}`}
            title={isSaved ? t.savedQuestion : t.saveQuestion}
          >
            {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            <span>{isSaved ? t.savedQuestion : t.saveQuestion}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="action-btn"
            title="Share answer reference"
          >
            {copied ? <Check size={14} className="copied-icon" /> : <Share2 size={14} />}
            <span>{copied ? 'Copied' : t.share}</span>
          </button>
        </div>
      </div>

      {/* Selected question header */}
      <div className="panel-question-header">
        <span className="question-eyebrow">INQUIRY</span>
        <h2 className="panel-question-text">{result.question}</h2>
      </div>

      {/* Answer content */}
      <div className="answer-content-body">
        <div className="answer-text">
          <MarkdownRenderer content={result.answer} />
        </div>
      </div>

      {/* Statutory disclosure notice */}
      <div className="accuracy-notice-strip">
        <Info size={13} className="notice-icon" />
        <span>{t.demoNotice}</span>
      </div>

      {/* Sources and citations list */}
      {result.sources && result.sources.length > 0 && (
        <div className="sources-container">
          <div className="sources-header">
            <FileText size={14} className="sources-icon" />
            <h3 className="sources-heading">{t.sourcesLabel}</h3>
          </div>

          <div className="sources-cards-list">
            {result.sources.map((source, idx) => (
              <div key={idx} className="source-citation-card">
                <div className="citation-header">
                  <span className="citation-rule-badge">{source.ruleNumber}</span>
                  <span className="citation-pages">
                    {t.pageRef} {source.pageStart}–{source.pageEnd}
                  </span>
                </div>

                <h4 className="citation-title">{source.title}</h4>

                <blockquote className="citation-quote">
                  "{source.sourceText}"
                </blockquote>

                <div className="citation-footer">
                  <span className="citation-doc-name">{source.documentName}</span>
                  <button
                    type="button"
                    onClick={() => onOpenSourceDoc(source)}
                    className="open-doc-link-btn"
                  >
                    <span>{t.openPdf}</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .answer-container {
          background-color: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 24px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        }

        .panel-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .status-badge-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 3px 8px;
          border-radius: 2px;
        }

        .status-pill.verified {
          background-color: var(--soft-green);
          color: var(--primary);
          border: 1px solid #C9D5C5;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--primary);
        }

        .demo-disclaimer-pill {
          font-size: 10px;
          font-family: var(--font-mono);
          background-color: #F4F6F2;
          color: var(--text-muted);
          border: 1px solid var(--border-color);
          padding: 2px 6px;
          border-radius: 2px;
          letter-spacing: 0.04em;
        }

        .demo-disclaimer-pill.live-rag-pill {
          background-color: #DCFCE7;
          color: #166534;
          border-color: #BBF7D0;
          font-weight: 600;
        }

        .panel-actions-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background-color: #F8FAF7;
          border: 1px solid var(--border-color);
          border-radius: 3px;
          padding: 4px 10px;
          font-size: 12px;
          color: var(--text-muted);
          transition: all 0.15s ease;
        }

        .action-btn:hover {
          background-color: var(--soft-green);
          color: var(--primary);
          border-color: #B5C4B1;
        }

        .action-btn.saved {
          background-color: var(--soft-green);
          color: var(--primary);
          font-weight: 500;
          border-color: #B5C4B1;
        }

        .copied-icon {
          color: #16A34A;
        }

        .panel-question-header {
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #ECEFEA;
        }

        .question-eyebrow {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-light);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .panel-question-text {
          font-family: var(--font-serif);
          font-size: 19px;
          color: var(--text-main);
          margin-top: 4px;
          line-height: 1.35;
          font-weight: 600;
        }

        .answer-content-body {
          margin-bottom: 16px;
        }

        .answer-text {
          font-size: 14.5px;
          color: #242926;
          line-height: 1.65;
        }

        .formatted-markdown-body .md-h2 {
          font-size: 16.5px;
          font-weight: 700;
          color: var(--primary);
          margin: 16px 0 8px 0;
          line-height: 1.35;
        }

        .formatted-markdown-body .md-h3 {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-main);
          margin: 14px 0 6px 0;
          line-height: 1.35;
        }

        .formatted-markdown-body .md-h4 {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-muted);
          margin: 10px 0 4px 0;
        }

        .formatted-markdown-body .md-p {
          margin-bottom: 12px;
          line-height: 1.65;
        }

        .formatted-markdown-body .md-hr {
          border: 0;
          border-top: 1px solid #E5E9E2;
          margin: 16px 0;
        }

        .formatted-markdown-body .md-ul,
        .formatted-markdown-body .md-ol {
          margin: 8px 0 14px 20px;
          padding: 0;
          line-height: 1.6;
        }

        .formatted-markdown-body li {
          margin-bottom: 5px;
        }

        .md-table-wrapper {
          overflow-x: auto;
          margin: 14px 0 16px 0;
          border: 1px solid #DFE5DC;
          border-radius: 4px;
        }

        .md-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          text-align: left;
        }

        .md-table th {
          background-color: #F1F4EE;
          color: var(--text-main);
          font-weight: 600;
          padding: 8px 12px;
          border-bottom: 1px solid #DFE5DC;
        }

        .md-table td {
          padding: 8px 12px;
          border-bottom: 1px solid #ECEFEA;
          color: #333C36;
        }

        .md-table tr:last-child td {
          border-bottom: none;
        }

        .md-table tr:nth-child(even) {
          background-color: #FAFCF9;
        }

        .accuracy-notice-strip {
          display: flex;
          align-items: center;
          gap: 7px;
          background-color: #F7F9F5;
          border: 1px solid var(--border-subtle);
          border-radius: 2px;
          padding: 7px 10px;
          font-size: 11.5px;
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        .notice-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        .sources-container {
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px solid var(--border-color);
        }

        .sources-header {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 12px;
        }

        .sources-icon {
          color: var(--primary);
        }

        .sources-heading {
          font-family: var(--font-sans);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-main);
        }

        .sources-cards-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .source-citation-card {
          background-color: #FAFBF9;
          border: 1px solid var(--border-color);
          border-radius: 3px;
          padding: 14px;
        }

        .citation-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .citation-rule-badge {
          font-family: var(--font-mono);
          font-size: 11.5px;
          font-weight: 600;
          color: var(--primary);
          background-color: #E2EAE4;
          padding: 2px 7px;
          border-radius: 2px;
          border: 1px solid #CAD8CD;
        }

        .citation-pages {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-light);
        }

        .citation-title {
          font-family: var(--font-serif);
          font-size: 14px;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .citation-quote {
          font-size: 13px;
          line-height: 1.55;
          color: #38403B;
          background-color: #FFFFFF;
          border-left: 3px solid var(--primary);
          padding: 8px 12px;
          margin-bottom: 10px;
          border-radius: 0 2px 2px 0;
          font-style: italic;
        }

        .citation-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 8px;
          border-top: 1px solid #ECEFEA;
          font-size: 11.5px;
        }

        .citation-doc-name {
          color: var(--text-light);
          font-family: var(--font-mono);
          font-size: 11px;
        }

        .open-doc-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--primary);
          font-weight: 500;
          font-size: 11.5px;
          padding: 2px 4px;
          border-radius: 2px;
        }

        .open-doc-link-btn:hover {
          text-decoration: underline;
        }
      `}</style>
    </article>
  );
}
