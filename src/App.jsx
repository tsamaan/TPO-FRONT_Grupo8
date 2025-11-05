import { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { PromoProvider } from './context/PromoContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import OrderHistoryPage from './pages/OrderHistoryPage';
import Navbar from './components/Navbar/Navbar';
import CartWidget from './components/Carrito/CartWidget';
import CartSidebar from './components/CartSidebar';
import ProductsPage from './pages/ProductsPage'
import ContactPage from './pages/ContactPage'
import Footer from './components/Footer/Footer'
import FilterWidget from './components/FilterWidget'

import './App.css';
import ProductDetailPage from './pages/ProductDetailPage';


function ProtectedScreen({ onLogout, user }) {
  return (
    <div className="login-container">
      <h2>Bienvenido, {user?.nombre || user?.usuario || 'usuario'}!</h2>
      <p style={{ margin: '1.5rem 0' }}>Ya estas autenticado en Haversack.</p>
      <button onClick={onLogout} style={{ marginTop: '1rem' }}>Cerrar sesion</button>
    </div>
  )
}

function MainApp() {
  const { isAuthenticated, user, setIsAuthenticated, setUser, logout } = useContext(AuthContext)
  const [cartOpen, setCartOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [productCount, setProductCount] = useState(0)

  const handleLogout = () => {
    logout();
  }

  const handleCartClick = () => setCartOpen(true)
  const handleCartClose = () => setCartOpen(false)
  const handleFilterClick = () => setFilterOpen(true)
  const handleFilterClose = () => setFilterOpen(false)
  const handleProductCountChange = (count) => setProductCount(count)

  // Nuevo: Renderizar rutas dentro de Router, y usar useLocation en un hijo
  return (
    <Router>
      <MainRoutes
        isAuthenticated={isAuthenticated}
        user={user}
        handleLogout={handleLogout}
        cartOpen={cartOpen}
        handleCartClick={handleCartClick}
        handleCartClose={handleCartClose}
        filterOpen={filterOpen}
        handleFilterClick={handleFilterClick}
        handleFilterClose={handleFilterClose}
        productCount={productCount}
        handleProductCountChange={handleProductCountChange}
      />
    </Router>
  )
}

function MainRoutes(props) {
  const location = useLocation();
  const {
    isAuthenticated,
    user,
    handleLogout,
    cartOpen,
    handleCartClick,
    handleCartClose,
    filterOpen,
    handleFilterClick,
    handleFilterClose,
    productCount,
    handleProductCountChange
  } = props;

  // Mostrar filtro en listado de productos y categorías (incluye /productos/categoria/:categoria)
  const showFilterWidget = (
    location.pathname === '/productos' ||
    location.pathname.startsWith('/productos/categoria/') ||
    location.pathname === '/mochilas' ||
    location.pathname === '/materos' ||
    location.pathname === '/bolsos'
  );

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<LoginPage />} />
      <Route
        path="*"
        element={
          <>
            <Navbar />
            <CartWidget onMenuClick={handleCartClick} />
            {showFilterWidget && (
              <FilterWidget onFilterClick={filterOpen ? handleFilterClose : handleFilterClick} productCount={productCount} isOpen={filterOpen} />
            )}
            <CartSidebar isOpen={cartOpen} onClose={handleCartClose} />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mis-compras"
                  element={
                    <ProtectedRoute>
                      <OrderHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/productos" element={<ProductsPage filterOpen={filterOpen} onFilterClose={handleFilterClose} onProductCountChange={handleProductCountChange} />} />
                <Route path="/productos/categoria/:categoria" element={<ProductsPage filterOpen={filterOpen} onFilterClose={handleFilterClose} onProductCountChange={handleProductCountChange} />} />
                <Route path="/productos/:id" element={<ProductDetailPage />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/mochilas" element={<ProductsPage category="mochilas" />} />
                <Route path="/materos" element={<ProductsPage category="materos" />} />
                <Route path="/bolsos" element={<ProductsPage category="bolsos" />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
          </>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <PromoProvider>
        <ProductProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </ProductProvider>
      </PromoProvider>
    </AuthProvider>
  )
}

export default App