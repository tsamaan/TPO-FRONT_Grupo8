import { useState, useEffect } from 'react';
import { updateProduct } from '../services/api';
import './EditProductForm.css';

const EditProductForm = ({ product: productToEdit, onProductUpdated, onCancel }) => {
  const [product, setProduct] = useState(productToEdit);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [currentColor, setCurrentColor] = useState('');

  useEffect(() => {
    // Asegurar que el producto tenga los campos images y colores como arrays
    const updatedProduct = {
      ...productToEdit,
      images: productToEdit.images || (productToEdit.image ? [productToEdit.image] : []),
      colores: productToEdit.colores || []
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

  const addColor = () => {
    if (currentColor.trim() && !(product.colores || []).includes(currentColor.trim())) {
      setProduct(prevProduct => ({
        ...prevProduct,
        colores: [...(prevProduct.colores || []), currentColor.trim()]
      }));
      setCurrentColor('');
    }
  };

  const removeColor = (index) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      colores: (prevProduct.colores || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(product.id, product);
      alert('Producto actualizado con éxito');
      onProductUpdated();
    } catch (error) {
      alert('Error al actualizar el producto');
      console.error(error);
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
        <label htmlFor="stock">Stock</label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Precio</label>
        <input
          type="number"
          id="price"
          name="price"
          value={product.price}
          onChange={handleChange}
          step="0.01"
          required
        />
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

      <div className="form-group">
        <label htmlFor="colores">Colores Disponibles</label>
        <div className="color-input-group">
          <input
            type="text"
            id="current-color"
            placeholder="Nombre del color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
          />
          <button type="button" onClick={addColor} disabled={!currentColor.trim() || (product.colores || []).includes(currentColor.trim())}>
            Agregar Color
          </button>
        </div>

        {product.colores && product.colores.length > 0 && (
          <div className="colors-preview">
            {product.colores.map((color, index) => (
              <div key={index} className="color-item">
                <span className="color-name">{color}</span>
                <button type="button" onClick={() => removeColor(index)} className="color-remove">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit">Guardar Cambios</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
};

export default EditProductForm;