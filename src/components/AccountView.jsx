import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  MapPin, 
  User, 
  FileCheck, 
  ArrowRight, 
  ArrowLeft
} from 'lucide-react';

export function AccountView({ onShowToast, onBackToCatalog, onGoToOrders }) {
  const creditLimit = 250000;
  const utilized = 85000;
  const available = creditLimit - utilized;
  const utilizedPercent = Math.round((utilized / creditLimit) * 100);

  return (
    <div className="account-container animate-fade-in">
      {/* Account Hero Card */}
      <div className="account-hero-card">
        <div className="account-hero-left">
          <div className="account-avatar-box">
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h1 className="account-company-name">Apex Gaming & Distribution Corp</h1>
              <span className="status-pill status-dispatched">Active Account</span>
              <span className="badge-terms">Tier 1 Enterprise</span>
            </div>
            <div className="account-meta-line">
              <span>Account ID: <strong className="tabular-nums">WHL-8942-CORP</strong></span>
              <span>•</span>
              <span>Member Since: <strong>2021</strong></span>
              <span>•</span>
              <span>Verified Commercial Buyer</span>
            </div>
          </div>
        </div>

        <div className="account-hero-actions">
          <button 
            className="btn-action-secondary" 
            onClick={onBackToCatalog}
          >
            <ArrowLeft size={14} />
            <span>Go to Catalog</span>
          </button>
        </div>
      </div>

      {/* Credit & Terms Card */}
      <div className="account-card" style={{ marginBottom: '1.25rem' }}>
        <div className="account-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} color="#1d4ed8" />
            <span className="account-card-title">Commercial Credit Facility & Net 30 Terms</span>
          </div>
          <span className="badge-terms">Good Standing</span>
        </div>

        <div className="credit-overview-grid">
          <div className="credit-stat-box">
            <div className="credit-stat-label">Total Credit Line</div>
            <div className="credit-stat-val tabular-nums" style={{ color: '#0b1c30' }}>
              ${creditLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="credit-stat-sub">Underwritten Net 30 facility</div>
          </div>

          <div className="credit-stat-box">
            <div className="credit-stat-label">Available Credit</div>
            <div className="credit-stat-val tabular-nums" style={{ color: '#059669' }}>
              ${available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="credit-stat-sub">Ready for immediate allocation</div>
          </div>

          <div className="credit-stat-box">
            <div className="credit-stat-label">Utilized Balance</div>
            <div className="credit-stat-val tabular-nums" style={{ color: '#1d4ed8' }}>
              ${utilized.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="credit-stat-sub">{utilizedPercent}% of credit line</div>
          </div>
        </div>

        {/* Credit Utilization Bar */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
            <span style={{ color: '#64748b' }}>Credit Utilization</span>
            <strong className="tabular-nums" style={{ color: '#0b1c30' }}>{utilizedPercent}% used</strong>
          </div>
          <div className="credit-bar-track">
            <div className="credit-bar-fill" style={{ width: `${utilizedPercent}%` }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.35rem' }}>
            <span>$0.00</span>
            <span>Net 30 limit: $250,000.00</span>
          </div>
        </div>
      </div>

      {/* 2-Column Info Cards */}
      <div className="account-grid-2col">
        {/* Left Column: Authorized Procurement Officers */}
        <div className="account-card">
          <div className="account-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="#1d4ed8" />
              <span className="account-card-title">Authorized Buyer & Procurement</span>
            </div>
            <span className="sku-badge">Primary</span>
          </div>

          <div className="account-detail-list">
            <div className="account-detail-row">
              <span className="account-detail-label">Full Name</span>
              <strong className="account-detail-val">Elena Vance</strong>
            </div>
            <div className="account-detail-row">
              <span className="account-detail-label">Designation</span>
              <span className="account-detail-val">Senior Purchasing Director</span>
            </div>
            <div className="account-detail-row">
              <span className="account-detail-label">Work Email</span>
              <span className="account-detail-val tabular-nums">e.vance@apexgamingdist.com</span>
            </div>
            <div className="account-detail-row">
              <span className="account-detail-label">Direct Phone</span>
              <span className="account-detail-val tabular-nums">+1 (415) 555-0192</span>
            </div>
            <div className="account-detail-row">
              <span className="account-detail-label">Signing Authority</span>
              <span className="badge-terms" style={{ padding: '1px 5px' }}>Up to $500,000 / PO</span>
            </div>
          </div>
        </div>

        {/* Right Column: Receiving Facilities */}
        <div className="account-card">
          <div className="account-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#1d4ed8" />
              <span className="account-card-title">Primary Receiving Facility</span>
            </div>
            <span className="sku-badge">Dock #4</span>
          </div>

          <div className="account-detail-list">
            <div className="account-detail-row">
              <span className="account-detail-label">Facility</span>
              <strong className="account-detail-val">Apex West Coast Terminal</strong>
            </div>
            <div className="account-detail-row">
              <span className="account-detail-label">Street Address</span>
              <span className="account-detail-val">1420 Harbor Blvd, Suite 200</span>
            </div>
            <div className="account-detail-row">
              <span className="account-detail-label">City, State, ZIP</span>
              <span className="account-detail-val">Oakland, CA 94607, USA</span>
            </div>
            <div className="account-detail-row">
              <span className="account-detail-label">Dock Protocols</span>
              <span className="account-detail-val">53ft Trailer • Liftgate • Forklift</span>
            </div>
            <div className="account-detail-row">
              <span className="account-detail-label">Receiving Hours</span>
              <span className="account-detail-val">Mon – Fri, 06:00 – 16:30 PST</span>
            </div>
          </div>
        </div>

        {/* Tax & Reseller Compliance */}
        <div className="account-card">
          <div className="account-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={18} color="#1d4ed8" />
              <span className="account-card-title">Tax & Resale Compliance</span>
            </div>
            <span className="badge-terms">Exempt</span>
          </div>

          <div className="account-detail-list">
            <div className="account-detail-row">
              <span className="account-detail-label">Tax ID / EIN</span>
              <strong className="account-detail-val tabular-nums">US-EIN 94-8841920</strong>
            </div>
            <div className="account-detail-row">
              <span className="account-detail-label">CA Resale Permit</span>
              <span className="account-detail-val tabular-nums">SR-GH 103-884912</span>
            </div>
            <div className="account-detail-row">
              <span className="account-detail-label">Exemption Status</span>
              <span className="account-detail-val" style={{ color: '#059669', fontWeight: 600 }}>Active Reseller (Zero Sales Tax)</span>
            </div>
            <div className="account-detail-row">
              <span className="account-detail-label">Certificate Renewal</span>
              <span className="account-detail-val">Valid through Dec 2027</span>
            </div>
          </div>
        </div>

        {/* Account Management & Operations */}
        <div className="account-card">
          <div className="account-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="#1d4ed8" />
              <span className="account-card-title">Account Security & Console Access</span>
            </div>
            <span className="sku-badge">Verified</span>
          </div>

          <div className="account-detail-list">
            <div className="account-detail-row">
              <span className="account-detail-label">Wholesale Portal Mode</span>
              <span className="account-detail-val">Direct Buyer & PO Submission</span>
            </div>
            <div className="account-detail-row">
              <span className="account-detail-label">Assigned Account Exec</span>
              <span className="account-detail-val">Sarah Jenkins (Strategic Accounts)</span>
            </div>
            <div className="account-detail-row">
              <span className="account-detail-label">Dedicated Desk Line</span>
              <span className="account-detail-val tabular-nums">+1 (800) 555-8940 • Ext 4</span>
            </div>
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn-action-primary" 
                onClick={onGoToOrders}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <span>Orders Console</span>
                <ArrowRight size={14} />
              </button>
              <button 
                className="btn-action-secondary"
                onClick={() => onShowToast?.('Account notification settings updated.')}
              >
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
