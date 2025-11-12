import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getOrdersByEmail } from '../services/api';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.email) {
        setError('No se pudo obtener el email del usuario');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const ordersData = await getOrdersByEmail(user.email);
        setOrders(ordersData);
        setError(null);
      } catch (err) {
        console.error('Error al obtener ordenes:', err);
        setError('Error al cargar el historial de compras');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

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

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': 'Pendiente',
      'CONFIRMED': 'Confirmada',
      'SHIPPED': 'Enviada',
      'DELIVERED': 'Entregada',
      'CANCELLED': 'Cancelada'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    return `order-status order-status--${status.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="order-history-page ">
        <div className="order-history-container">
          <h1>Mis Compras</h1>
          <div className="loading-message">Cargando historial de compras...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-page">
        <div className="order-history-container">
          <h1>Mis Compras</h1>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="order-history-container">
        <h1>Mis Compras</h1>
        
        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-orders-icon">📦</div>
            <h2>No tienes compras realizadas</h2>
            <p>Cuando realices tu primera compra, aparecera aqui.</p>
            <a href="/productos" className="btn-primary">Ir a Productos</a>
          </div>
        ) : (
          <div className="orders-list">
            <p className="orders-count">
              {orders.length} {orders.length === 1 ? 'compra realizada' : 'compras realizadas'}
            </p>
            
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Pedido #{order.id}</h3>
                    <p className="order-date">{formatDate(order.fecha)}</p>
                  </div>
                  <div className={getStatusClass(order.estado)}>
                    {getStatusText(order.estado)}
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-items">
                    <h4>Productos ({order.detallesPedido?.length || 0})</h4>
                    <ul>
                      {order.detallesPedido?.map((item, index) => (
                        <li key={index} className="order-item">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">x{item.cantidad}</span>
                          <span className="item-price">
                            ${(item.precio * item.cantidad).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {order.direccion && (
                    <div className="order-address">
                      <h4>Direccion de entrega</h4>
                      <p>
                        {order.direccion.calle}
                        {order.direccion.ciudad && `, ${order.direccion.ciudad}`}
                        {order.direccion.codigoPostal && ` - CP: ${order.direccion.codigoPostal}`}
                        {order.direccion.pais && `, ${order.direccion.pais}`}
                      </p>
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
