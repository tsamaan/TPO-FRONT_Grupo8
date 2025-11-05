import { useState, useEffect } from 'react';
import { updateProduct } from '../services/api';
import './AddProductForm.css'; // Usando estilos compartidos

const EditProductForm = ({ product: productToEdit, onProductUpdated, onCancel }) => {
  const [product, setProduct] = useState(productToEdit);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  
  // Estado para la variante actual que se está agregando/editando
  const [currentVariant, setCurrentVariant] = useState({
    color: '',
    size: '',
    stock: 0,
    sku: '',
    imageUrl: '',
    priceModifier: 0
  });

  useEffect(() => {
    // Asegurar que el producto tenga los campos necesarios
    const updatedProduct = {
      ...productToEdit,
      images: productToEdit.images || (productToEdit.image ? [productToEdit.image] : []),
      variants: productToEdit.variants || []
    };
    setProduct(updatedProduct);
  }, [productToEdit]);

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
        variants: [...(prevProduct.variants || []), { ...currentVariant, sku, available: true }]
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
      variants: (prevProduct.variants || []).filter((_, i) => i !== index)
    }));
  };

  // Nueva función para actualizar una variante existente
  const updateVariant = (index, field, value) => {
    setProduct(prevProduct => {
      const updatedVariants = [...(prevProduct.variants || [])];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: ['stock', 'priceModifier'].includes(field) ? parseFloat(value) || 0 : value
      };
      return {
        ...prevProduct,
        variants: updatedVariants
      };
    });
  };

  const addImage = () => {
    if (currentImageUrl.trim()) {
      setProduct(prevProduct => ({
        ...prevProduct,
        images: [...(prevProduct.images || []), currentImageUrl.trim()]
      }));
      setCurrentImageUrl('');
    }
  };

  const removeImage = (index) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      images: (prevProduct.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Debug: Verificar el ID y los datos del producto
    console.log('📦 Actualizando producto:', {
      id: product.id,
      name: product.name,
      variantsCount: product.variants?.length || 0,
      variants: product.variants
    });
    
    try {
      await updateProduct(product.id, product);
      alert('Producto actualizado con éxito');
      onProductUpdated();
    } catch (error) {
      alert(`Error al actualizar el producto: ${error.message}`);
      console.error('❌ Error completo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>Editar Producto</h2>
      
      <div className="form-group">
        <label htmlFor="id">ID del Producto</label>
        <input
          type="text"
          id="id"
          name="id"
          value={product.id}
          disabled
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          required
        />
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

        {product.images && product.images.length > 0 && (
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
          required
        />
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
          required
        />
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

      {/* SECCIÓN: VARIANTES */}
      <div className="form-group variants-section">
        <h3>Variantes del Producto</h3>
        <p className="form-hint">Gestiona las combinaciones de color y stock para este producto</p>
        
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

        {product.variants && product.variants.length > 0 && (
          <div className="variants-list">
            <h4>Variantes actuales: ({product.variants.length})</h4>
            <table className="variants-table">
              <thead>
                <tr>
                  <th>Color</th>
                  <th>Talla</th>
                  <th>Stock</th>
                  <th>SKU</th>
                  <th>Precio Base + Modificador</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((variant, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={variant.color}
                        onChange={(e) => updateVariant(index, 'color', e.target.value)}
                        className="inline-edit"
                        style={{
                          backgroundColor: variant.color.toLowerCase(),
                          color: '#fff',
                          fontWeight: 'bold',
                          padding: '4px 8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={variant.size || ''}
                        onChange={(e) => updateVariant(index, 'size', e.target.value)}
                        placeholder="-"
                        className="inline-edit"
                        style={{ width: '60px', textAlign: 'center' }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                        min="0"
                        className="inline-edit stock-input"
                        style={{ 
                          width: '70px', 
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: '1rem'
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={variant.sku}
                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                        className="inline-edit"
                        style={{ width: '120px', fontFamily: 'monospace', fontSize: '0.9rem' }}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>${product.price.toFixed(2)}</span>
                        <input
                          type="number"
                          value={variant.priceModifier || 0}
                          onChange={(e) => updateVariant(index, 'priceModifier', e.target.value)}
                          step="0.01"
                          className="inline-edit"
                          style={{ width: '70px' }}
                          placeholder="0"
                        />
                        <span style={{ fontWeight: 'bold' }}>
                          = ${(product.price + (variant.priceModifier || 0)).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button 
                        type="button" 
                        onClick={() => removeVariant(index)} 
                        className="btn-remove-variant"
                        title="Eliminar variante"
                      >
                        🗑️
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
        <button type="button" onClick={onCancel} style={{background: '#6c757d'}}>
          Cancelar
        </button>
        <button type="submit">
          Actualizar Producto
        </button>
      </div>
    </form>
  );
};

export default EditProductForm;