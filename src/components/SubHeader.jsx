import React from 'react';

export function SubHeader() {
  return (
    <div className="sub-header-bar">
      <div className="sub-header-left">
        <div className="feed-status">
          <span className="live-indicator-dot"></span>
          <span>Hub 04-East • Inventory Live</span>
        </div>
      </div>

      <div className="sub-header-right">
        <span className="stat-inline">
          Account Status: <strong style={{ color: '#059669' }}>Net 30 Active</strong>
        </span>
        <span className="stat-inline">
          Tier: <strong>Enterprise B2B</strong>
        </span>
      </div>
    </div>
  );
}
