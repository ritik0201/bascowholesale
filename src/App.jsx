import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SubHeader } from './components/SubHeader';
import { CatalogView } from './components/CatalogView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { ConfirmationView } from './components/ConfirmationView';
import { AdminOrdersView } from './components/AdminOrdersView';
import { ContactView } from './components/ContactView';
import { AccountView } from './components/AccountView';
import { INITIAL_PRODUCTS, INITIAL_ORDERS as MOCK_ORDERS } from './data/mockData';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import './styles/wholesale.css';

function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [currentOrder, setCurrentOrder] = useState(MOCK_ORDERS[0] || null);
  const [toast, setToast] = useState(null);

  // Initial staged wholesale cart (pre-loaded with standard lot allocations)
  const [cart, setCart] = useState(() => [
    {
      ...INITIAL_PRODUCTS[0],
      allocatedQty: 25,
    },
    {
      ...INITIAL_PRODUCTS[1],
      allocatedQty: 10,
    },
    {
      ...INITIAL_PRODUCTS[4],
      allocatedQty: 50,
    }
  ]);

  // Toast notification auto-dismiss
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Cart operations
  const handleAddToCart = (product, qty) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.id === product.id);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          allocatedQty: (next[existingIdx].allocatedQty || 0) + qty
        };
        return next;
      } else {
        return [...prev, { ...product, allocatedQty: qty }];
      }
    });
  };

  const handleBatchAddToCart = (items) => {
    setCart(prev => {
      const next = [...prev];
      items.forEach(({ product, qty }) => {
        const existingIdx = next.findIndex(item => item.id === product.id);
        if (existingIdx >= 0) {
          next[existingIdx] = {
            ...next[existingIdx],
            allocatedQty: qty
          };
        } else {
          next.push({ ...product, allocatedQty: qty });
        }
      });
      return next;
    });
    showToast(`Staged ${items.length} wholesale SKUs to cart`);
  };

  const handleUpdateCartQty = (productId, qty) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, allocatedQty: Math.max(1, qty) };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    showToast('Removed item from staged cart');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Staged wholesale cart cleared');
  };

  // Submit new wholesale purchase order
  const handleSubmitOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    setCart([]); // Clear cart
    setActiveTab('confirmation');
  };

  // Update order status in Admin view
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, status: newStatus };
        if (currentOrder && currentOrder.id === orderId) {
          setCurrentOrder(updated);
        }
        return updated;
      }
      return o;
    }));
  };

  return (
    <div className="app-container">
      {/* Global Navigation Header */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Sub-Header Live Feed Bar */}
      <SubHeader />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {activeTab === 'catalog' && (
          <CatalogView 
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onBatchAddToCart={handleBatchAddToCart}
            setIsCartOpen={setIsCartOpen}
            searchQuery={searchQuery}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'checkout' && (
          <CheckoutView 
            cart={cart}
            onBackToCatalog={() => setActiveTab('catalog')}
            onSubmitOrder={handleSubmitOrder}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'confirmation' && (
          <ConfirmationView 
            order={currentOrder}
            onBackToCatalog={() => setActiveTab('catalog')}
            onViewInAdmin={() => {
              setIsAdmin(true);
              setActiveTab('admin-orders');
            }}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'contact' && (
          <ContactView 
            onShowToast={showToast}
          />
        )}

        {activeTab === 'admin-orders' && (
          <AdminOrdersView 
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'account' && (
          <AccountView 
            onShowToast={showToast}
            onBackToCatalog={() => setActiveTab('catalog')}
            onGoToOrders={() => {
              setIsAdmin(true);
              setActiveTab('admin-orders');
            }}
          />
        )}
      </main>

      {/* Side Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateCartQty={handleUpdateCartQty}
        onRemoveCartItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setActiveTab('checkout');
        }}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="toast-floating">
          {toast.type === 'error' ? (
            <AlertCircle size={18} color="#f87171" />
          ) : (
            <CheckCircle2 size={18} color="#4ade80" />
          )}
          <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: '0.5rem' }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
