import React from 'react';
import { MapPin, Building2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SAMPLE_LOCATIONS, UI_TRANSLATIONS } from '../data/demoData';

export default function LocationPanel({
  selectedLocation,
  setSelectedLocation,
  language = 'en'
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const activeLocObj = SAMPLE_LOCATIONS.find((l) => l.id === selectedLocation) || SAMPLE_LOCATIONS[0];

  return (
    <div className="location-panel" aria-label="Jurisdiction and Location Selection">
      {/* Top Header */}
      <div className="location-panel-header">
        <div className="header-meta">
          <MapPin size={16} className="loc-icon" />
          <h3 className="location-heading">{t.locationNotice}</h3>
        </div>
        <span className="location-tag">MP STATUTORY BYLAWS</span>
      </div>

      <div className="location-panel-content">
        <p className="location-explainer">{t.locationDesc}</p>

        {/* Responsible civic disclaimer */}
        <div className="jurisdiction-disclaimer-box">
          <div className="disclaimer-title-row">
            <AlertTriangle size={15} className="disclaimer-icon" />
            <span>IMPORTANT JURISDICTION BOUNDARY NOTICE</span>
          </div>
          <p className="disclaimer-body">
            Selecting a location customizes local planning authority references and bylaw schedules.
            <strong> It does NOT determine specific cadastral plot boundaries, zoning clearance, or title rights.</strong>
            Cadastral demarcations require ground survey and official sanction from the Directorate of Town and Country Planning (T&CP) or the respective Municipal Corporation.
          </p>
        </div>

        {/* Location selector cards */}
        <div className="locations-list">
          <div className="list-title">SELECT PLANNING AREA:</div>
          {SAMPLE_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                className={`loc-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedLocation(loc.id)}
              >
                <div className="loc-card-main">
                  <div className="loc-bullet-wrap">
                    {isSelected ? (
                      <CheckCircle2 size={16} className="check-icon" />
                    ) : (
                      <div className="uncheck-dot" />
                    )}
                  </div>
                  <div>
                    <div className="loc-name">{loc.name}</div>
                    <div className="loc-zone">{loc.zone}</div>
                  </div>
                </div>
                <div className="loc-code-badge">{loc.code}</div>
              </button>
            );
          })}
        </div>

        {/* Active Location Detail Card */}
        <div className="active-jurisdiction-card">
          <div className="card-top">
            <Building2 size={15} className="authority-icon" />
            <span className="card-top-title">Active Planning Framework</span>
          </div>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">City / Corporation:</span>
              <span className="detail-val">{activeLocObj.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Authority Zone:</span>
              <span className="detail-val">{activeLocObj.zone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Statutory Code:</span>
              <span className="detail-val mono">{activeLocObj.code}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Applicable Act:</span>
              <span className="detail-val">MP Nagar Tatha Gram Nivesh Adhiniyam, 1973</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .location-panel {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          min-height: 520px;
        }

        .location-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: #F4F6F2;
          border-bottom: 1px solid var(--border-color);
        }

        .header-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .loc-icon {
          color: var(--primary);
        }

        .location-heading {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-main);
          letter-spacing: 0.03em;
        }

        .location-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          background: var(--soft-green);
          color: var(--primary);
          padding: 2px 7px;
          border-radius: 2px;
          border: 1px solid #CAD5C6;
        }

        .location-panel-content {
          padding: 20px 22px;
          flex: 1;
        }

        .location-explainer {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.55;
          margin-bottom: 16px;
        }

        .jurisdiction-disclaimer-box {
          background-color: #FDF9F2;
          border: 1px solid #EBDCBE;
          border-radius: 3px;
          padding: 12px 14px;
          margin-bottom: 20px;
        }

        .disclaimer-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #8C5B08;
          letter-spacing: 0.04em;
          margin-bottom: 5px;
        }

        .disclaimer-icon {
          color: #8C5B08;
          flex-shrink: 0;
        }

        .disclaimer-body {
          font-size: 12px;
          color: #5F4210;
          line-height: 1.5;
        }

        .list-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--text-light);
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .locations-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 22px;
        }

        .loc-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: #FAFBF9;
          border: 1px solid var(--border-color);
          border-radius: 3px;
          text-align: left;
          transition: all 0.15s ease;
        }

        .loc-card:hover {
          background: var(--soft-green);
          border-color: #B5C4B1;
        }

        .loc-card.selected {
          background: #FFFFFF;
          border-color: var(--primary);
          box-shadow: inset 3px 0 0 var(--primary);
        }

        .loc-card-main {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .loc-bullet-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .check-icon {
          color: var(--primary);
        }

        .uncheck-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid #CBD2C7;
          background: #FFFFFF;
        }

        .loc-name {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-main);
        }

        .loc-zone {
          font-size: 11.5px;
          color: var(--text-muted);
        }

        .loc-code-badge {
          font-family: var(--font-mono);
          font-size: 11px;
          background: #EEF2EB;
          color: var(--text-muted);
          padding: 2px 7px;
          border-radius: 2px;
        }

        .active-jurisdiction-card {
          background: #F7F9F5;
          border: 1px solid var(--border-color);
          border-radius: 3px;
          padding: 14px 16px;
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }

        .authority-icon {
          color: var(--primary);
        }

        .card-top-title {
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--primary);
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 16px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-size: 11px;
          color: var(--text-light);
          margin-bottom: 2px;
        }

        .detail-val {
          font-size: 12.5px;
          font-weight: 500;
          color: var(--text-main);
        }

        .detail-val.mono {
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--primary);
        }

        @media (max-width: 600px) {
          .details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
