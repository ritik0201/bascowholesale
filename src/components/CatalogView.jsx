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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [selectedChildCategory, setSelectedChildCategory] = useState('All');
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

  // Derive unique categories
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Derive subcategories for the selected category
  const subCategories = useMemo(() => {
    if (selectedCategory === 'All') return [];
    const set = new Set();
    products.forEach(p => {
      if (p.category === selectedCategory && p.subCategory) {
        set.add(p.subCategory);
      }
    });
    return ['All', ...Array.from(set)];
  }, [products, selectedCategory]);

  // Derive child categories for selected category + subCategory
  const childCategories = useMemo(() => {
    if (selectedCategory === 'All' || selectedSubCategory === 'All') return [];
    const set = new Set();
    products.forEach(p => {
      if (
        p.category === selectedCategory && 
        p.subCategory === selectedSubCategory && 
        p.childCategory
      ) {
        set.add(p.childCategory);
      }
    });
    return ['All', ...Array.from(set)];
  }, [products, selectedCategory, selectedSubCategory]);

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
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedSubCategory !== 'All' && p.subCategory !== selectedSubCategory) return false;
      if (selectedChildCategory !== 'All' && p.childCategory !== selectedChildCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchSku = p.sku.toLowerCase().includes(query);
        const matchCat = (p.categoryPath || []).some(c => c.toLowerCase().includes(query));
        if (!matchName && !matchSku && !matchCat) return false;
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
  }, [
    products, 
    selectedCategory, 
    selectedSubCategory, 
    selectedChildCategory, 
    inStockOnly, 
    searchQuery, 
    sortField, 
    sortDirection
  ]);

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

  // Quick category path filter handler from table row clicks
  const handleFilterByPath = (category, subCategory = 'All', childCategory = 'All') => {
    setSelectedCategory(category);
    setSelectedSubCategory(subCategory);
    setSelectedChildCategory(childCategory);
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

  const isFiltered = selectedCategory !== 'All' || selectedSubCategory !== 'All' || selectedChildCategory !== 'All' || inStockOnly || searchQuery;

  return (
    <div className="catalog-container animate-fade-in">
      
      {/* Live Hierarchical Category & Subcategory Navigation Panel */}
      <div className="category-nav-panel">
        
        {/* Level 1: Category Filter Pills */}
        <div className="category-pills-row">
          <span className="category-level-label">Category:</span>
          <div className="platform-tab-group">
            {categories.map(cat => (
              <button
                key={cat}
                className={`platform-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory('All');
                  setSelectedChildCategory('All');
                }}
              >
                {cat === 'All' ? 'All Products' : cat}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span>In stock only</span>
            </label>

            {isFiltered && (
              <button 
                className="reset-filters-btn" 
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedSubCategory('All');
                  setSelectedChildCategory('All');
                  setInStockOnly(false);
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Level 2: Sub-Category Pills (e.g. PlayStation -> PlayStation 5) */}
        {selectedCategory !== 'All' && subCategories.length > 0 && (
          <div className="category-pills-row sub-pills-row animate-fade-in">
            <span className="category-level-label">Sub-Category:</span>
            <div className="platform-tab-group">
              {subCategories.map(sub => (
                <button
                  key={sub}
                  className={`platform-filter-pill ${selectedSubCategory === sub ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedSubCategory(sub);
                    setSelectedChildCategory('All');
                  }}
                >
                  {sub === 'All' ? `All ${selectedCategory}` : sub}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Level 3: Child Category Pills (e.g. PlayStation 5 -> Games / Consoles / Accessories) */}
        {selectedSubCategory !== 'All' && childCategories.length > 0 && (
          <div className="category-pills-row child-pills-row animate-fade-in">
            <span className="category-level-label">Type:</span>
            <div className="platform-tab-group">
              {childCategories.map(child => (
                <button
                  key={child}
                  className={`platform-filter-pill ${selectedChildCategory === child ? 'active' : ''}`}
                  onClick={() => setSelectedChildCategory(child)}
                >
                  {child === 'All' ? `All ${selectedSubCategory}` : child}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Active Breadcrumb Bar */}
        <div className="active-breadcrumb-bar">
          <span className="breadcrumb-label">Current View:</span>
          <span 
            className={`breadcrumb-active-crumb ${selectedCategory === 'All' ? 'current' : ''}`}
            onClick={() => handleFilterByPath('All')}
          >
            Catalog
          </span>

          {selectedCategory !== 'All' && (
            <>
              <span className="breadcrumb-sep">/</span>
              <span 
                className={`breadcrumb-active-crumb ${selectedSubCategory === 'All' ? 'current' : ''}`}
                onClick={() => handleFilterByPath(selectedCategory, 'All', 'All')}
              >
                {selectedCategory}
              </span>
            </>
          )}

          {selectedSubCategory !== 'All' && (
            <>
              <span className="breadcrumb-sep">/</span>
              <span 
                className={`breadcrumb-active-crumb ${selectedChildCategory === 'All' ? 'current' : ''}`}
                onClick={() => handleFilterByPath(selectedCategory, selectedSubCategory, 'All')}
              >
                {selectedSubCategory}
              </span>
            </>
          )}

          {selectedChildCategory !== 'All' && (
            <>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-active-crumb current">
                {selectedChildCategory}
              </span>
            </>
          )}

          <span className="catalog-stats-inline tabular-nums">
            ({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'})
          </span>
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
                  style={{ minWidth: '340px' }}
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
                  style={{ width: '130px' }}
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
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
                    <div>No products found matching your current sub-category filter.</div>
                    <button 
                      className="reset-filters-btn" 
                      onClick={() => handleFilterByPath('All')}
                      style={{ marginTop: '0.5rem', display: 'inline-block' }}
                    >
                      Clear category filters
                    </button>
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
                          
                          {/* Live Sub-Category Breadcrumb Badges */}
                          <div className="product-category-path">
                            <span 
                              className="cat-crumb-btn" 
                              onClick={() => handleFilterByPath(prod.category)}
                              title={`Filter by ${prod.category}`}
                            >
                              {prod.category}
                            </span>
                            <span className="cat-crumb-sep">/</span>
                            <span 
                              className="cat-crumb-btn"
                              onClick={() => handleFilterByPath(prod.category, prod.subCategory)}
                              title={`Filter by ${prod.category} / ${prod.subCategory}`}
                            >
                              {prod.subCategory}
                            </span>
                            {prod.childCategory && (
                              <>
                                <span className="cat-crumb-sep">/</span>
                                <span 
                                  className="cat-crumb-btn child-tag"
                                  onClick={() => handleFilterByPath(prod.category, prod.subCategory, prod.childCategory)}
                                  title={`Filter by ${prod.category} / ${prod.subCategory} / ${prod.childCategory}`}
                                >
                                  {prod.childCategory}
                                </span>
                              </>
                            )}
                            <span className="sku-badge" style={{ marginLeft: '4px' }}>{prod.sku}</span>
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
            Showing <strong className="tabular-nums">{filteredProducts.length}</strong> of <strong className="tabular-nums">{products.length}</strong> wholesale products
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            All prices wholesale in USD • Net 30 Commercial Terms
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
