import { useState, useEffect } from 'react';
import { createProduct } from '../services/api';
import './AddProductForm.css';

const AddProductForm = ({ onProductAdded }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    images: [],
    price: 0,
    category: '',
    tags: [],
    variants: [] // Array de variantes con color, stock, SKU, etc.
  });

  const [currentImageUrl, setCurrentImageUrl] = useState('');
  
  // Estado para la variante actual que se está agregando
  const [currentVariant, setCurrentVariant] = useState({
    color: '',
    size: '',
    stock: 0,
    sku: '',
    imageUrl: '',
    priceModifier: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const validate = () => {
      const newErrors = {};
      if (!product.name) newErrors.name = 'El nombre es obligatorio.';
      if (!product.description) newErrors.description = 'La descripción es obligatoria.';
      if (product.price <= 0) newErrors.price = 'El precio debe ser mayor que cero.';
      if (!product.category) newErrors.category = 'La categoría es obligatoria.';
      if (!product.images || product.images.length === 0) newErrors.images = 'Debe agregar al menos una imagen.';
      if (!product.variants || product.variants.length === 0) newErrors.variants = 'Debe agregar al menos una variante (color/stock).';
      
      setErrors(newErrors);
    };

    validate();
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: name === 'tags' ? value.split(',').map(tag => tag.trim()) : value
    }));
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setCurrentVariant(prev => ({
      ...prev,
      [name]: ['stock', 'priceModifier'].includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const addVariant = () => {
    if (currentVariant.color.trim() && currentVariant.stock >= 0) {
      // Generar SKU automático si no se proporciona
      const sku = currentVariant.sku.trim() || 
                  `${product.name.substring(0, 3).toUpperCase()}-${currentVariant.color.toUpperCase()}-${Date.now()}`;
      
      setProduct(prevProduct => ({
        ...prevProduct,
        variants: [...prevProduct.variants, { ...currentVariant, sku, available: true }]
      }));
      
      // Limpiar formulario de variante
      setCurrentVariant({
        color: '',
        size: '',
        stock: 0,
        sku: '',
        imageUrl: '',
        priceModifier: 0
      });
    }
  };

  const removeVariant = (index) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      variants: prevProduct.variants.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    if (currentImageUrl.trim()) {
      setProduct(prevProduct => ({
        ...prevProduct,
        images: [...prevProduct.images, currentImageUrl.trim()]
      }));
      setCurrentImageUrl('');
    }
  };

  const removeImage = (index) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      images: prevProduct.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      try {
        await createProduct(product);
        alert('Producto creado con éxito');
        if(onProductAdded) onProductAdded();
        setProduct({
          name: '',
          description: '',
          images: [],
          price: 0,
          category: '',
          tags: [],
          variants: []
        });
        setCurrentImageUrl('');
        setCurrentVariant({
          color: '',
          size: '',
          stock: 0,
          sku: '',
          imageUrl: '',
          priceModifier: 0
        });
      } catch (error) {
        alert('Error al crear el producto');
        console.error(error);
      }
    } else {
      alert('Por favor, corrija los errores en el formulario.');
    }
  };
  
  const getButtonTitle = () => {
    if (Object.keys(errors).length === 0) {
      return '';
    }
    return Object.values(errors).join('\n');
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>Alta de Producto</h2>

      <div className="form-group">
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
        />
        {errors.description && <p className="error">{errors.description}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="images">Imágenes (URLs)</label>
        <div className="image-url-group">
          <input
            type="text"
            id="current-image"
            placeholder="URL de la imagen"
            value={currentImageUrl}
            onChange={(e) => setCurrentImageUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
          />
          <button type="button" onClick={addImage} disabled={!currentImageUrl.trim()}>
            Agregar
          </button>
        </div>
        {errors.images && <p className="error">{errors.images}</p>}

        {product.images.length > 0 && (
          <div className="image-preview">
            {product.images.map((imageUrl, index) => (
              <div key={index} className="image-item">
                <img src={imageUrl} alt={`Imagen ${index + 1}`} />
                <button type="button" onClick={() => removeImage(index)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="price">Precio Base</label>
        <input
          type="number"
          id="price"
          name="price"
          value={product.price}
          onChange={handleChange}
          step="0.01"
        />
        {errors.price && <p className="error">{errors.price}</p>}
        <small className="form-hint">El precio final puede variar según la variante (color/talla)</small>
      </div>

      <div className="form-group">
        <label htmlFor="category">Categoría</label>
        <input
          type="text"
          id="category"
          name="category"
          value={product.category}
          onChange={handleChange}
        />
        {errors.category && <p className="error">{errors.category}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags (separados por comas)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={Array.isArray(product.tags) ? product.tags.join(', ') : ''}
          onChange={handleChange}
        />
      </div>

      {/* NUEVA SECCIÓN: VARIANTES */}
      <div className="form-group variants-section">
        <h3>Variantes del Producto</h3>
        <p className="form-hint">Agrega diferentes combinaciones de color y stock para este producto</p>
        
        <div className="variant-input-group">
          <div className="variant-row">
            <div className="variant-field">
              <label htmlFor="variant-color">Color *</label>
              <input
                type="text"
                id="variant-color"
                name="color"
                placeholder="Ej: Rojo, Azul, Negro"
                value={currentVariant.color}
                onChange={handleVariantChange}
              />
            </div>
            
            <div className="variant-field">
              <label htmlFor="variant-size">Talla (opcional)</label>
              <input
                type="text"
                id="variant-size"
                name="size"
                placeholder="Ej: S, M, L, XL"
                value={currentVariant.size}
                onChange={handleVariantChange}
              />
            </div>
            
            <div className="variant-field">
              <label htmlFor="variant-stock">Stock *</label>
              <input
                type="number"
                id="variant-stock"
                name="stock"
                placeholder="0"
                value={currentVariant.stock}
                onChange={handleVariantChange}
                min="0"
              />
            </div>
          </div>
          
          <div className="variant-row">
            <div className="variant-field">
              <label htmlFor="variant-sku">SKU (opcional)</label>
              <input
                type="text"
                id="variant-sku"
                name="sku"
                placeholder="Se genera automáticamente"
                value={currentVariant.sku}
                onChange={handleVariantChange}
              />
            </div>
            
            <div className="variant-field">
              <label htmlFor="variant-price-modifier">Modificador de Precio</label>
              <input
                type="number"
                id="variant-price-modifier"
                name="priceModifier"
                placeholder="0.00"
                value={currentVariant.priceModifier}
                onChange={handleVariantChange}
                step="0.01"
              />
              <small>Ej: +50 o -20</small>
            </div>
            
            <div className="variant-field">
              <label htmlFor="variant-image-url">Imagen específica</label>
              <input
                type="text"
                id="variant-image-url"
                name="imageUrl"
                placeholder="URL de imagen para esta variante"
                value={currentVariant.imageUrl}
                onChange={handleVariantChange}
              />
            </div>
          </div>
          
          <button 
            type="button" 
            onClick={addVariant} 
            className="btn-add-variant"
            disabled={!currentVariant.color.trim() || currentVariant.stock < 0}
          >
            + Agregar Variante
          </button>
        </div>

        {errors.variants && <p className="error">{errors.variants}</p>}

        {product.variants.length > 0 && (
          <div className="variants-list">
            <h4>Variantes agregadas: ({product.variants.length})</h4>
            <table className="variants-table">
              <thead>
                <tr>
                  <th>Color</th>
                  <th>Talla</th>
                  <th>Stock</th>
                  <th>SKU</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((variant, index) => (
                  <tr key={index}>
                    <td>
                      <span className="color-badge" style={{backgroundColor: variant.color.toLowerCase()}}>
                        {variant.color}
                      </span>
                    </td>
                    <td>{variant.size || '-'}</td>
                    <td>{variant.stock}</td>
                    <td><code>{variant.sku}</code></td>
                    <td>
                      ${(product.price + (variant.priceModifier || 0)).toFixed(2)}
                      {variant.priceModifier !== 0 && (
                        <small className={variant.priceModifier > 0 ? 'price-increase' : 'price-decrease'}>
                          ({variant.priceModifier > 0 ? '+' : ''}{variant.priceModifier})
                        </small>
                      )}
                    </td>
                    <td>
                      <button 
                        type="button" 
                        onClick={() => removeVariant(index)} 
                        className="btn-remove-variant"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="variants-summary">
              <strong>Stock Total:</strong> {product.variants.reduce((sum, v) => sum + v.stock, 0)} unidades
            </div>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          disabled={Object.keys(errors).length > 0}
          title={getButtonTitle()}
        >
          Crear Producto
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;