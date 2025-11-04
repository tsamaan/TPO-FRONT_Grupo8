

import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { updateProduct, getProductById, createOrder } from '../services/api';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, removeFromCart, addToCart, calculateTotal, clearCart } = useCart();

  // Simulación de stock en memoria (solo para frontend)
  const stockMap = React.useRef({});
  React.useEffect(() => {
    cart.forEach(item => {
      if (stockMap.current[item.id] === undefined) {
        stockMap.current[item.id] = item.stock ?? 10;
      }
    });
  }, [cart]);

  const [showUserForm, setShowUserForm] = React.useState(false);
  const [userData, setUserData] = React.useState({ nombre: '', apellido: '', email: '', telefono: '' });
  const [formError, setFormError] = React.useState('');

  if (!isOpen) return null;

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      addToCart(item, -1);
    }
  };

  const handleIncrease = (item) => {
    const stockRestante = stockMap.current[item.id] - item.quantity;
    if (stockRestante > 0) {
      addToCart(item, 1);
    } else {
      alert('No hay más stock disponible de este producto');
    }
  };

  const totalPrice = calculateTotal();

  const reduceStock = () => {
    cart.forEach(item => {
      stockMap.current[item.id] = stockMap.current[item.id] - item.quantity;
    });
  };

  // Primer paso: validar stock y mostrar formulario
  const handleBuy = async () => {
    try {
      const stockCheck = await Promise.all(
        cart.map(async item => {
          const productoApi = await getProductById(item.id);
          return productoApi.stock >= item.quantity;
        })
      );
      const sinStock = stockCheck.some(valid => !valid);
      if (sinStock) {
        alert('No hay suficiente stock disponible para uno o más productos. Actualiza la página y vuelve a intentar.');
        return;
      }
      setShowUserForm(true);
    } catch (err) {
      alert('Error al validar el stock en la API');
    }
  };

  // Segundo paso: validar datos y stock, reducir stock y finalizar compra
  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    if (!userData.nombre || !userData.apellido || !userData.email || !userData.telefono) {
      setFormError('Todos los campos son obligatorios');
      return;
    }
    setFormError('');
    // Volver a chequear stock antes de finalizar
    try {
      const stockCheck = await Promise.all(
        cart.map(async item => {
          const productoApi = await getProductById(item.id);
          return productoApi.stock >= item.quantity;
        })
      );
      const sinStock = stockCheck.some(valid => !valid);
      if (sinStock) {
        alert('No hay suficiente stock disponible para uno o más productos. Actualiza la página y vuelve a intentar.');
        setShowUserForm(false);
        return;
      }
      // Guardar la orden en la API
      const orderData = {
        ...userData,
        productos: cart.map(item => ({
          id: item.id,
          name: item.name,
          cantidad: item.quantity,
          precio: item.price
        })),
        total: calculateTotal(),
        fecha: new Date().toISOString()
      };
      await createOrder(orderData);
      await Promise.all(
        cart.map(async item => {
          const productoApi = await getProductById(item.id);
          const nuevoStock = productoApi.stock - item.quantity;
          await updateProduct(item.id, { ...productoApi, stock: nuevoStock });
          stockMap.current[item.id] = nuevoStock;
        })
      );
      reduceStock();
      clearCart();
      alert('¡Compra generada con éxito!');
      setShowUserForm(false);
      onClose();
      navigate('/');
      window.location.reload();
    } catch (err) {
      alert('Error al validar o actualizar el stock en la API');
    }
  };

  const handleUserInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <div className="cart-sidebar-overlay" onClick={onClose}>
      <aside className="cart-sidebar" onClick={e => e.stopPropagation()}>
        <h2 className="cart-title">Carrito de Compras</h2>
        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div className="cart-empty">Tu carrito está vacío.</div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.images?.[0] || item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">
                    ${typeof item.price === 'number' ? item.price.toLocaleString('es-AR') : '0'}
                  </div>
                  <div className="cart-item-stock">Stock disponible: {stockMap.current[item.id] - item.quantity}</div>
                  <div className="cart-item-controls">
                    <button onClick={() => handleDecrease(item)} disabled={item.quantity <= 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleIncrease(item)} disabled={stockMap.current[item.id] - item.quantity <= 0}>+</button>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-summary">
          <div className="cart-total-row">
            <span>TOTAL:</span>
            <span>${totalPrice.toLocaleString('es-AR')}</span>
          </div>
          <div className="cart-cuotas">O hasta 24 cuotas de $ {(totalPrice/24).toLocaleString('es-AR')}</div>
          <div className="cart-subtotal-row">
            <span>SUBTOTAL:</span>
            <span>${totalPrice.toLocaleString('es-AR')}</span>
          </div>
          <div className="cart-envio-row">
            <span>ENVÍO:</span>
            <span>Calculálo arriba para verlo</span>
          </div>
          {!showUserForm && (
            <button className="cart-buy-btn" onClick={handleBuy}>FINALIZAR COMPRA</button>
          )}
          {showUserForm && (
            <form className="cart-user-form" onSubmit={handleUserFormSubmit} style={{
              marginTop: '1.2rem',
              background: 'linear-gradient(90deg, #fff 60%, #f8dada 100%)',
              borderRadius: '14px',
              boxShadow: '0 2px 12px rgba(182,57,57,0.08)',
              padding: '1.2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
              border: '1.5px solid #b63939f0',
              alignItems: 'center'
            }}>
              <div className="cart-user-form-row" style={{ width: '100%', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input type="text" name="nombre" placeholder="Nombre" value={userData.nombre} onChange={handleUserInputChange} required style={{ flex: '1 1 100%', minWidth: '0', padding: '0.7rem', borderRadius: '8px', border: '1px solid #b63939', fontSize: '1rem', background: '#fff', marginBottom: '0.5rem' }} />
                <input type="text" name="apellido" placeholder="Apellido" value={userData.apellido} onChange={handleUserInputChange} required style={{ flex: '1 1 100%', minWidth: '0', padding: '0.7rem', borderRadius: '8px', border: '1px solid #b63939', fontSize: '1rem', background: '#fff' }} />
              </div>
              <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleUserInputChange} required style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #b63939', fontSize: '1rem', background: '#fff' }} />
              <input type="text" name="telefono" placeholder="Teléfono" value={userData.telefono} onChange={handleUserInputChange} required style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #b63939', fontSize: '1rem', background: '#fff' }} />
              {formError && <div style={{ color: '#b63939', fontSize: '1rem', fontWeight: 600, marginTop: '-0.5rem' }}>{formError}</div>}
              <button type="submit" className="cart-buy-btn" style={{
                background: 'linear-gradient(90deg, #b63939 60%, #e0e7ff 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: '8px',
                padding: '0.7rem 1.2rem',
                border: 'none',
                boxShadow: '0 2px 8px rgba(182,57,57,0.08)',
                cursor: 'pointer',
                marginTop: '0.5rem',
                letterSpacing: '0.04em',
                transition: 'background 0.2s, color 0.2s'
              }}>CONFIRMAR COMPRA</button>
            </form>
          )}
        </div>
        <button className="cart-close-btn" onClick={onClose} aria-label="Cerrar carrito">×</button>
      </aside>
    </div>
  );
};

export default CartSidebar;
