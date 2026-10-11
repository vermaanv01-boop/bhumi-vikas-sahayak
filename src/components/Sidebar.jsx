import React from 'react';
import {
  Home,
  HelpCircle,
  BookOpen,
  MapPin,
  Clock,
  Bookmark,
  Info,
  ExternalLink
} from 'lucide-react';
import { UI_TRANSLATIONS } from '../data/demoData';

export default function Sidebar({
  activeNav,
  setActiveNav,
  savedCount = 0,
  language = 'en',
  mobileNavOpen,
  setMobileNavOpen
}) {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const navItems = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'ask', label: t.navAsk, icon: HelpCircle },
    { id: 'regulations', label: t.navRegulations, icon: BookOpen },
    { id: 'location', label: t.navLocation, icon: MapPin },
    { id: 'recent', label: t.navRecent, icon: Clock },
    { id: 'saved', label: t.navSaved, icon: Bookmark, badge: savedCount },
    { id: 'about', label: t.navAbout, icon: Info }
  ];

  const handleNavClick = (id) => {
    setActiveNav(id);
    if (setMobileNavOpen) {
      setMobileNavOpen(false);
    }
  };

  return (
    <>
      {mobileNavOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside className={`app-sidebar ${mobileNavOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-section-title">
          <span>{language === 'hi' ? 'नेविगेशन' : 'LEGAL RESEARCH'}</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                type="button"
              >
                <span className="sidebar-link-content">
                  <Icon size={16} className="sidebar-icon" />
                  <span className="sidebar-label">{item.label}</span>
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="sidebar-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-statute-card">
            <div className="statute-indicator" />
            <div>
              <div className="statute-title">MP Bhumi Vikas Niyam</div>
              <div className="statute-meta">Consolidated to 6 Mar 2025</div>
            </div>
          </div>
          <div className="sidebar-disclaimer">
            Statutory civic assistance tool. Not certified municipal sanction.
          </div>
        </div>

        <style>{`
          .app-sidebar {
            width: var(--sidebar-width);
            background-color: var(--bg-sidebar);
            display: flex;
            flex-direction: column;
            padding: 20px 14px;
            color: var(--sidebar-text);
            flex-shrink: 0;
            user-select: none;
            transition: transform 0.2s ease-in-out;
          }

          .sidebar-section-title {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.1em;
            color: var(--sidebar-muted);
            padding: 0 10px 10px 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            margin-bottom: 12px;
          }

          .sidebar-nav {
            display: flex;
            flex-direction: column;
            gap: 3px;
            flex: 1;
          }

          .sidebar-link {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 9px 12px;
            border-radius: 3px;
            color: var(--sidebar-muted);
            font-size: 13px;
            font-weight: 400;
            text-align: left;
            transition: background-color 0.15s ease, color 0.15s ease;
          }

          .sidebar-link-content {
            display: flex;
            align-items: center;
            gap: 11px;
          }

          .sidebar-icon {
            color: var(--sidebar-muted);
            transition: color 0.15s ease;
            flex-shrink: 0;
          }

          .sidebar-link:hover {
            background-color: var(--bg-sidebar-hover);
            color: #FFFFFF;
          }

          .sidebar-link:hover .sidebar-icon {
            color: #FFFFFF;
          }

          .sidebar-link.active {
            background-color: var(--bg-sidebar-active);
            color: #FFFFFF;
            font-weight: 500;
            box-shadow: inset 3px 0 0 #4ADE80;
          }

          .sidebar-link.active .sidebar-icon {
            color: #4ADE80;
          }

          .sidebar-badge {
            background-color: rgba(74, 222, 128, 0.2);
            color: #4ADE80;
            font-size: 10px;
            font-weight: 600;
            padding: 1px 6px;
            border-radius: 10px;
          }

          .sidebar-bottom {
            margin-top: auto;
            padding-top: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }

          .sidebar-statute-card {
            background-color: rgba(0, 0, 0, 0.22);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 3px;
            padding: 8px 10px;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
          }

          .statute-indicator {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background-color: #4ADE80;
            flex-shrink: 0;
          }

          .statute-title {
            font-size: 11px;
            font-weight: 600;
            color: #E6EFEA;
            line-height: 1.2;
          }

          .statute-meta {
            font-size: 10px;
            color: var(--sidebar-muted);
            margin-top: 1px;
          }

          .sidebar-disclaimer {
            font-size: 9.5px;
            line-height: 1.35;
            color: #789083;
            padding: 0 4px;
          }

          @media (max-width: 768px) {
            .app-sidebar {
              position: fixed;
              top: var(--header-height);
              left: 0;
              bottom: 0;
              z-index: 50;
              transform: translateX(-100%);
              box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
            }

            .app-sidebar.mobile-open {
              transform: translateX(0);
            }

            .sidebar-backdrop {
              position: fixed;
              top: var(--header-height);
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(16, 61, 53, 0.4);
              z-index: 49;
            }
          }
        `}</style>
      </aside>
    </>
  );
}
