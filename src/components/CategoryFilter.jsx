import './CategoryFilter.css'

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'electronics', label: 'Electrónicos' },
    { value: 'clothing', label: 'Ropa' },
    { value: 'books', label: 'Libros' }
  ]

  return (
    <div className="category-filter">
      <label htmlFor="category-select">Filtrar por categoría:</label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="category-select"
      >
        {categories.map(category => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CategoryFilter