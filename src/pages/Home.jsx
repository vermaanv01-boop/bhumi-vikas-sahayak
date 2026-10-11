import React, { useState, useEffect } from 'react';
import {
  Clock,
  Sparkles,
  Bookmark,
  Share2,
  FileText,
  MapPin,
  Trash2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import QuestionInput from '../components/QuestionInput';
import SuggestedQuestions from '../components/SuggestedQuestions';
import AnswerPanel from '../components/AnswerPanel';
import SourceDocumentPanel from '../components/SourceDocumentPanel';
import LocationPanel from '../components/LocationPanel';
import { askQuestion } from '../services/assistantService';
import { UI_TRANSLATIONS, REGULATION_DISCLAIMER } from '../data/demoData';

export default function Home({
  language,
  selectedLocation,
  setSelectedLocation,
  recentQuestions,
  setRecentQuestions,
  savedQuestions,
  setSavedQuestions,
  currentResult,
  setCurrentResult,
  activeRightTab,
  setActiveRightTab
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const [questionText, setQuestionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSource, setActiveSource] = useState(null);

  // If currentResult changes and has sources, default activeSource to first source
  useEffect(() => {
    if (currentResult && currentResult.sources && currentResult.sources.length > 0) {
      setActiveSource(currentResult.sources[0]);
    }
  }, [currentResult]);

  const handleExecuteQuestion = async (queryToAsk) => {
    const trimmed = (queryToAsk || questionText).trim();
    if (!trimmed) return;

    setIsLoading(true);
    setActiveRightTab('answer');

    try {
      const response = await askQuestion({
        question: trimmed,
        language,
        location: selectedLocation
      });

      setCurrentResult(response);

      // Add to recent questions (limit 8, unique by question text)
      setRecentQuestions((prev) => {
        const filtered = prev.filter((item) => item.question.toLowerCase() !== trimmed.toLowerCase());
        const updated = [
          {
            id: Date.now().toString(),
            question: trimmed,
            timestamp: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            }),
            status: response.status
          },
          ...filtered
        ].slice(0, 8);

        try {
          localStorage.setItem('bhumi_recent_queries', JSON.stringify(updated));
        } catch (e) {}

        return updated;
      });
    } catch (err) {
      setCurrentResult({
        question: trimmed,
        answer: 'An unexpected error occurred while querying the regulatory index.',
        language,
        status: 'error',
        sources: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggested = (text) => {
    setQuestionText(text);
    handleExecuteQuestion(text);
  };

  const handleSelectRecent = (recentItem) => {
    setQuestionText(recentItem.question);
    handleExecuteQuestion(recentItem.question);
  };

  const handleClearRecent = () => {
    setRecentQuestions([]);
    try {
      localStorage.removeItem('bhumi_recent_queries');
    } catch (e) {}
  };

  const isCurrentSaved = Boolean(
    currentResult &&
    savedQuestions.some((item) => item.question.toLowerCase() === currentResult.question?.toLowerCase())
  );

  const handleToggleSave = () => {
    if (!currentResult) return;

    setSavedQuestions((prev) => {
      let updated;
      if (isCurrentSaved) {
        updated = prev.filter((item) => item.question.toLowerCase() !== currentResult.question.toLowerCase());
      } else {
        updated = [
          {
            id: Date.now().toString(),
            question: currentResult.question,
            answer: currentResult.answer,
            status: currentResult.status,
            sources: currentResult.sources,
            savedAt: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          },
          ...prev
        ];
      }

      try {
        localStorage.setItem('bhumi_saved_queries', JSON.stringify(updated));
      } catch (e) {}

      return updated;
    });
  };

  const handleOpenSourceDoc = (source) => {
    setActiveSource(source);
    setActiveRightTab('source');
  };

  return (
    <div className="workspace-columns">
      {/* Left Column: Introductions, Questions, Suggested, Recents */}
      <div className="workspace-left-col">
        {/* Editorial Civic Introduction */}
        <section className="intro-block" aria-label="Introduction">
          <div className="eyebrow-line">
            <span className="eyebrow-badge">{t.eyebrow}</span>
            <span className="eyebrow-divider">|</span>
            <span className="eyebrow-statute">M.P. BHUMI VIKAS NIYAM, 2012</span>
          </div>

          <h1 className="intro-heading">{t.tagline}</h1>

          <p className="intro-desc">{t.introDescription}</p>

          <div className="statute-coverage-bar">
            <ShieldAlert size={14} className="coverage-icon" />
            <span>
              Consolidated through <strong>{REGULATION_DISCLAIMER.coverageDate}</strong>.
              Assistive statutory reference, not certified clearance.
            </span>
          </div>
        </section>

        {/* Question Input */}
        <QuestionInput
          value={questionText}
          onChange={setQuestionText}
          onSubmit={() => handleExecuteQuestion()}
          isLoading={isLoading}
          language={language}
        />

        {/* Suggested Questions */}
        <SuggestedQuestions
          onSelectQuestion={handleSelectSuggested}
          language={language}
        />

        {/* Recent Inquiries List */}
        <section className="recent-questions-section" aria-label="Recent inquiries">
          <div className="recent-header-row">
            <div className="recent-title-wrap">
              <Clock size={13} className="recent-icon" />
              <h3 className="recent-heading">{t.recentHeading}</h3>
            </div>
            {recentQuestions.length > 0 && (
              <button
                type="button"
                onClick={handleClearRecent}
                className="clear-recent-btn"
                title="Clear recent inquiry history"
              >
                <Trash2 size={12} />
                <span>{t.clearHistory}</span>
              </button>
            )}
          </div>

          {recentQuestions.length === 0 ? (
            <div className="recent-empty">
              <span>{t.noRecent}</span>
            </div>
          ) : (
            <div className="recent-list">
              {recentQuestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectRecent(item)}
                  className="recent-item-btn"
                >
                  <span className="recent-text">{item.question}</span>
                  <span className="recent-meta">
                    <span className="recent-time">{item.timestamp}</span>
                    <ArrowRight size={12} className="recent-arrow" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Right Column: Answer, Source Document, Map/Location tabs */}
      <div className="workspace-right-col">
        {/* Right Tab Bar */}
        <div className="right-tabs-header" role="tablist">
          <div className="tabs-nav-group">
            <button
              type="button"
              role="tab"
              aria-selected={activeRightTab === 'answer'}
              className={`workspace-tab ${activeRightTab === 'answer' ? 'active' : ''}`}
              onClick={() => setActiveRightTab('answer')}
            >
              <span>{t.tabAnswer}</span>
              {currentResult && currentResult.sources?.length > 0 && (
                <span className="tab-counter">{currentResult.sources.length}</span>
              )}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeRightTab === 'source'}
              className={`workspace-tab ${activeRightTab === 'source' ? 'active' : ''}`}
              onClick={() => setActiveRightTab('source')}
            >
              <FileText size={13} className="tab-icon" />
              <span>{t.tabSourceDoc}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeRightTab === 'location'}
              className={`workspace-tab ${activeRightTab === 'location' ? 'active' : ''}`}
              onClick={() => setActiveRightTab('location')}
            >
              <MapPin size={13} className="tab-icon" />
              <span>{t.tabMapLocation}</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="right-tab-panel-body">
          {activeRightTab === 'answer' && (
            <AnswerPanel
              result={currentResult}
              isLoading={isLoading}
              onOpenSourceDoc={handleOpenSourceDoc}
              isSaved={isCurrentSaved}
              onToggleSave={handleToggleSave}
              language={language}
            />
          )}

          {activeRightTab === 'source' && (
            <SourceDocumentPanel
              activeSource={activeSource}
              language={language}
            />
          )}

          {activeRightTab === 'location' && (
            <LocationPanel
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              language={language}
            />
          )}
        </div>
      </div>

      <style>{`
        .intro-block {
          margin-bottom: 22px;
        }

        .eyebrow-line {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .eyebrow-badge {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--primary);
          background-color: var(--soft-green);
          padding: 2px 7px;
          border-radius: 2px;
          border: 1px solid #C8D4C5;
        }

        .eyebrow-divider {
          color: #CCD4CA;
          font-size: 11px;
        }

        .eyebrow-statute {
          font-size: 11px;
          letter-spacing: 0.06em;
          color: var(--text-light);
          font-weight: 500;
        }

        .intro-heading {
          font-family: var(--font-serif);
          font-size: 26px;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.25;
          margin-bottom: 10px;
          letter-spacing: -0.015em;
        }

        .intro-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.55;
          margin-bottom: 14px;
        }

        .statute-coverage-bar {
          display: flex;
          align-items: center;
          gap: 7px;
          background-color: #F3F5F0;
          border: 1px solid var(--border-color);
          border-radius: 3px;
          padding: 6px 10px;
          font-size: 11px;
          color: var(--text-muted);
        }

        .coverage-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        .recent-questions-section {
          margin-top: 10px;
        }

        .recent-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .recent-title-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .recent-icon {
          color: var(--text-light);
        }

        .recent-heading {
          font-family: var(--font-sans);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .clear-recent-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--text-light);
          padding: 2px 6px;
          border-radius: 2px;
          transition: color 0.15s ease;
        }

        .clear-recent-btn:hover {
          color: #991B1B;
        }

        .recent-empty {
          background-color: #FFFFFF;
          border: 1px dashed var(--border-color);
          border-radius: 3px;
          padding: 12px 14px;
          font-size: 12px;
          color: var(--text-light);
          text-align: center;
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .recent-item-btn {
          background-color: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 3px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          gap: 12px;
          transition: background-color 0.15s ease, border-color 0.15s ease;
        }

        .recent-item-btn:hover {
          background-color: var(--soft-green);
          border-color: #B5C4B1;
        }

        .recent-text {
          font-size: 12.5px;
          color: var(--text-main);
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .recent-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .recent-time {
          font-size: 10px;
          font-family: var(--font-mono);
          color: var(--text-light);
        }

        .recent-arrow {
          color: var(--primary);
          opacity: 0.6;
        }

        .recent-item-btn:hover .recent-arrow {
          opacity: 1;
        }

        /* Right column tab navigation */
        .right-tabs-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 20px;
          padding-bottom: 2px;
        }

        .tabs-nav-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .workspace-tab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-muted);
          border-bottom: 2px solid transparent;
          transition: all 0.15s ease;
        }

        .workspace-tab:hover {
          color: var(--text-main);
        }

        .workspace-tab.active {
          color: var(--primary);
          font-weight: 600;
          border-bottom: 2px solid var(--primary);
        }

        .tab-icon {
          color: inherit;
        }

        .tab-counter {
          font-size: 10px;
          font-family: var(--font-mono);
          background-color: var(--soft-green);
          color: var(--primary);
          padding: 1px 5px;
          border-radius: 10px;
          font-weight: 600;
        }

        .right-tab-panel-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}
