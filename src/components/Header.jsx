import React from 'react';
import { MapPin, Globe, User, Menu, X, ShieldAlert } from 'lucide-react';
import { SAMPLE_LOCATIONS, REGULATION_DISCLAIMER } from '../data/demoData';

export default function Header({
  language,
  setLanguage,
  selectedLocation,
  setSelectedLocation,
  mobileNavOpen,
  setMobileNavOpen
}) {
  return (
    <header className="site-header">
      <div className="header-top-banner">
        <span className="banner-badge">REGULATORY NOTICE</span>
        <span className="banner-text">
          Consolidated rules extend through <strong>{REGULATION_DISCLAIMER.coverageDate}</strong>. Demonstration civic-tech research interface.
        </span>
      </div>

      <div className="header-main">
        <div className="header-left">
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Custom SVG building/land civic-tech logo */}
          <div className="brand-logo-wrap">
            <svg
              className="brand-logo"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="36" height="36" rx="2" stroke="#155C4B" strokeWidth="1.5" />
              {/* Land parcel grid lines */}
              <line x1="2" y1="28" x2="38" y2="28" stroke="#155C4B" strokeWidth="1.2" />
              <line x1="16" y1="28" x2="16" y2="38" stroke="#155C4B" strokeWidth="1.2" />
              <line x1="26" y1="28" x2="26" y2="38" stroke="#155C4B" strokeWidth="1.2" />
              {/* Architectural building elevation */}
              <path
                d="M8 28V12L20 6L32 12V28"
                stroke="#155C4B"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <line x1="20" y1="6" x2="20" y2="28" stroke="#155C4B" strokeWidth="1" strokeDasharray="2 2" />
              {/* Structural window openings */}
              <rect x="11" y="16" width="4" height="5" fill="#155C4B" />
              <rect x="25" y="16" width="4" height="5" fill="#155C4B" />
              <rect x="18" y="21" width="4" height="7" fill="#155C4B" />
            </svg>
          </div>

          <div className="brand-titles">
            <h1 className="brand-name">Bhumi Vikas Sahayak</h1>
            <p className="brand-sub">Madhya Pradesh Building Regulations</p>
          </div>
        </div>

        {/* Subtle architectural line illustration background */}
        <div className="architectural-backdrop" aria-hidden="true">
          <svg width="240" height="48" viewBox="0 0 240 48" fill="none" opacity="0.45">
            <line x1="0" y1="46" x2="240" y2="46" stroke="#B8C4B4" strokeWidth="1" />
            <line x1="30" y1="46" x2="30" y2="10" stroke="#B8C4B4" strokeWidth="0.8" />
            <line x1="60" y1="46" x2="60" y2="18" stroke="#B8C4B4" strokeWidth="0.8" />
            <line x1="30" y1="10" x2="60" y2="10" stroke="#B8C4B4" strokeWidth="0.8" />
            <line x1="90" y1="46" x2="90" y2="6" stroke="#B8C4B4" strokeWidth="0.8" />
            <line x1="120" y1="46" x2="120" y2="6" stroke="#B8C4B4" strokeWidth="0.8" />
            <line x1="90" y1="6" x2="120" y2="6" stroke="#B8C4B4" strokeWidth="0.8" />
            <line x1="105" y1="6" x2="105" y2="46" stroke="#B8C4B4" strokeWidth="0.6" strokeDasharray="2 2" />
            <polygon points="150,46 175,20 200,46" stroke="#B8C4B4" strokeWidth="0.8" fill="none" />
            <line x1="210" y1="46" x2="210" y2="24" stroke="#B8C4B4" strokeWidth="0.8" />
            <line x1="230" y1="46" x2="230" y2="24" stroke="#B8C4B4" strokeWidth="0.8" />
          </svg>
        </div>

        <div className="header-controls">
          {/* Location Selector */}
          <div className="control-item location-selector-wrap">
            <MapPin size={15} className="control-icon" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="location-select"
              aria-label="Select location"
            >
              {SAMPLE_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name.split(' (')[0]} ({loc.code})
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="control-item lang-selector-wrap">
            <Globe size={15} className="control-icon" />
            <button
              type="button"
              className={`lang-toggle ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <span className="lang-sep">/</span>
            <button
              type="button"
              className={`lang-toggle ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
            >
              हिन्दी
            </button>
          </div>

          {/* Profile Icon button */}
          <div className="control-item profile-badge" title="Civic Researcher Profile">
            <div className="profile-circle" aria-label="Researcher Profile">
              <User size={15} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .site-header {
          background-color: var(--bg-main);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .header-top-banner {
          background-color: #ECEEE7;
          border-bottom: 1px solid var(--border-subtle);
          padding: 4px 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          color: var(--text-muted);
        }

        .banner-badge {
          font-size: 9px;
          letter-spacing: 0.08em;
          font-weight: 700;
          background-color: var(--soft-green);
          border: 1px solid var(--border-color);
          color: var(--primary);
          padding: 1px 6px;
          border-radius: 2px;
        }

        .header-main {
          height: var(--header-height);
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
          z-index: 2;
        }

        .mobile-menu-btn {
          display: none;
          color: var(--text-main);
          padding: 6px;
          border-radius: 3px;
          border: 1px solid var(--border-color);
          background: #FFFFFF;
        }

        .brand-logo-wrap {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-logo {
          width: 100%;
          height: 100%;
        }

        .brand-titles {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-family: var(--font-serif);
          font-size: 18px;
          font-weight: 600;
          color: var(--primary);
          line-height: 1.15;
          letter-spacing: -0.01em;
        }

        .brand-sub {
          font-family: var(--font-sans);
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.02em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .architectural-backdrop {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 14px;
          z-index: 2;
        }

        .control-item {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: 3px;
          padding: 5px 10px;
          font-size: 12px;
        }

        .control-icon {
          color: var(--primary);
          margin-right: 6px;
        }

        .location-select {
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-main);
          cursor: pointer;
          outline: none;
        }

        .lang-selector-wrap {
          gap: 4px;
          padding: 4px 10px;
        }

        .lang-toggle {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-muted);
          padding: 2px 4px;
          border-radius: 2px;
          transition: all 0.15s ease;
        }

        .lang-toggle.active {
          color: var(--primary);
          font-weight: 700;
          background-color: var(--soft-green);
        }

        .lang-sep {
          color: var(--border-color);
          font-size: 11px;
        }

        .profile-badge {
          padding: 4px 6px;
          background: transparent;
          border: none;
        }

        .profile-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        @media (max-width: 860px) {
          .architectural-backdrop {
            display: none;
          }
          .mobile-menu-btn {
            display: flex;
          }
        }

        @media (max-width: 640px) {
          .header-main {
            padding: 0 12px;
          }
          .brand-sub {
            display: none;
          }
          .location-selector-wrap {
            display: none;
          }
          .header-top-banner {
            padding: 4px 12px;
            font-size: 10px;
          }
        }
      `}</style>
    </header>
  );
}
