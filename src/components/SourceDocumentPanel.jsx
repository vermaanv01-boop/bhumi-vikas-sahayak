import React from 'react';
import { FileText, Download, ZoomIn, ZoomOut, RotateCcw, AlertCircle, Bookmark, ExternalLink } from 'lucide-react';
import { UI_TRANSLATIONS, REGULATION_DISCLAIMER } from '../data/demoData';

export default function SourceDocumentPanel({ activeSource, language = 'en' }) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const docTitle = activeSource?.documentName || "MP_Bhumi_Vikas_Niyam_2012_Consolidated.pdf";
  const pageRange = activeSource ? `Pages ${activeSource.pageStart}–${activeSource.pageEnd}` : "Full Document (Consolidated)";

  return (
    <div className="source-doc-panel" aria-label="Source Document Viewer">
      {/* Top Document Toolbar */}
      <div className="doc-toolbar">
        <div className="doc-meta-info">
          <FileText size={16} className="doc-icon" />
          <div>
            <div className="doc-file-name">{docTitle}</div>
            <div className="doc-sub-info">
              <span>{pageRange}</span>
              <span className="dot-sep">·</span>
              <span>Govt. of Madhya Pradesh Urban Development Dept.</span>
            </div>
          </div>
        </div>

        <div className="doc-actions">
          <div className="doc-zoom-controls">
            <button type="button" className="doc-tool-btn" title="Zoom Out" disabled aria-label="Zoom Out">
              <ZoomOut size={13} />
            </button>
            <span className="zoom-level">100%</span>
            <button type="button" className="doc-tool-btn" title="Zoom In" disabled aria-label="Zoom In">
              <ZoomIn size={13} />
            </button>
          </div>
          <span className="action-sep">|</span>
          <button
            type="button"
            className="doc-tool-btn download-btn"
            title="Download reference PDF"
            onClick={() => alert("Reference document download placeholder. In production, this links to the official Urban Development Department gazette notification.")}
          >
            <Download size={13} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* RAG-Ready Viewer Window */}
      <div className="doc-viewer-canvas">
        {activeSource ? (
          <div className="gazette-preview-sheet">
            <div className="gazette-header">
              <div className="gazette-coat">मध्य प्रदेश राजपत्र (असाधारण)</div>
              <div className="gazette-authority">THE MADHYA PRADESH BHUMI VIKAS NIYAM, 2012</div>
              <div className="gazette-date">Consolidated Amendments up to {REGULATION_DISCLAIMER.coverageDate}</div>
              <div className="gazette-rule-tag">{activeSource.ruleNumber}</div>
            </div>

            <div className="gazette-body">
              <h3 className="gazette-section-title">{activeSource.title}</h3>
              <div className="gazette-rule-block">
                <span className="rule-num-lead">[{activeSource.ruleNumber}]</span>
                <p className="gazette-rule-text">{activeSource.sourceText}</p>
              </div>

              <div className="gazette-commentary">
                <div className="commentary-header">
                  <AlertCircle size={14} className="commentary-icon" />
                  <span>STATUTORY CITATION METADATA</span>
                </div>
                <p>
                  Extracted from official gazette notification on building controls and development sanctions.
                  Section references correspond to the codified text in force through {REGULATION_DISCLAIMER.coverageDate}.
                </p>
              </div>
            </div>

            <div className="gazette-page-footer">
              <span>Page {activeSource.pageStart} of 148</span>
              <span>Urban Administration & Development Directorate, MP</span>
            </div>
          </div>
        ) : (
          <div className="doc-empty-canvas">
            <div className="doc-empty-icon">
              <FileText size={40} strokeWidth={1.4} />
            </div>
            <h3 className="doc-empty-title">{t.pdfStatusEmpty}</h3>
            <p className="doc-empty-desc">{t.pdfStatusDesc}</p>
            <div className="doc-backend-notice">
              <strong>RAG Architecture Pipeline:</strong>
              <p>
                Frontend communicates with <code>/api/ask</code> via <code>assistantService.js</code>.
                Backend returns exact <code>pageStart</code> and <code>pageEnd</code> numbers, enabling deep-linking into the PDF reader.
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .source-doc-panel {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          min-height: 520px;
          height: 100%;
        }

        .doc-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: #F4F6F2;
          border-bottom: 1px solid var(--border-color);
          flex-wrap: wrap;
          gap: 10px;
        }

        .doc-meta-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .doc-icon {
          color: var(--primary);
        }

        .doc-file-name {
          font-family: var(--font-mono);
          font-size: 12.5px;
          font-weight: 600;
          color: var(--text-main);
        }

        .doc-sub-info {
          font-size: 11px;
          color: var(--text-muted);
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .dot-sep {
          color: #B0B8AE;
        }

        .doc-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .doc-zoom-controls {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 3px;
          padding: 2px 6px;
        }

        .doc-tool-btn {
          color: var(--text-muted);
          padding: 3px 5px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .doc-tool-btn:hover:not(:disabled) {
          color: var(--primary);
          background: var(--soft-green);
        }

        .doc-tool-btn:disabled {
          opacity: 0.5;
          cursor: default;
        }

        .zoom-level {
          font-size: 11px;
          font-family: var(--font-mono);
          color: var(--text-muted);
          padding: 0 4px;
        }

        .action-sep {
          color: #D0D8CD;
        }

        .download-btn {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          padding: 3px 8px;
          font-size: 11.5px;
        }

        .doc-viewer-canvas {
          flex: 1;
          background: #E8ECE6;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .gazette-preview-sheet {
          background: #FFFFFF;
          max-width: 620px;
          width: 100%;
          border: 1px solid #CFD8CD;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 36px 40px;
          font-family: var(--font-serif);
        }

        .gazette-header {
          text-align: center;
          border-bottom: 2px solid var(--text-main);
          padding-bottom: 16px;
          margin-bottom: 24px;
        }

        .gazette-coat {
          font-family: var(--font-serif);
          font-size: 15px;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.04em;
        }

        .gazette-authority {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-main);
          margin-top: 4px;
          letter-spacing: 0.05em;
        }

        .gazette-date {
          font-size: 11px;
          color: var(--text-muted);
          font-family: var(--font-sans);
          margin-top: 2px;
        }

        .gazette-rule-tag {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 11px;
          background: var(--soft-green);
          color: var(--primary);
          padding: 2px 8px;
          border-radius: 2px;
          margin-top: 8px;
          border: 1px solid #CAD5C6;
        }

        .gazette-body {
          margin-bottom: 28px;
        }

        .gazette-section-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 14px;
          color: var(--text-main);
          border-left: 3px solid var(--primary);
          padding-left: 10px;
        }

        .gazette-rule-block {
          margin-bottom: 20px;
          font-size: 14px;
          line-height: 1.7;
          color: #2D332F;
        }

        .rule-num-lead {
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--primary);
          margin-right: 6px;
        }

        .gazette-rule-text {
          display: inline;
        }

        .gazette-commentary {
          background: #F8FAF6;
          border: 1px solid #DEE6DC;
          border-radius: 3px;
          padding: 12px 14px;
          font-family: var(--font-sans);
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .commentary-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: var(--primary);
          font-size: 11px;
          margin-bottom: 4px;
          letter-spacing: 0.05em;
        }

        .commentary-icon {
          color: var(--primary);
        }

        .gazette-page-footer {
          border-top: 1px solid var(--border-color);
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-family: var(--font-mono);
          color: var(--text-light);
        }

        .doc-empty-canvas {
          max-width: 460px;
          text-align: center;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .doc-empty-icon {
          color: var(--primary);
          background: #FFFFFF;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .doc-empty-title {
          font-size: 16px;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .doc-empty-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .doc-backend-notice {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 3px;
          padding: 14px 16px;
          text-align: left;
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .doc-backend-notice code {
          background: var(--soft-green);
          padding: 2px 4px;
          border-radius: 2px;
          font-family: var(--font-mono);
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}
