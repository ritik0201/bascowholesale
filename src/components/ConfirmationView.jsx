import React from 'react';
import { 
  CheckCircle2, 
  Package, 
  Clock, 
  Truck, 
  Printer, 
  Download, 
  ArrowLeft,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export function ConfirmationView({ 
  order, 
  onBackToCatalog, 
  onViewInAdmin, 
  onShowToast 
}) {
  if (!order) {
    return (
      <div className="confirmation-container animate-fade-in" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <Package size={48} style={{ margin: '0 auto 1rem', color: '#94a3b8' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0b1c30' }}>No Active Order Confirmation</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          Submit a purchase order from the wholesale catalog to view its confirmation.
        </p>
        <button className="btn-add-cart" onClick={onBackToCatalog}>
          Go to Wholesale Catalog
        </button>
      </div>
    );
  }

  const subtotal = order.lineItems.reduce((sum, item) => sum + ((item.unitPrice || 0) * (item.qtyOrdered || 0)), 0);

  const handlePrint = () => {
    window.print();
    onShowToast?.(`Printed order summary for ${order.orderNumber}`);
  };

  const handleDownload = () => {
    onShowToast?.(`Downloaded invoice for PO ${order.poNumber}`);
  };

  return (
    <div className="confirmation-container animate-fade-in">
      {/* Hero Banner */}
      <div className="confirmation-hero-banner">
        <div className="confirmation-hero-left">
          <div className="confirm-check-icon">
            <CheckCircle2 size={26} />
          </div>
          <div>
            <h1 className="confirm-hero-title">
              Purchase Order Confirmed
            </h1>
            <div className="confirm-hero-meta">
              <span>Order: <strong className="tabular-nums">{order.orderNumber}</strong></span>
              <span>•</span>
              <span>PO: <strong className="tabular-nums">{order.poNumber}</strong></span>
              <span>•</span>
              <span>Terms: <strong>Net 30</strong></span>
            </div>
          </div>
        </div>

        <div className="confirm-meta-boxes">
          <div className="confirm-meta-cell">
            <div className="confirm-meta-label">Total Units</div>
            <div className="confirm-meta-val tabular-nums">{order.totalUnits} Units</div>
          </div>
          <div className="confirm-meta-cell">
            <div className="confirm-meta-label">Order Total</div>
            <div className="confirm-meta-val tabular-nums" style={{ color: '#059669' }}>
              ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Clean 3-Stage Progress Tracker */}
      <div className="pipeline-card">
        <div className="pipeline-header">
          <span className="pipeline-title">Fulfillment Progress</span>
          <span className="pipeline-status-pill">
            <span className="live-indicator-dot"></span>
            In Progress
          </span>
        </div>

        <div className="pipeline-steps-grid">
          <div className="pipeline-step-item completed-step">
            <div className="step-header">
              <span className="step-num">01 / VALIDATED</span>
              <CheckCircle2 size={14} color="#059669" />
            </div>
            <div className="step-name">PO Approved</div>
            <div className="step-desc">Order authorized on Net 30 terms.</div>
          </div>

          <div className="pipeline-step-item active-step">
            <div className="step-header">
              <span className="step-num">02 / ALLOCATION</span>
              <Clock size={14} color="#1d4ed8" />
            </div>
            <div className="step-name">Warehouse Packing</div>
            <div className="step-desc">Inventory reserved at Hub 04-East.</div>
          </div>

          <div className="pipeline-step-item">
            <div className="step-header">
              <span className="step-num">03 / DISPATCH</span>
              <Truck size={14} color="#94a3b8" />
            </div>
            <div className="step-name">Carrier Freight</div>
            <div className="step-desc">{order.freight?.carrier || 'Freight carrier assigned'}.</div>
          </div>
        </div>
      </div>

      {/* 2-Column Summary Grid */}
      <div className="specs-2col-grid">
        <div className="specs-card">
          <div className="specs-card-header">
            <span>Account & Contact</span>
            <span className="badge-terms">Verified</span>
          </div>
          <div className="specs-list">
            <div className="specs-row">
              <span className="specs-label">Company</span>
              <strong className="specs-val">{order.customer}</strong>
            </div>
            <div className="specs-row">
              <span className="specs-label">Authorized Buyer</span>
              <span className="specs-val">{order.buyerName}</span>
            </div>
            <div className="specs-row">
              <span className="specs-label">Contact Email</span>
              <span className="specs-val">{order.buyerEmail}</span>
            </div>
            <div className="specs-row">
              <span className="specs-label">Payment Terms</span>
              <span className="specs-val" style={{ color: '#059669', fontWeight: 600 }}>Net 30 Commercial Invoice</span>
            </div>
          </div>
        </div>

        <div className="specs-card">
          <div className="specs-card-header">
            <span>Shipping & Logistics</span>
            <span className="badge-carrier">{order.freight?.carrier}</span>
          </div>
          <div className="specs-list">
            <div className="specs-row">
              <span className="specs-label">Destination</span>
              <span className="specs-val">
                {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.postalCode}
              </span>
            </div>
            <div className="specs-row">
              <span className="specs-label">Freight Carrier</span>
              <strong className="specs-val">{order.freight?.carrier}</strong>
            </div>
            <div className="specs-row">
              <span className="specs-label">Tracking Ref</span>
              <span className="specs-val tabular-nums" style={{ color: '#1d4ed8', fontWeight: 600 }}>
                {order.freight?.trackingReservation || 'Assigned on dispatch'}
              </span>
            </div>
            <div className="specs-row">
              <span className="specs-label">Dispatch Cutoff</span>
              <span className="specs-val">{order.freight?.dispatchCutoff || '16:00 EST Today'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Manifest Table Card */}
      <div className="table-card" style={{ marginBottom: '1.25rem' }}>
        <div className="table-header-bar">
          <span className="table-header-title">
            Order Items Manifest ({order.lineItems.length} {order.lineItems.length === 1 ? 'Item' : 'Items'})
          </span>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '150px' }}>SKU</th>
                <th>PRODUCT</th>
                <th style={{ width: '130px' }}>PLATFORM</th>
                <th style={{ textAlign: 'center', width: '110px' }}>UNITS</th>
                <th style={{ textAlign: 'right', width: '130px' }}>UNIT PRICE</th>
                <th style={{ textAlign: 'right', width: '140px' }}>SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              {order.lineItems.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <span className="sku-badge">{item.sku}</span>
                  </td>
                  <td>
                    <span className="product-title" style={{ fontSize: '0.8125rem' }}>{item.description}</span>
                  </td>
                  <td>
                    <span className="platform-pill">{item.platform}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="tabular-nums" style={{ fontWeight: 600, color: '#0b1c30' }}>
                      {item.qtyOrdered}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="tabular-nums" style={{ color: '#64748b' }}>
                      ${item.unitPrice?.toFixed(2)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="tabular-nums" style={{ fontWeight: 700, color: '#059669' }}>
                      ${((item.unitPrice || 0) * (item.qtyOrdered || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="confirmation-actions-bar">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn-action-secondary" 
            onClick={handlePrint}
          >
            <Printer size={14} />
            <span>Print Confirmation</span>
          </button>

          <button 
            className="btn-action-secondary" 
            onClick={handleDownload}
          >
            <Download size={14} />
            <span>Download Invoice</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn-action-secondary"
            onClick={onBackToCatalog}
          >
            <ArrowLeft size={14} />
            <span>Back to Catalog</span>
          </button>

          <button 
            className="btn-action-primary"
            onClick={onViewInAdmin}
          >
            <ShieldCheck size={15} />
            <span>View in Orders Console</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}
