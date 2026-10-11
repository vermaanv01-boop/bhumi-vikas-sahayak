import React from 'react';
import { ShieldAlert, BookOpen, Layers, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { REGULATION_DISCLAIMER } from '../data/demoData';

export default function About({ language = 'en' }) {
  return (
    <div className="about-page-wrap">
      <div className="about-header-block">
        <div className="about-eyebrow">CIVIC RESEARCH & REGULATORY INTELLIGENCE</div>
        <h1 className="about-title">About Bhumi Vikas Sahayak</h1>
        <p className="about-lead">
          Bhumi Vikas Sahayak is a specialized civic-technology research interface designed to assist architects, civil engineers, property owners, and urban planners in navigating the Madhya Pradesh Bhumi Vikas Niyam, 2012.
        </p>
      </div>

      {/* Mandatory Statutory Notice */}
      <section className="notice-card mandatory-alert" aria-label="Statutory Limitation Disclosure">
        <div className="alert-head">
          <ShieldAlert size={20} className="alert-icon" />
          <h2 className="alert-title">Scope & Data Accuracy Disclosure</h2>
        </div>
        <div className="alert-text">
          <p>
            The consolidated rules, tables, and schedules indexed within this interface extend through <strong>{REGULATION_DISCLAIMER.coverageDate}</strong>.
          </p>
          <ul className="alert-list">
            <li>
              <strong>Non-Exhaustive Civic Guidance:</strong> This interface provides assistive legal research and document lookup. It does not replace official gazette notifications, nor does it guarantee absence of subsequent municipal circle notifications or state gazette amendments issued after 6 March 2025.
            </li>
            <li>
              <strong>No Official Certification:</strong> This system does not issue building permissions, sanctions, certificates of occupancy, or land-title confirmations. Official permissions require formal application through the Directorate of Town & Country Planning (T&CP) or the concerned Municipal Corporation under Rule 14.
            </li>
            <li>
              <strong>No Government Affiliation:</strong> Bhumi Vikas Sahayak is an independent public-interest research tool and is not officially operated by the Urban Administration & Development Department of Madhya Pradesh.
            </li>
          </ul>
        </div>
      </section>

      {/* RAG-Ready Architecture */}
      <section className="about-section">
        <div className="section-head">
          <Layers size={18} className="section-icon" />
          <h2 className="section-title">Production Frontend & RAG Pipeline Architecture</h2>
        </div>
        <p className="section-p">
          This frontend is structured to enable clean decoupling from backend retrieval and generative models:
        </p>

        <div className="arch-cards-grid">
          <div className="arch-card">
            <span className="arch-badge">CLIENT LAYER</span>
            <h3 className="arch-card-title">Frontend Integration Boundary</h3>
            <p className="arch-card-desc">
              All statutory queries route through a single service function: <code>assistantService.askQuestion()</code>.
              Components remain completely decoupled from retrieval mechanisms, prompt templates, and AI SDKs.
            </p>
          </div>

          <div className="arch-card">
            <span className="arch-badge">RAG CONTRACT</span>
            <h3 className="arch-card-title">Standardized Response Schema</h3>
            <p className="arch-card-desc">
              Maintains strict schema compliance: <code>status ('answered' | 'insufficient_evidence' | 'error')</code>,
              exact rule metadata, page numbers (<code>pageStart</code>, <code>pageEnd</code>), and source document references.
            </p>
          </div>

          <div className="arch-card">
            <span className="arch-badge">SECURITY & SECRETS</span>
            <h3 className="arch-card-title">Zero Frontend Credential Exposure</h3>
            <p className="arch-card-desc">
              No database clients, AI API keys, or vector credentials exist in the client bundle. The forthcoming Express API will securely manage vector retrieval and LLM inference.
            </p>
          </div>
        </div>
      </section>

      {/* Applicable Statutes */}
      <section className="about-section">
        <div className="section-head">
          <BookOpen size={18} className="section-icon" />
          <h2 className="section-title">Governing Statutory Framework</h2>
        </div>

        <div className="statute-details-table">
          <div className="table-row">
            <div className="table-col label">Principal Regulation</div>
            <div className="table-col val">Madhya Pradesh Bhumi Vikas Niyam, 2012</div>
          </div>
          <div className="table-row">
            <div className="table-col label">Parent Legislation</div>
            <div className="table-col val">Madhya Pradesh Nagar Tatha Gram Nivesh Adhiniyam, 1973 (Act No. 23 of 1973)</div>
          </div>
          <div className="table-row">
            <div className="table-col label">Enacting Authority</div>
            <div className="table-col val">Housing & Environment Department, Govt. of Madhya Pradesh</div>
          </div>
          <div className="table-row">
            <div className="table-col label">Current Codification Horizon</div>
            <div className="table-col val">Consolidated amendments up to 6 March 2025</div>
          </div>
        </div>
      </section>

      <style>{`
        .about-page-wrap {
          padding: 36px 48px;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }

        .about-header-block {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 28px;
        }

        .about-eyebrow {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          color: var(--primary);
          font-weight: 600;
          margin-bottom: 6px;
        }

        .about-title {
          font-size: 28px;
          color: var(--text-main);
          font-weight: 600;
          margin-bottom: 10px;
        }

        .about-lead {
          font-size: 15px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .notice-card.mandatory-alert {
          background-color: #FDF9F2;
          border: 1px solid #EAD8B8;
          border-radius: 4px;
          padding: 20px 22px;
          margin-bottom: 32px;
        }

        .alert-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .alert-icon {
          color: #925807;
          flex-shrink: 0;
        }

        .alert-title {
          font-family: var(--font-serif);
          font-size: 17px;
          color: #724504;
          font-weight: 600;
        }

        .alert-text p {
          font-size: 13.5px;
          color: #4C3717;
          line-height: 1.55;
          margin-bottom: 12px;
        }

        .alert-list {
          padding-left: 20px;
          font-size: 13px;
          color: #553E1B;
          line-height: 1.6;
        }

        .alert-list li {
          margin-bottom: 8px;
        }

        .about-section {
          margin-bottom: 34px;
        }

        .section-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .section-icon {
          color: var(--primary);
        }

        .section-title {
          font-family: var(--font-serif);
          font-size: 19px;
          color: var(--text-main);
          font-weight: 600;
        }

        .section-p {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 18px;
        }

        .arch-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 14px;
        }

        .arch-card {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 16px 18px;
        }

        .arch-badge {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 600;
          color: var(--primary);
          background: var(--soft-green);
          padding: 2px 6px;
          border-radius: 2px;
          display: inline-block;
          margin-bottom: 8px;
        }

        .arch-card-title {
          font-family: var(--font-sans);
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .arch-card-desc {
          font-size: 12.5px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .arch-card-desc code {
          background: #EEF2EB;
          font-family: var(--font-mono);
          padding: 1px 4px;
          border-radius: 2px;
          font-size: 11px;
          color: var(--primary);
        }

        .statute-details-table {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          overflow: hidden;
        }

        .table-row {
          display: flex;
          border-bottom: 1px solid #ECEFEA;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-col {
          padding: 12px 16px;
          font-size: 13px;
        }

        .table-col.label {
          width: 220px;
          background: #FAFBF9;
          font-weight: 600;
          color: var(--text-muted);
          border-right: 1px solid #ECEFEA;
          flex-shrink: 0;
        }

        .table-col.val {
          color: var(--text-main);
          flex: 1;
        }

        @media (max-width: 600px) {
          .about-page-wrap {
            padding: 20px 16px;
          }
          .table-row {
            flex-direction: column;
          }
          .table-col.label {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #ECEFEA;
          }
        }
      `}</style>
    </div>
  );
}
