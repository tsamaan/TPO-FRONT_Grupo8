import { useState, useEffect } from 'react';
import { createProduct } from '../services/api';
import './AddProductForm.css';

const AddProductForm = ({ onProductAdded }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    images: [],
    stock: 0,
    price: 0,
    category: '',
    tags: [],
    colores: []
  });

  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [currentColor, setCurrentColor] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const validate = () => {
      const newErrors = {};
      if (!product.name) newErrors.name = 'El nombre es obligatorio.';
      if (!product.description) newErrors.description = 'La descripción es obligatoria.';
      if (product.stock < 0) newErrors.stock = 'El stock no puede ser negativo.';
      if (product.price <= 0) newErrors.price = 'El precio debe ser mayor que cero.';
      if (!product.category) newErrors.category = 'La categoría es obligatoria.';
      if (!product.images || product.images.length === 0) newErrors.images = 'Debe agregar al menos una imagen.';
      
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

  const addColor = () => {
    if (currentColor.trim() && !product.colores.includes(currentColor.trim())) {
      setProduct(prevProduct => ({
        ...prevProduct,
        colores: [...prevProduct.colores, currentColor.trim()]
      }));
      setCurrentColor('');
    }
  };

  const removeColor = (index) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      colores: prevProduct.colores.filter((_, i) => i !== index)
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
          stock: 0,
          price: 0,
          category: '',
          tags: [],
          colores: []
        });
        setCurrentImageUrl('');
        setCurrentColor('');
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
        <label htmlFor="stock">Stock</label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={product.stock}
          onChange={handleChange}
        />
        {errors.stock && <p className="error">{errors.stock}</p>}
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
        />
        {errors.price && <p className="error">{errors.price}</p>}
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
          <button type="button" onClick={addColor} disabled={!currentColor.trim() || product.colores.includes(currentColor.trim())}>
            Agregar Color
          </button>
        </div>

        {product.colores.length > 0 && (
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