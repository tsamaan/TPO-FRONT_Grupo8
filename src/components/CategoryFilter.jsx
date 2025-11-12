import './CategoryFilter.css'

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { value: '', label: 'Todas las categorias' },
    { value: 'electronics', label: 'Electronicos' },
    { value: 'clothing', label: 'Ropa' },
    { value: 'books', label: 'Libros' }
  ]

  return (
    <div className="category-filter">
      <label htmlFor="category-select">Filtrar por categoria:</label>
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