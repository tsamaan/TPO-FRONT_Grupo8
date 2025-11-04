import { useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import './ProductList.css';

const ProductList = ({ category: propCategory = null, filterOpen = false, onFilterClose, onProductCountChange }) => {
  const params = useParams();
  const category = params.categoria || propCategory;
  
  // Usar el contexto de productos
  const {
    filteredProducts,
    products: allProducts,
    loading,
    error,
    setCategory: setFilterCategory,
    setPriceRange,
    setSortBy,
    setSelectedColors,
    setSelectedTags,
    clearFilters
  } = useProducts();
  
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  // Cuando cambia la categoría de la prop, actualizar el filtro
  useEffect(() => {
    console.log('Cambio de categoría detectado:', category);
    
    // Primero limpiar otros filtros para evitar conflictos
    clearFilters();
    
    // Pequeño delay para asegurar que clearFilters se aplique primero
    setTimeout(() => {
      if (category) {
        setFilterCategory(category);
      } else {
        setFilterCategory('');
      }
    }, 0);
  }, [category, setFilterCategory, clearFilters]); // Ahora las funciones son estables con useCallback

  // Reportar el contador de productos filtrados
  useEffect(() => {
    if (onProductCountChange) {
      onProductCountChange(filteredProducts.length);
    }
  }, [filteredProducts, onProductCountChange]);

  const handleFilterChange = (filters) => {
    // Aplicar colores
    if (filters.selectedColors) {
      setSelectedColors(filters.selectedColors);
    }

    // Aplicar tags
    if (filters.selectedTags) {
      setSelectedTags(filters.selectedTags);
    }

    // Aplicar rango de precio
    if (filters.priceRange) {
      const min = filters.priceRange.min !== '' ? parseFloat(filters.priceRange.min) : 0;
      const max = filters.priceRange.max !== '' ? parseFloat(filters.priceRange.max) : Infinity;
      setPriceRange(min, max);
    }

    // Aplicar ordenamiento
    if (filters.sortBy) {
      setSortBy(filters.sortBy);
    }
  };

  const handleClearFilters = () => {
    clearFilters();
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
              onClick={handleClearFilters}
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