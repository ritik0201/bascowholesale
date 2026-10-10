import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  Send, 
  Clock
} from 'lucide-react';

export function ContactView({ onShowToast }) {
  const [formData, setFormData] = useState({
    name: 'Elena Vance',
    company: 'Apex Gaming & Distribution Corp',
    email: 'e.vance@apexgamingdist.com',
    poNumber: '',
    subject: 'Volume Pricing & Allocation Inquiry',
    message: 'We are expanding our retail distribution network into 12 new locations and would like to request an allocation increase for PlayStation 5 Slim and Logitech accessories on Net 30 terms.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onShowToast?.('Inquiry submitted to WholesaleHub accounts team.');
      setFormData(prev => ({ ...prev, message: '', poNumber: '' }));
    }, 600);
  };

  return (
    <div className="contact-container animate-fade-in">
      <div className="contact-card-box">
        {/* Left Column: Direct Support Desk Info */}
        <div className="contact-info-col">
          <div>
            <span className="badge-terms" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
              Wholesale Accounts Desk
            </span>
            
            <h2 className="contact-title">
              Direct Supplier Support
            </h2>
            
            <p className="contact-desc">
              Connect directly with our distribution operations team, credit managers, and freight logistics coordinators.
            </p>

            <div className="contact-details-list">
              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <Building2 size={16} />
                </div>
                <div>
                  <div className="contact-detail-title">Wholesale Logistics Gateway</div>
                  <div className="contact-detail-sub">Hub 04-East Commercial Center</div>
                  <div className="contact-detail-sub">4400 Terminal Way, Logistics Park</div>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <Phone size={16} />
                </div>
                <div>
                  <div className="contact-detail-title">Dispatch Desk Line</div>
                  <div className="contact-detail-sub tabular-nums">+1 (800) 555-8940 • Ext 4</div>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="contact-detail-title">Direct Procurement</div>
                  <div className="contact-detail-sub">orders@wholesalehub-b2b.com</div>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-box">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="contact-detail-title">Operating Hours</div>
                  <div className="contact-detail-sub">Mon – Fri, 07:00 – 19:00 EST</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Inquiry Form */}
        <div className="contact-form-col">
          <div className="contact-form-header">
            <h3 className="form-card-title">
              Submit Requisition Inquiry
            </h3>
            <p className="form-card-subtitle">
              Our accounts team responds within 1 business hour.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Contact Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input 
                  type="text" 
                  value={formData.company} 
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="form-input" 
                  required 
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Corporate Email *</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Related PO # (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. PO-89420"
                  value={formData.poNumber} 
                  onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                  className="form-input" 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject *</label>
              <input 
                type="text" 
                value={formData.subject} 
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="form-input" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message / Details *</label>
              <textarea 
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-textarea"
                placeholder="Describe your inquiry or order requirements..."
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-checkout-primary"
              disabled={isSubmitting}
              style={{ height: '38px', marginTop: '0.25rem' }}
            >
              <Send size={14} />
              <span>{isSubmitting ? 'Submitting...' : 'Send Inquiry'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
