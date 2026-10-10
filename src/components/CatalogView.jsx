import React, { useState, useMemo } from 'react';
import { 
  Minus, 
  Plus, 
  ArrowUpDown, 
  ArrowRight,
  Layers,
  X
} from 'lucide-react';

export function CatalogView({ 
  products, 
  cart, 
  onAddToCart, 
  onBatchAddToCart, 
  setIsCartOpen, 
  searchQuery, 
  onShowToast 
}) {
  const [platformFilter, setPlatformFilter] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // Track allocation inputs per product
  const [allocations, setAllocations] = useState(() => {
    const map = {};
    products.forEach(p => {
      map[p.id] = p.defaultAllocated > 0 ? p.defaultAllocated : 10;
    });
    return map;
  });

  // Track checked rows for batch selection (starts empty)
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Handle quantity changes
  const handleQtyChange = (productId, newQty) => {
    const val = Math.max(1, parseInt(newQty) || 1);
    setAllocations(prev => ({ ...prev, [productId]: val }));
  };

  const handleIncrement = (productId) => {
    setAllocations(prev => ({ ...prev, [productId]: (prev[productId] || 10) + 5 }));
  };

  const handleDecrement = (productId) => {
    setAllocations(prev => ({ ...prev, [productId]: Math.max(1, (prev[productId] || 10) - 5) }));
  };

  // Row selection toggle
  const toggleRowSelect = (productId) => {
    setSelectedRowIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  // Select all toggle
  const toggleSelectAll = () => {
    if (selectedRowIds.size === filteredProducts.length) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (inStockOnly && p.stock <= 0) return false;
      if (platformFilter !== 'All' && !p.platform.includes(platformFilter)) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchSku = p.sku.toLowerCase().includes(query);
        if (!matchName && !matchSku) return false;
      }
      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [products, platformFilter, inStockOnly, searchQuery, sortField, sortDirection]);

  // Handle single add to cart
  const handleSingleAdd = (product) => {
    const qty = allocations[product.id] || 10;
    if (qty <= 0) {
      onShowToast?.('Please allocate at least 1 unit.', 'error');
      return;
    }
    onAddToCart(product, qty);
    onShowToast?.(`Added ${qty} units of ${product.sku} to cart`);
  };

  // Calculate batch totals for selected rows
  const selectedProducts = products.filter(p => selectedRowIds.has(p.id));
  const totalSelectedUnits = selectedProducts.reduce((sum, p) => sum + (allocations[p.id] || 10), 0);

  const handleReviewBatch = () => {
    if (selectedProducts.length === 0) return;
    onBatchAddToCart(selectedProducts.map(p => ({
      product: p,
      qty: allocations[p.id] || 10
    })));
    setSelectedRowIds(new Set());
    setIsCartOpen(true);
  };

  const platforms = ['All', 'PS5', 'XBOX', 'SWITCH', 'PC'];

  return (
    <div className="catalog-container animate-fade-in">
      {/* Clean Toolbar */}
      <div className="catalog-toolbar">
        <div className="filters-group">
          {/* Platform Category Tabs */}
          <div className="platform-tab-group">
            {platforms.map(plat => (
              <button
                key={plat}
                className={`platform-filter-pill ${platformFilter === plat ? 'active' : ''}`}
                onClick={() => setPlatformFilter(plat)}
              >
                {plat === 'All' ? 'All Categories' : plat}
              </button>
            ))}
          </div>

          {/* In-stock toggle */}
          <label className="checkbox-label" style={{ marginLeft: '0.75rem' }}>
            <input 
              type="checkbox" 
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            <span>In stock only</span>
          </label>

          {(platformFilter !== 'All' || inStockOnly || searchQuery) && (
            <button 
              className="reset-filters-btn" 
              onClick={() => {
                setPlatformFilter('All');
                setInStockOnly(false);
              }}
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="catalog-stats-badge">
          Showing <strong className="tabular-nums">{filteredProducts.length}</strong> Products
        </div>
      </div>

      {/* Main Data Table */}
      <div className="table-card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '44px', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedRowIds.size === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    title="Select all"
                  />
                </th>
                <th 
                  className="sortable" 
                  onClick={() => {
                    setSortField('name');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}
                  style={{ minWidth: '320px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>PRODUCT</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ width: '130px' }}>CONDITION</th>
                <th 
                  className="sortable"
                  onClick={() => {
                    setSortField('stock');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}
                  style={{ width: '150px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>STOCK</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  className="sortable"
                  onClick={() => {
                    setSortField('unitPrice');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}
                  style={{ textAlign: 'right', width: '130px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                    <span>UNIT PRICE</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ textAlign: 'center', width: '140px' }}>QUANTITY</th>
                <th style={{ textAlign: 'right', width: '130px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                    No products match your current filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const isSelected = selectedRowIds.has(prod.id);
                  const currentAllocated = allocations[prod.id] || 10;
                  const isOutOfStock = prod.stock === 0;
                  const isInCart = cart.some(item => item.id === prod.id);

                  return (
                    <tr 
                      key={prod.id} 
                      className={isSelected ? 'selected' : ''}
                    >
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleRowSelect(prod.id)}
                        />
                      </td>
                      <td>
                        <div className="product-cell-main">
                          <span className="product-title">{prod.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '3px' }}>
                            <span className="sku-badge">{prod.sku}</span>
                            <span className="platform-pill">{prod.platform}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="condition-tag">
                          {prod.condition}
                        </span>
                      </td>
                      <td>
                        {prod.stock > 0 ? (
                          <span className="stock-indicator stock-in">
                            <span className="stock-dot"></span>
                            <span>In Stock</span>
                          </span>
                        ) : (
                          <span className="stock-indicator stock-out">
                            <span className="stock-dot"></span>
                            <span>Out of Stock</span>
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="product-price tabular-nums">
                          ${prod.unitPrice.toFixed(2)}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="stepper-control" style={{ margin: '0 auto' }}>
                          <button 
                            className="stepper-btn"
                            disabled={isOutOfStock || currentAllocated <= 1}
                            onClick={() => handleDecrement(prod.id)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={11} />
                          </button>
                          <input 
                            type="text" 
                            className="stepper-input tabular-nums"
                            value={currentAllocated}
                            disabled={isOutOfStock}
                            onChange={(e) => handleQtyChange(prod.id, e.target.value)}
                          />
                          <button 
                            className="stepper-btn"
                            disabled={isOutOfStock}
                            onClick={() => handleIncrement(prod.id)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isOutOfStock ? (
                          <button className="btn-out-stock" disabled>
                            Unavailable
                          </button>
                        ) : (
                          <button 
                            className={`btn-add-cart ${isInCart ? 'btn-in-cart' : ''}`}
                            onClick={() => handleSingleAdd(prod)}
                          >
                            {isInCart ? 'Add More' : 'Add to Cart'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Clean Footer */}
        <div className="table-pagination-footer">
          <div>
            Total <strong className="tabular-nums">{filteredProducts.length}</strong> items in catalog
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            All prices in USD • Net 30 Terms
          </div>
        </div>
      </div>

      {/* Floating Batch Action Dock - Only appears when rows are selected */}
      {selectedRowIds.size > 0 && (
        <div className="batch-action-dock">
          <div className="batch-dock-left">
            <div className="batch-box-icon">
              <Layers size={16} />
            </div>
            <div>
              <div className="batch-title">
                {selectedRowIds.size} Selected {selectedRowIds.size === 1 ? 'Item' : 'Items'}
              </div>
              <div className="batch-subtitle">
                Total {totalSelectedUnits} units
              </div>
            </div>
          </div>

          <button 
            className="batch-clear-btn"
            onClick={() => setSelectedRowIds(new Set())}
          >
            <X size={13} />
            Clear
          </button>

          <button 
            className="batch-review-btn"
            onClick={handleReviewBatch}
          >
            <span>Add Selected to Cart ({totalSelectedUnits} Units)</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
