import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Package, 
  Clock, 
  ArrowRight, 
  Minus,
  Plus
} from 'lucide-react';

export function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateCartQty, 
  onRemoveCartItem, 
  onClearCart, 
  onProceedToCheckout 
}) {
  const [timeLeft, setTimeLeft] = useState(2697); // ~45 mins

  // Reservation countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const totalLineItems = cart.length;
  const totalUnits = cart.reduce((sum, item) => sum + (item.allocatedQty || 0), 0);
  const estimatedSubtotal = cart.reduce((sum, item) => sum + ((item.unitPrice || 0) * (item.allocatedQty || 0)), 0);

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <div className="cart-header-icon">
              <Package size={18} />
            </div>
            <div>
              <div className="cart-title-text">
                Wholesale Cart
              </div>
              <div className="cart-subtitle-text">
                <span className="tabular-nums">{totalLineItems}</span> {totalLineItems === 1 ? 'item' : 'items'} • <span className="tabular-nums">{totalUnits}</span> total units
              </div>
            </div>
          </div>

          <div className="cart-header-actions">
            {cart.length > 0 && (
              <button 
                className="cart-icon-btn" 
                onClick={onClearCart}
                title="Clear cart"
              >
                <Trash2 size={14} />
              </button>
            )}
            <button 
              className="cart-icon-btn" 
              onClick={onClose}
              title="Close drawer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Minimal Stock Reservation Status */}
        <div className="cart-reservation-banner">
          <div className="reservation-top">
            <span className="reservation-heading">
              <Clock size={13} />
              Inventory Buffer Reserved
            </span>
            <span className="reservation-timer tabular-nums">
              {formatTimer(timeLeft)}
            </span>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
              <Package size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 600, color: '#0f172a' }}>Wholesale Cart is Empty</p>
              <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem', color: '#64748b' }}>
                Select items from the catalog to build your order.
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const itemTotal = (item.unitPrice || 0) * (item.allocatedQty || 0);

              return (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-top">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '2px' }}>
                        <span className="sku-badge">{item.sku}</span>
                        <span className="platform-pill">{item.platform}</span>
                      </div>
                      <span className="cart-item-price" style={{ marginTop: '4px' }}>
                        ${item.unitPrice.toFixed(2)} / unit
                      </span>
                    </div>

                    <button 
                      className="cart-item-remove-btn"
                      onClick={() => onRemoveCartItem(item.id)}
                      title="Remove item"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="cart-item-bottom">
                    <div className="stepper-control" style={{ height: '26px' }}>
                      <button 
                        className="stepper-btn"
                        onClick={() => onUpdateCartQty(item.id, Math.max(1, (item.allocatedQty || 1) - 5))}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="stepper-input tabular-nums" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.allocatedQty}
                      </span>
                      <button 
                        className="stepper-btn"
                        onClick={() => onUpdateCartQty(item.id, (item.allocatedQty || 1) + 5)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={10} />
                      </button>
                    </div>

                    <div className="cart-item-subtotal tabular-nums">
                      ${itemTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Clean Order Summary Box */}
        {cart.length > 0 && (
          <div className="cart-summary-box">
            <div className="summary-row">
              <span>Total Units</span>
              <strong className="tabular-nums">{totalUnits} units</strong>
            </div>
            <div className="summary-row">
              <span>Payment Terms</span>
              <strong style={{ color: '#059669' }}>Net 30 Invoice</strong>
            </div>
            <div className="summary-row" style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-subtle)', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: 600, color: '#0b1c30' }}>Estimated Total</span>
              <strong className="tabular-nums" style={{ fontSize: '1.1rem', color: '#1d4ed8' }}>
                ${estimatedSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
          </div>
        )}

        {/* Footer Checkout CTA */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <button 
              className="btn-checkout-primary"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
