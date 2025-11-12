import { useState, useEffect, useContext } from 'react';
import { fetchProducts, deleteProduct, registerAdmin } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import AddProductForm from '../components/AddProductForm';
import EditProductForm from '../components/EditProductForm';
import UserManagement from '../components/UserManagement';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, isSuperAdmin, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showRegisterAdmin, setShowRegisterAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('products'); // 'products' o 'users'
  const [adminFormData, setAdminFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: ''
  });
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estas seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        setError(err.message || 'Error al eliminar el producto');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleProductUpdated = () => {
    setEditingProduct(null);
    loadProducts();
  };

  const handleProductAdded = () => {
    loadProducts();
  };

  const handleAdminFormChange = (e) => {
    setAdminFormData({
      ...adminFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterAdmin = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (adminFormData.password !== adminFormData.confirmPassword) {
      setAdminError('Las contraseñas no coinciden');
      return;
    }

    try {
      await registerAdmin(adminFormData);
      setAdminSuccess('Admin registrado exitosamente');
      setAdminFormData({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        address: ''
      });
      setTimeout(() => {
        setShowRegisterAdmin(false);
        setAdminSuccess('');
      }, 2000);
    } catch (err) {
      setAdminError(err.message || 'Error al registrar admin');
    }
  };

  if (loading) {
    return <div className="admin-dashboard__feedback">Cargando...</div>;
  }

  if (error) {
    return <div className="admin-dashboard__feedback admin-dashboard__feedback--error">{error}</div>;
  }

  return (
    <main className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h1>Panel de Administracion</h1>
          <p className="admin-welcome">Bienvenido, {user?.name || user?.email}</p>
          {isSuperAdmin() && <span className="admin-badge">SUPERADMIN</span>}
        </div>
        <div className="admin-actions">
          {isSuperAdmin() && (
            <button 
              onClick={() => setShowRegisterAdmin(!showRegisterAdmin)} 
              className="btn btn--primary"
            >
              {showRegisterAdmin ? 'Ocultar' : 'Registrar Admin'}
            </button>
          )}
          <button onClick={logout} className="btn btn--logout">Cerrar Sesion</button>
        </div>
      </div>

      {/* Tabs de navegacion */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'admin-tab--active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Gestion de Productos
        </button>
        {isSuperAdmin() && (
          <button 
            className={`admin-tab ${activeTab === 'users' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Gestion de Usuarios
          </button>
        )}
      </div>

      {isSuperAdmin() && showRegisterAdmin && (
        <div className="register-admin-section">
          <h2>Registrar Nuevo Admin</h2>
          <form onSubmit={handleRegisterAdmin} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nombre Completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={adminFormData.name}
                  onChange={handleAdminFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={adminFormData.email}
                  onChange={handleAdminFormChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={adminFormData.password}
                  onChange={handleAdminFormChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={adminFormData.confirmPassword}
                  onChange={handleAdminFormChange}
                  required
                  minLength="6"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Telefono (opcional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={adminFormData.phone}
                  onChange={handleAdminFormChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Direccion (opcional)</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={adminFormData.address}
                  onChange={handleAdminFormChange}
                />
              </div>
            </div>
            {adminError && <div className="admin-form-error">{adminError}</div>}
            {adminSuccess && <div className="admin-form-success">{adminSuccess}</div>}
            <button type="submit" className="btn btn--submit">Registrar Admin</button>
          </form>
        </div>
      )}

      {/* Contenido segun el tab activo */}
      {activeTab === 'products' ? (
        <>
          {editingProduct ? (
            <EditProductForm
              product={editingProduct}
              onProductUpdated={handleProductUpdated}
              onCancel={handleCancelEdit}
            />
          ) : (
            <AddProductForm onProductAdded={handleProductAdded} />
          )}

          <div className="product-list-admin">
            <h2>Listado de Productos</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      {(product.images?.[0] || product.image) && (
                        <img src={product.images?.[0] || product.image} alt={product.name} className="product-list-admin__image" />
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button onClick={() => handleEdit(product)} className="btn btn--edit">Editar</button>
                      <button onClick={() => handleDelete(product.id)} className="btn btn--delete">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <UserManagement />
      )}
    </main>
  );
};

export default AdminDashboard;