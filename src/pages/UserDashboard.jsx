import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchUserOrders } from '../services/api';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchUserOrders(user?.id);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <div className="user-dashboard">
      <div className="user-dashboard-header">
        <h1>Mi Perfil</h1>
        <button onClick={logout} className="logout-btn">Cerrar Sesión</button>
      </div>

      <div className="user-info-card">
        <h2>Información Personal</h2>
        <div className="user-info-grid">
          <div className="user-info-item">
            <span className="info-label">Nombre:</span>
            <span className="info-value">{user?.name || `${user?.nombre} ${user?.apellido}`}</span>
          </div>
          <div className="user-info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>
          {user?.phone && (
            <div className="user-info-item">
              <span className="info-label">Teléfono:</span>
              <span className="info-value">{user.phone}</span>
            </div>
          )}
          {user?.address && (
            <div className="user-info-item">
              <span className="info-label">Dirección:</span>
              <span className="info-value">{user.address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="orders-section">
        <h2>Mis Compras</h2>
        
        {loading ? (
          <div className="loading">Cargando órdenes...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <p>Aún no has realizado ninguna compra.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">Orden #{order.id}</div>
                  <div className="order-date">{formatDate(order.fecha || order.createdAt)}</div>
                </div>
                
                <div className="order-status">
                  <span className={`status-badge ${order.status?.toLowerCase()}`}>
                    {order.status || 'Procesando'}
                  </span>
                </div>

                <div className="order-items">
                  <h4>Productos:</h4>
                  {order.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">{item.productName || item.name}</span>
                      <span className="item-quantity">x{item.quantity || item.cantidad}</span>
                      <span className="item-price">{formatPrice(item.price || item.precio)}</span>
                    </div>
                  )) || order.productos?.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.cantidad}</span>
                      <span className="item-price">{formatPrice(item.precio)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-total">
                  <span>Total:</span>
                  <span className="total-amount">{formatPrice(order.total || order.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
