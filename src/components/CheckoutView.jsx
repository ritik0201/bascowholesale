import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

export function CheckoutView({ 
  cart, 
  onBackToCatalog, 
  onSubmitOrder, 
  onShowToast 
}) {
  const [formData, setFormData] = useState({
    companyName: 'Apex Gaming & Distribution Corp',
    poNumber: 'PO-APX-89420',
    buyerName: 'Elena Vance',
    buyerEmail: 'e.vance@apexgamingdist.com',
    streetAddress: '1420 Harbor Blvd, Suite 200',
    city: 'Oakland',
    state: 'CA',
    postalCode: '94607',
    carrier: 'FedEx Freight Priority',
    specialInstructions: '',
    authorizedSigner: 'Elena Vance',
    termsAgreed: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const totalUnits = cart.reduce((sum, item) => sum + (item.allocatedQty || 0), 0);
  const subtotal = cart.reduce((sum, item) => sum + ((item.unitPrice || 0) * (item.allocatedQty || 0)), 0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      onShowToast?.('Cart is empty. Please add items from the catalog.', 'error');
      return;
    }
    if (!formData.poNumber.trim()) {
      onShowToast?.('Purchase Order (PO) Number is required.', 'error');
      return;
    }
    if (!formData.termsAgreed) {
      onShowToast?.('Please confirm authorization terms.', 'error');
      return;
    }

    setIsSubmitting(true);

    const generatedId = 'WH-' + Math.floor(89420 + Math.random() * 1000);
    const newOrder = {
      id: generatedId,
      orderNumber: generatedId,
      customer: formData.companyName,
      customerInitials: 'AG',
      poNumber: formData.poNumber,
      submissionDate: 'Just Now',
      dateIso: new Date().toISOString(),
      totalUnits,
      status: 'Staged',
      buyerName: formData.buyerName,
      buyerEmail: formData.buyerEmail,
      deliveryAddress: {
        street: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: 'United States',
      },
      freight: {
        carrier: formData.carrier,
        trackingReservation: 'FXF-774921008',
        dispatchCutoff: '16:00 EST Today',
        paymentTerms: 'Net 30 Verified',
      },
      lineItems: cart.map(item => ({
        sku: item.sku,
        description: item.name,
        platform: item.platform,
        qtyOrdered: item.allocatedQty,
        unitPrice: item.unitPrice,
      }))
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitOrder(newOrder);
      onShowToast?.(`PO ${formData.poNumber} submitted successfully!`);
    }, 600);
  };

  return (
    <div className="checkout-container animate-fade-in">
      {/* Breadcrumb Header */}
      <div className="checkout-header-bar">
        <div>
          <h1 className="checkout-title">Wholesale Order Checkout</h1>
          <p className="checkout-subtitle">
            Enter your purchase order details and shipping destination for Net 30 fulfillment.
          </p>
        </div>
        <button 
          type="button"
          className="btn-return-catalog"
          onClick={onBackToCatalog}
        >
          <ArrowLeft size={14} />
          <span>Back to Catalog</span>
        </button>
      </div>

      {/* Main Grid */}
      <form onSubmit={handleSubmit} className="checkout-grid">
        {/* Left Form Sections */}
        <div className="checkout-sections">
          
          {/* Section 1: Entity & PO */}
          <div className="checkout-card">
            <div className="section-card-header">
              <span className="section-number-title">
                <span className="step-num-badge">1</span>
                <span>Account & Purchase Order</span>
              </span>
              <span className="badge-terms">Net 30 Active</span>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input 
                  type="text" 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleChange}
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Purchase Order (PO) # *</label>
                <input 
                  type="text" 
                  name="poNumber" 
                  value={formData.poNumber} 
                  onChange={handleChange}
                  className="form-input" 
                  placeholder="e.g. PO-89420" 
                  required 
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Contact Buyer Name *</label>
                <input 
                  type="text" 
                  name="buyerName" 
                  value={formData.buyerName} 
                  onChange={handleChange}
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Buyer Email *</label>
                <input 
                  type="email" 
                  name="buyerEmail" 
                  value={formData.buyerEmail} 
                  onChange={handleChange}
                  className="form-input" 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address & Carrier */}
          <div className="checkout-card">
            <div className="section-card-header">
              <span className="section-number-title">
                <span className="step-num-badge">2</span>
                <span>Shipping Destination & Carrier</span>
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Street Address *</label>
              <input 
                type="text" 
                name="streetAddress" 
                value={formData.streetAddress} 
                onChange={handleChange}
                className="form-input" 
                required 
              />
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input 
                  type="text" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange}
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input 
                  type="text" 
                  name="state" 
                  value={formData.state} 
                  onChange={handleChange}
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">ZIP Code *</label>
                <input 
                  type="text" 
                  name="postalCode" 
                  value={formData.postalCode} 
                  onChange={handleChange}
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label className="form-label">Freight Carrier</label>
              <select 
                name="carrier" 
                value={formData.carrier} 
                onChange={handleChange}
                className="form-input"
              >
                <option value="FedEx Freight Priority">FedEx Freight Priority</option>
                <option value="Old Dominion Freight Line">Old Dominion Freight Line (ODFL)</option>
                <option value="XPO Logistics">XPO Logistics Freight</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label className="form-label">Delivery Notes (Optional)</label>
              <input 
                type="text" 
                name="specialInstructions" 
                value={formData.specialInstructions} 
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Call 30 mins prior to dock arrival" 
              />
            </div>
          </div>

          {/* Section 3: Authorization & Agreement */}
          <div className="checkout-card">
            <div className="section-card-header">
              <span className="section-number-title">
                <span className="step-num-badge">3</span>
                <span>Authorization & Sign-off</span>
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Authorized Signer Name *</label>
              <input 
                type="text" 
                name="authorizedSigner" 
                value={formData.authorizedSigner} 
                onChange={handleChange}
                className="form-input" 
                required 
              />
            </div>

            <label className="terms-checkbox-label">
              <input 
                type="checkbox" 
                name="termsAgreed" 
                checked={formData.termsAgreed} 
                onChange={handleChange}
                required 
              />
              <span>
                I authorize this Purchase Order on behalf of <strong>{formData.companyName}</strong> under standard wholesale Net 30 terms.
              </span>
            </label>
          </div>

        </div>

        {/* Right Sidebar: Order Summary */}
        <div className="manifest-card">
          <div className="manifest-card-header">
            <div>
              <div className="manifest-title">Order Summary</div>
              <div className="manifest-subtitle">
                PO: <strong className="tabular-nums">{formData.poNumber || 'Pending'}</strong>
              </div>
            </div>
            <span className="badge-item-count">{cart.length} {cart.length === 1 ? 'SKU' : 'SKUs'}</span>
          </div>

          {/* Line Items List */}
          <div className="manifest-items-list">
            {cart.map((item) => (
              <div key={item.id} className="manifest-item">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="manifest-item-title">{item.name}</div>
                  <div className="manifest-item-sub">
                    <span className="sku-badge">{item.sku}</span>
                    <span style={{ margin: '0 4px', color: '#cbd5e1' }}>•</span>
                    <span>${item.unitPrice.toFixed(2)} / unit</span>
                  </div>
                </div>
                <div className="manifest-item-qty tabular-nums">
                  <div>{item.allocatedQty} units</div>
                  <div className="manifest-item-price">
                    ${((item.unitPrice || 0) * (item.allocatedQty || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="manifest-totals-box">
            <div className="summary-row">
              <span>Total Units</span>
              <strong className="tabular-nums">{totalUnits} units</strong>
            </div>
            <div className="summary-row">
              <span>Payment Terms</span>
              <strong style={{ color: '#059669' }}>Net 30 Commercial</strong>
            </div>
            <div className="summary-row summary-total-row">
              <span>Order Total</span>
              <strong className="tabular-nums order-total-val">
                ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.5rem' }}>
            <button 
              type="submit" 
              className="btn-checkout-primary"
              disabled={isSubmitting || cart.length === 0}
            >
              <ShieldCheck size={16} />
              <span>{isSubmitting ? 'Submitting Purchase Order...' : 'Submit Purchase Order'}</span>
              <ArrowRight size={16} />
            </button>

            <button 
              type="button"
              className="btn-back-link"
              onClick={onBackToCatalog}
            >
              <ArrowLeft size={13} />
              <span>Modify Items in Catalog</span>
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
