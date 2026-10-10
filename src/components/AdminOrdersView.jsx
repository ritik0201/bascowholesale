import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Clock, 
  X, 
  Boxes,
  Package
} from 'lucide-react';

export function AdminOrdersView({ 
  orders, 
  onUpdateOrderStatus, 
  onShowToast 
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (activeFilter !== 'All' && o.status !== activeFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchId = o.orderNumber.toLowerCase().includes(query);
        const matchCustomer = o.customer.toLowerCase().includes(query);
        const matchPo = o.poNumber.toLowerCase().includes(query);
        if (!matchId && !matchCustomer && !matchPo) return false;
      }
      return true;
    });
  }, [orders, activeFilter, searchQuery]);

  // KPI Calculations
  const stagedCount = orders.filter(o => o.status === 'Staged').length;
  const inProgressCount = orders.filter(o => o.status === 'In Progress').length;
  const dispatchedCount = orders.filter(o => o.status === 'Dispatched').length;

  const totalFreightValue = orders.reduce((sum, o) => {
    const val = o.lineItems.reduce((s, i) => s + ((i.unitPrice || 0) * (i.qtyOrdered || 0)), 0);
    return sum + val;
  }, 0);

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Dispatched':
        return <span className="status-pill status-dispatched">Dispatched</span>;
      case 'In Progress':
        return <span className="status-pill status-progress">In Progress</span>;
      case 'Staged':
        return <span className="status-pill status-staged">Staged</span>;
      case 'Cancelled':
        return <span className="status-pill status-cancelled">Cancelled</span>;
      default:
        return <span className="status-pill">{status}</span>;
    }
  };

  const handleAdvanceStatus = (orderId, currentStatus) => {
    let nextStatus = currentStatus;
    if (currentStatus === 'Staged') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Dispatched';

    if (nextStatus !== currentStatus) {
      onUpdateOrderStatus(orderId, nextStatus);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: nextStatus }));
      }
      onShowToast?.(`Order ${orderId} moved to ${nextStatus}`);
    }
  };

  const filterTabs = [
    { label: 'All Orders', value: 'All', count: orders.length },
    { label: 'Staged', value: 'Staged', count: stagedCount },
    { label: 'In Progress', value: 'In Progress', count: inProgressCount },
    { label: 'Dispatched', value: 'Dispatched', count: dispatchedCount },
  ];

  return (
    <div className="admin-container animate-fade-in">
      <div className="admin-content-main">
        {/* Top Header */}
        <div className="admin-header-row">
          <div>
            <h1 className="admin-title">
              Wholesale Orders Console
            </h1>
            <p className="admin-subtitle">
              Monitor customer purchase orders, allocation statuses, and shipments.
            </p>
          </div>

          <div className="header-search" style={{ width: '260px' }}>
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search PO #, customer..."
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
        </div>

        {/* 4 Clean KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-title">
              <span>Total Orders</span>
              <Package size={15} color="#1d4ed8" />
            </div>
            <div className="kpi-number tabular-nums">
              {orders.length}
            </div>
            <div className="kpi-sub">Commercial wholesale POs</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-title">
              <span>Staged Buffer</span>
              <Clock size={15} color="#d97706" />
            </div>
            <div className="kpi-number tabular-nums">
              {stagedCount}
            </div>
            <div className="kpi-sub">Awaiting warehouse pick</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-title">
              <span>Picking & Packing</span>
              <Boxes size={15} color="#1d4ed8" />
            </div>
            <div className="kpi-number tabular-nums">
              {inProgressCount}
            </div>
            <div className="kpi-sub">In active fulfillment</div>
          </div>

          <div className="kpi-card">
            <div className="kpi-title">
              <span>Active Valuation</span>
              <ShieldCheck size={15} color="#059669" />
            </div>
            <div className="kpi-number tabular-nums" style={{ color: '#059669' }}>
              ${totalFreightValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="kpi-sub">Total receivables</div>
          </div>
        </div>

        {/* Filter Tabs Toolbar */}
        <div className="admin-filter-bar">
          <div className="platform-tab-group">
            {filterTabs.map(tab => (
              <button 
                key={tab.value}
                className={`platform-filter-pill ${activeFilter === tab.value ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab.value)}
              >
                <span>{tab.label}</span>
                <span className="tab-count-badge tabular-nums">({tab.count})</span>
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Showing <strong>{filteredOrders.length}</strong> {filteredOrders.length === 1 ? 'order' : 'orders'}
          </div>
        </div>

        {/* Orders Table */}
        <div className="table-card">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>ORDER #</th>
                  <th>CUSTOMER & PO</th>
                  <th style={{ textAlign: 'center', width: '90px' }}>UNITS</th>
                  <th style={{ width: '130px' }}>DATE</th>
                  <th style={{ width: '120px' }}>STATUS</th>
                  <th style={{ width: '180px' }}>CARRIER</th>
                  <th style={{ textAlign: 'right', width: '170px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                      No orders found in this view.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr 
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      style={{ cursor: 'pointer' }}
                      className={selectedOrder?.id === ord.id ? 'selected' : ''}
                    >
                      <td>
                        <span className="sku-badge" style={{ color: '#1d4ed8', fontWeight: 600 }}>
                          {ord.orderNumber}
                        </span>
                      </td>
                      <td>
                        <div className="product-cell-main">
                          <span className="product-title" style={{ fontSize: '0.8125rem' }}>{ord.customer}</span>
                          <span className="product-sub" style={{ fontFamily: 'var(--font-mono)' }}>{ord.poNumber}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="tabular-nums" style={{ fontWeight: 600, color: '#0b1c30' }}>
                          {ord.totalUnits}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {ord.submissionDate}
                      </td>
                      <td>
                        {getStatusBadge(ord.status)}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.75rem', color: '#0b1c30' }}>
                          {ord.freight?.carrier || 'Carrier unassigned'}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          {ord.status === 'Staged' && (
                            <button 
                              className="btn-add-cart"
                              style={{ padding: '0 0.5rem', height: '26px', fontSize: '0.6875rem' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdvanceStatus(ord.id, ord.status);
                              }}
                            >
                              Start Picking →
                            </button>
                          )}
                          {ord.status === 'In Progress' && (
                            <button 
                              className="btn-add-cart"
                              style={{ padding: '0 0.5rem', height: '26px', fontSize: '0.6875rem', backgroundColor: '#059669' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdvanceStatus(ord.id, ord.status);
                              }}
                            >
                              Dispatch →
                            </button>
                          )}
                          <button 
                            className="btn-action-inspect"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(ord);
                            }}
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Clean Inspector Drawer */}
      {selectedOrder && (
        <div className="cart-drawer-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="cart-drawer-panel" style={{ width: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="cart-drawer-header">
              <div className="cart-header-title">
                <div className="cart-header-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="cart-title-text">
                    Order {selectedOrder.orderNumber}
                  </div>
                  <div className="cart-subtitle-text">
                    {selectedOrder.customer} • {selectedOrder.poNumber}
                  </div>
                </div>
              </div>

              <button className="cart-icon-btn" onClick={() => setSelectedOrder(null)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Status Action Card */}
              <div className="inspector-status-box">
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Current Status</div>
                  <div style={{ marginTop: '2px' }}>{getStatusBadge(selectedOrder.status)}</div>
                </div>
                {selectedOrder.status === 'Staged' && (
                  <button 
                    className="btn-add-cart"
                    onClick={() => handleAdvanceStatus(selectedOrder.id, selectedOrder.status)}
                  >
                    Start Picking
                  </button>
                )}
                {selectedOrder.status === 'In Progress' && (
                  <button 
                    className="btn-add-cart"
                    style={{ backgroundColor: '#059669' }}
                    onClick={() => handleAdvanceStatus(selectedOrder.id, selectedOrder.status)}
                  >
                    Mark Dispatched
                  </button>
                )}
              </div>

              {/* Order Info */}
              <div className="specs-card">
                <div className="specs-card-header">
                  <span>Shipping & Contact</span>
                </div>
                <div className="specs-list">
                  <div className="specs-row">
                    <span className="specs-label">Buyer</span>
                    <span className="specs-val">{selectedOrder.buyerName}</span>
                  </div>
                  <div className="specs-row">
                    <span className="specs-label">Email</span>
                    <span className="specs-val">{selectedOrder.buyerEmail}</span>
                  </div>
                  <div className="specs-row">
                    <span className="specs-label">Destination</span>
                    <span className="specs-val">
                      {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state}
                    </span>
                  </div>
                  <div className="specs-row">
                    <span className="specs-label">Carrier</span>
                    <strong className="specs-val">{selectedOrder.freight?.carrier}</strong>
                  </div>
                </div>
              </div>

              {/* Line items list */}
              <div className="specs-card">
                <div className="specs-card-header">
                  <span>Order Items ({selectedOrder.lineItems.length})</span>
                  <span className="tabular-nums" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {selectedOrder.totalUnits} Units
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {selectedOrder.lineItems.map((li, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.75rem' }}>
                      <div>
                        <span className="sku-badge">{li.sku}</span>
                        <span style={{ marginLeft: '6px', fontWeight: 500, color: '#0b1c30' }}>{li.description}</span>
                      </div>
                      <strong className="tabular-nums">{li.qtyOrdered} units</strong>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
