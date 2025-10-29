import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { CartContext } from '../context/CartContext';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import './ProductList.css';

const ProductList = ({ category: propCategory = null, filterOpen = false, onFilterClose, onProductCountChange }) => {
  const params = useParams();
  const category = params.categoria || propCategory;
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    let isSubscribed = true;

    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProducts(category);
        if (isSubscribed) {
          const productsArray = Array.isArray(data) ? data : [];
          setAllProducts(productsArray);
          setFilteredProducts(productsArray);
          // Reportar el contador inicial de productos
          if (onProductCountChange) {
            onProductCountChange(productsArray.length);
          }
        }
      } catch (err) {
        if (isSubscribed) {
          setError(err.message || 'Error al cargar los productos');
          setAllProducts([]);
          setFilteredProducts([]);
          // Resetear contador en caso de error
          if (onProductCountChange) {
            onProductCountChange(0);
          }
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isSubscribed = false;
    };
  }, [category]);

  const applyFilters = (filters) => {
    let result = [...allProducts];

    // Filtrar por colores
    if (filters.selectedColors.length > 0) {
      result = result.filter(product =>
        product.colores &&
        product.colores.some(color => filters.selectedColors.includes(color))
      );
    }

    // Filtrar por tags
    if (filters.selectedTags.length > 0) {
      result = result.filter(product => 
        product.tags && 
        product.tags.some(tag => filters.selectedTags.includes(tag))
      );
    }

    // Filtrar por rango de precio
    if (filters.priceRange.min !== '' || filters.priceRange.max !== '') {
      result = result.filter(product => {
        const price = parseFloat(product.price);
        const min = filters.priceRange.min !== '' ? parseFloat(filters.priceRange.min) : 0;
        const max = filters.priceRange.max !== '' ? parseFloat(filters.priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Ordenar productos
    switch (filters.sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'newest':
        // Por defecto, mantener el orden original (más nuevos primero)
        break;
      case 'popular':
        // Ordenar por stock descendente como proxy de popularidad
        result.sort((a, b) => parseFloat(b.stock) - parseFloat(a.stock));
        break;
      default:
        break;
    }

    setFilteredProducts(result);

    // Reportar el contador de productos al componente padre
    if (onProductCountChange) {
      onProductCountChange(result.length);
    }
  };

  const handleFilterChange = (filters) => {
    applyFilters(filters);
  };

  if (loading) {
    return <div className="product-list__feedback">Cargando productos...</div>;
  }

  if (error) {
    return (
      <div className="product-list__feedback product-list__feedback--error" role="alert">
        {error}
      </div>
    );
  }

  if (!allProducts.length) {
    return <div className="product-list__feedback">No hay productos disponibles.</div>;
  }

  return (
    <div className="product-list-container">
      {/* Lista de productos */}
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const key = product.id || product.sku || product.title || product.name;
            const inCart = cart.some(item => item.id === product.id);
            return (
              <Link key={key} to={`/productos/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ProductCard
                  product={product}
                  inCart={inCart}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                />
              </Link>
            );
          })
        ) : (
          <div className="no-products-found">
            <p>No se encontraron productos que coincidan con los filtros seleccionados.</p>
            <button
              className="clear-filters-link"
              onClick={() => applyFilters({
                sortBy: 'name',
                selectedColors: [],
                selectedTags: [],
                priceRange: { min: '', max: '' }
              })}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Sidebar de filtros */}
      <FilterSidebar
        isOpen={filterOpen}
        onClose={onFilterClose}
        products={allProducts}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}

export default ProductList