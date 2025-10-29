import { useState, useEffect } from 'react';
import { fetchProducts, deleteProduct } from '../services/api';
import AddProductForm from '../components/AddProductForm';
import EditProductForm from '../components/EditProductForm';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

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
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
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

  if (loading) {
    return <div className="admin-dashboard__feedback">Cargando...</div>;
  }

  if (error) {
    return <div className="admin-dashboard__feedback admin-dashboard__feedback--error">{error}</div>;
  }

  return (
    <main className="admin-dashboard">
      <h1>Panel de Administración</h1>

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
    </main>
  );
};

export default AdminDashboard;