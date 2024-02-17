import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    selectCategory,
    selectedCategory,
    selectRating,
    clearFilters,
    searchChange,
    showResults,
  } = props

  const onClearFilters = () => {
    clearFilters()
  }

  const onSelectCategory = event => {
    console.log(event.target.id)
    selectCategory(event.target.id)
  }

  const onSelectRating = event => {
    console.log(event.target.alt[7])
    selectRating(event.target.alt[7])
    // Perform any other actions with the rating id as needed
  }

  const onSearchChange = event => {
    searchChange(event.target.value)
  }

  const onSearchKeyDown = event => {
    if (event.key === 'Enter') {
      showResults()
    }
  }

  return (
    <div className="filters-group-container">
      <div className="search-bar-container">
        <input
          type="search"
          className="search-bar"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
        />
      </div>
      <h1 className="category-heading">Category</h1>
      <div className="category-options-list">
        {categoryOptions.map(eachItem => (
          <p
            key={eachItem.categoryId}
            id={eachItem.categoryId}
            className={`category-item ${
              selectedCategory === eachItem.categoryId && 'selected-category'
            }`}
            onClick={onSelectCategory}
          >
            {eachItem.name}
          </p>
        ))}
      </div>
      <h1 className="rating-heading">Rating</h1>
      <div className="ratings-list">
        {ratingsList.map(eachItem => (
          <div id={eachItem.ratingId} className="rating-item">
            <img
              alt={`rating ${eachItem.ratingId}`}
              src={eachItem.imageUrl}
              className="rating-img"
              onClick={onSelectRating}
            />
            <p className="rating-text"> & rating</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="clear-filters-button"
        onClick={onClearFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
