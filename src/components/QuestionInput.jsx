import React, { useRef, useEffect } from 'react';
import { Send, CornerDownLeft, Loader2, X } from 'lucide-react';
import { UI_TRANSLATIONS } from '../data/demoData';

export default function QuestionInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  language = 'en'
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const textareaRef = useRef(null);

  // Auto-resize textarea to fit content neatly up to max height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [value]);

  const handleKeyDown = (e) => {
    // Enter sends query unless Shift is pressed
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) {
        onSubmit();
      }
    }
  };

  const handleClear = () => {
    onChange('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="question-input-card">
      <div className="input-field-wrapper">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.inputPlaceholder}
          rows={2}
          className="question-textarea"
          disabled={isLoading}
          aria-label="Ask about MP building regulations"
        />

        {value && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-input-btn"
            title="Clear question"
            aria-label="Clear input text"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="input-toolbar">
        <div className="input-hints">
          <span className="key-hint">
            <CornerDownLeft size={11} className="key-hint-icon" />
            <span><strong>Enter</strong> to ask</span>
          </span>
          <span className="hint-divider">·</span>
          <span className="key-hint">
            <span><strong>Shift + Enter</strong> for new line</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="ask-submit-btn"
          aria-label="Submit question"
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="spin-icon" />
              <span>{t.askingButton}</span>
            </>
          ) : (
            <>
              <span>{t.askButton}</span>
              <Send size={13} />
            </>
          )}
        </button>
      </div>

      <style>{`
        .question-input-card {
          background-color: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 12px 14px 10px 14px;
          margin-bottom: 24px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .question-input-card:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 1px var(--primary);
        }

        .input-field-wrapper {
          position: relative;
          display: flex;
          align-items: flex-start;
        }

        .question-textarea {
          width: 100%;
          border: none;
          background: transparent;
          font-family: var(--font-sans);
          font-size: 14.5px;
          line-height: 1.45;
          color: var(--text-main);
          resize: none;
          outline: none;
          min-height: 48px;
          padding-right: 28px;
        }

        .question-textarea::placeholder {
          color: #9AA39C;
          font-style: normal;
        }

        .clear-input-btn {
          position: absolute;
          right: 0;
          top: 2px;
          color: #8C968F;
          padding: 4px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clear-input-btn:hover {
          color: var(--text-main);
          background-color: #F1F4EE;
        }

        .input-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          margin-top: 6px;
          border-top: 1px solid #EEF1EB;
        }

        .input-hints {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: var(--text-light);
        }

        .key-hint {
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }

        .key-hint-icon {
          color: var(--text-light);
        }

        .hint-divider {
          color: #CBD3C8;
        }

        .ask-submit-btn {
          background-color: var(--primary);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 500;
          padding: 7px 16px;
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: background-color 0.15s ease;
        }

        .ask-submit-btn:hover:not(:disabled) {
          background-color: var(--primary-hover);
        }

        .ask-submit-btn:disabled {
          background-color: #B2C2BB;
          cursor: not-allowed;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 540px) {
          .input-hints {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
