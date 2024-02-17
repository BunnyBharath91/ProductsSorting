import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const fetchingDataStatus = {
  onProcess: 'ON_PROCESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    fetchingStatus: fetchingDataStatus.onProcess,
    activeOptionId: sortbyOptions[0].optionId,
    selectedCategory: '',
    selectedRating: '',
    searchValue: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  searchChange = searchValue => {
    this.setState({
      searchValue,
    })
  }

  showResults = () => {
    this.getProducts()
  }

  selectCategory = categoryName => {
    this.setState(
      {
        selectedCategory: categoryName,
      },
      this.getProducts,
    )
  }

  selectRating = rating => {
    this.setState(
      {
        selectedRating: rating,
      },
      this.getProducts,
    )
  }

  clearFilters = () => {
    this.setState(
      {
        selectedCategory: '',
        selectedRating: '',
        activeOptionId: sortbyOptions[0].optionId,
      },
      this.getProducts,
    )
  }

  getProducts = async () => {
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied
    // https://apis.ccbp.in/products?sort_by=PRICE_HIGH&category=4&title_search=machine&rating=4

    const {
      activeOptionId,
      selectedCategory,
      selectedRating,
      searchValue,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${selectedCategory}&title_search=${searchValue}&rating=${selectedRating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        fetchingStatus: 'SUCCESS',
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    const showNoProducts = () => (
      <div className="no-products-container">
        <img
          alt="no products"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          className="no-products-img"
        />
        <h1 className="no-products-heading">No Products Found</h1>
        <p className="no-products-para">
          We could not find any products. Try other filters.
        </p>
      </div>
    )

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        {productsList.length === 0 ? (
          showNoProducts()
        ) : (
          <ul className="products-list">
            {productsList.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        alt="products failure"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        className="failure-view-img"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-para">
        We are having some trouble while processing your request.
        <br />
        Please try again.
      </p>
    </div>
  )

  // TODO: Add failure view

  render() {
    const {
      fetchingStatus,
      selectedCategory,
      selectedRating,
      searchValue,
    } = this.state
    console.log(selectedRating)
    console.log(searchValue)

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          selectRating={this.selectRating}
          selectCategory={this.selectCategory}
          selectedCategory={selectedCategory}
          clearFilters={this.clearFilters}
          searchChange={this.searchChange}
          showResults={this.showResults}
        />

        {fetchingStatus === 'ON_PROCESS' && this.renderLoader()}
        {fetchingStatus === 'SUCCESS' && this.renderProductsList()}
        {fetchingStatus === 'FAILURE' && this.renderFailureView()}
      </div>
    )
  }
}

export default AllProductsSection
