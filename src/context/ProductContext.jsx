import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchCategories } from '../services/api';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts debe ser usado dentro de un ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de filtros
  const [filters, setFilters] = useState({
    category: '',
    searchTerm: '',
    minPrice: 0,
    maxPrice: Infinity,
    sortBy: 'name', // name, price-asc, price-desc
    selectedColors: [],
    selectedTags: []
  });

  // Cargar productos y categorías al montar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      setFilteredProducts(productsData);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros cuando cambian los productos o los filtros
  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const applyFilters = useCallback(() => {
    let result = [...products];

    // Filtrar por categoría
    if (filters.category && filters.category !== '') {
      result = result.filter(product => 
        product.category?.name?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filtrar por colores
    if (filters.selectedColors && filters.selectedColors.length > 0) {
      result = result.filter(product =>
        product.colores &&
        product.colores.some(color => filters.selectedColors.includes(color))
      );
    }

    // Filtrar por tags
    if (filters.selectedTags && filters.selectedTags.length > 0) {
      result = result.filter(product => 
        product.tags && 
        product.tags.some(tag => filters.selectedTags.includes(tag))
      );
    }

    // Filtrar por búsqueda
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filtrar por rango de precio
    result = result.filter(product => {
      const price = product.price || 0;
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    // Ordenar
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
      default:
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
    }

    setFilteredProducts(result);
  }, [products, filters]);

  // Funciones para actualizar filtros (con useCallback)
  const setCategory = useCallback((category) => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  const setSearchTerm = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, searchTerm }));
  }, []);

  const setPriceRange = useCallback((minPrice, maxPrice) => {
    setFilters(prev => ({ ...prev, minPrice, maxPrice }));
  }, []);

  const setSortBy = useCallback((sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, []);

  const setSelectedColors = useCallback((selectedColors) => {
    setFilters(prev => ({ ...prev, selectedColors }));
  }, []);

  const setSelectedTags = useCallback((selectedTags) => {
    setFilters(prev => ({ ...prev, selectedTags }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: '',
      searchTerm: '',
      minPrice: 0,
      maxPrice: Infinity,
      sortBy: 'name',
      selectedColors: [],
      selectedTags: []
    });
  }, []);

  // Función para obtener un producto por ID
  const getProductById = useCallback((id) => {
    return products.find(product => product.id === id);
  }, [products]);

  // Función para refrescar productos
  const refreshProducts = useCallback(async () => {
    await loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    // Datos
    products,
    categories,
    filteredProducts,
    loading,
    error,
    
    // Filtros actuales
    filters,
    
    // Funciones de filtrado
    setCategory,
    setSearchTerm,
    setPriceRange,
    setSortBy,
    setSelectedColors,
    setSelectedTags,
    clearFilters,
    
    // Utilidades
    getProductById,
    refreshProducts
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
