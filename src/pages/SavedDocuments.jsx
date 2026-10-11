import React from 'react';
import { Bookmark, Trash2, ArrowUpRight, FileText, Calendar } from 'lucide-react';
import { UI_TRANSLATIONS } from '../data/demoData';

export default function SavedDocuments({
  savedQuestions,
  setSavedQuestions,
  onOpenQuestion,
  language = 'en'
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const handleRemove = (questionText) => {
    setSavedQuestions((prev) => {
      const updated = prev.filter(
        (item) => item.question.toLowerCase() !== questionText.toLowerCase()
      );
      try {
        localStorage.setItem('bhumi_saved_queries', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all saved inquiries?")) {
      setSavedQuestions([]);
      try {
        localStorage.removeItem('bhumi_saved_queries');
      } catch (e) {}
    }
  };

  return (
    <div className="saved-page-wrap">
      <div className="saved-header-row">
        <div>
          <div className="saved-eyebrow">RESEARCH ARCHIVE</div>
          <h1 className="saved-title">Saved Questions & Rule Citations</h1>
          <p className="saved-desc">
            Your archived building regulations inquiries, statutory interpretations, and verified gazette references.
          </p>
        </div>

        {savedQuestions.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="clear-all-btn"
          >
            <Trash2 size={13} />
            <span>Clear Archive</span>
          </button>
        )}
      </div>

      {savedQuestions.length === 0 ? (
        <div className="saved-empty-container">
          <div className="saved-empty-icon">
            <Bookmark size={32} strokeWidth={1.5} />
          </div>
          <h3 className="empty-heading">No saved inquiries in this session</h3>
          <p className="empty-sub">
            Click the "Save" action on any regulatory response in the workspace to store key rules and citations for quick retrieval.
          </p>
        </div>
      ) : (
        <div className="saved-cards-list">
          {savedQuestions.map((item, idx) => (
            <article key={item.id || idx} className="saved-item-card">
              <div className="saved-card-header">
                <div className="saved-card-date">
                  <Calendar size={12} />
                  <span>{item.savedAt || 'Saved'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(item.question)}
                  className="remove-saved-btn"
                  title="Remove from saved archive"
                >
                  <Trash2 size={13} />
                  <span>Remove</span>
                </button>
              </div>

              <h3 className="saved-card-question">{item.question}</h3>
              <p className="saved-card-answer">{item.answer}</p>

              {item.sources && item.sources.length > 0 && (
                <div className="saved-rules-strip">
                  <span className="strip-label">Cited Rules:</span>
                  <div className="strip-tags">
                    {item.sources.map((s, sIdx) => (
                      <span key={sIdx} className="rule-badge">
                        {s.ruleNumber} (pp. {s.pageStart}–{s.pageEnd})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="saved-card-footer">
                <button
                  type="button"
                  onClick={() => onOpenQuestion(item)}
                  className="view-in-workspace-btn"
                >
                  <span>Open in Workspace</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <style>{`
        .saved-page-wrap {
          padding: 36px 48px;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }

        .saved-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 28px;
          gap: 16px;
        }

        .saved-eyebrow {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          color: var(--primary);
          font-weight: 600;
          margin-bottom: 6px;
        }

        .saved-title {
          font-size: 26px;
          color: var(--text-main);
          font-weight: 600;
          margin-bottom: 6px;
        }

        .saved-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .clear-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #8C5353;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 3px;
          padding: 6px 12px;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .clear-all-btn:hover {
          color: #DC2626;
          border-color: #DC2626;
        }

        .saved-empty-container {
          background: #FFFFFF;
          border: 1px dashed var(--border-color);
          border-radius: 4px;
          padding: 60px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .saved-empty-icon {
          color: var(--primary);
          background: var(--soft-green);
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .empty-heading {
          font-size: 16px;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .empty-sub {
          font-size: 13px;
          color: var(--text-muted);
          max-width: 440px;
          line-height: 1.5;
        }

        .saved-cards-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .saved-item-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 20px 22px;
        }

        .saved-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .saved-card-date {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-family: var(--font-mono);
          color: var(--text-light);
        }

        .remove-saved-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--text-light);
          padding: 2px 6px;
        }

        .remove-saved-btn:hover {
          color: #DC2626;
        }

        .saved-card-question {
          font-family: var(--font-serif);
          font-size: 17px;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .saved-card-answer {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.55;
          margin-bottom: 14px;
        }

        .saved-rules-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .strip-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-light);
          text-transform: uppercase;
        }

        .strip-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .rule-badge {
          font-family: var(--font-mono);
          font-size: 11px;
          background: var(--soft-green);
          color: var(--primary);
          padding: 2px 7px;
          border-radius: 2px;
          border: 1px solid #CAD5C6;
        }

        .saved-card-footer {
          border-top: 1px solid #ECEFEA;
          padding-top: 12px;
        }

        .view-in-workspace-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--primary);
        }

        .view-in-workspace-btn:hover {
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .saved-page-wrap {
            padding: 20px 16px;
          }
        }
      `}</style>
    </div>
  );
}
