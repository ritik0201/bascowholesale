import React, { useState, useEffect, useRef } from 'react';
import { Package, ShoppingCart, Search, ChevronDown, Building2, ShieldCheck, X, User } from 'lucide-react';

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  cart, 
  setIsCartOpen, 
  isAdmin, 
  setIsAdmin, 
  searchQuery, 
  setSearchQuery 
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const totalCartItems = cart.length;

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <header className="global-header">
      <div className="header-left">
        <div 
          className="brand-logo" 
          onClick={() => setActiveTab('catalog')} 
          title="Return to Catalog"
        >
          <div className="brand-icon-box">
            <Package size={18} strokeWidth={2.5} />
          </div>
          <span className="brand-text">WHOLESALEHUB</span>
          <span className={`brand-badge ${isAdmin ? 'ops' : ''}`}>
            {isAdmin ? 'OPERATIONS' : 'B2B PORTAL'}
          </span>
        </div>

        <nav className="header-nav">
          <button 
            className={`nav-tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            Catalog
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'checkout' ? 'active' : ''}`}
            onClick={() => setActiveTab('checkout')}
          >
            Checkout
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'confirmation' ? 'active' : ''}`}
            onClick={() => setActiveTab('confirmation')}
          >
            Confirmation
          </button>
          <button 
            className={`nav-tab-btn ${activeTab.startsWith('admin') ? 'active' : ''}`}
            onClick={() => {
              setIsAdmin(true);
              setActiveTab('admin-orders');
            }}
          >
            <ShieldCheck size={14} />
            Orders Console
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <User size={14} />
            Account
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact
          </button>
        </nav>
      </div>

      <div className="header-right">
        {/* Search Input */}
        <div className="header-search">
          <Search size={14} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search products or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Cart Summary Button */}
        <button 
          className="cart-summary-btn" 
          onClick={() => setIsCartOpen(true)}
          title="View Wholesale Cart"
        >
          <ShoppingCart size={15} />
          <span>Cart</span>
          <span className="cart-count-badge tabular-nums">
            {totalCartItems}
          </span>
        </button>

        {/* User Account Menu with Active Indicator */}
        <div style={{ position: 'relative' }} ref={profileMenuRef}>
          <div 
            className={`user-profile-badge ${activeTab === 'account' || showProfileMenu ? 'active' : ''}`} 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title="Commercial Account Profile"
          >
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
              alt="Apex Corp Buyer" 
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">Apex Corp</span>
              <span className="user-role">Buyer #881</span>
            </div>
            <ChevronDown size={12} color={activeTab === 'account' ? '#1d4ed8' : '#747686'} />
          </div>

          {showProfileMenu && (
            <div 
              className="profile-dropdown-menu"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '260px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.85rem',
                zIndex: 60,
                animation: 'fadeIn 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem', paddingBottom: '0.65rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <Building2 size={18} color="#1d4ed8" />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0b1c30' }}>Apex Gaming & Dist.</div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Account: WHL-8942-CORP</div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Status:</span>
                  <strong style={{ color: '#059669' }}>Net 30 Active</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Credit Facility:</span>
                  <strong className="tabular-nums">$250,000.00</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <button 
                  onClick={() => {
                    setActiveTab('account');
                    setShowProfileMenu(false);
                  }}
                  className={`dropdown-item-btn ${activeTab === 'account' ? 'selected' : ''}`}
                >
                  <User size={13} />
                  <span>View Account & Credit Details</span>
                </button>

                <button 
                  onClick={() => {
                    setIsAdmin(true);
                    setActiveTab('admin-orders');
                    setShowProfileMenu(false);
                  }}
                  className="dropdown-item-btn"
                >
                  <ShieldCheck size={13} />
                  <span>Open Orders Console</span>
                </button>

                <button 
                  onClick={() => {
                    setActiveTab('catalog');
                    setShowProfileMenu(false);
                  }}
                  className="dropdown-item-btn"
                >
                  <Package size={13} />
                  <span>Wholesale Catalog</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
