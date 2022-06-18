import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'
import Footer from '../Footer'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Popular extends Component {
  state = {PopularApiStatus: apiStatusConstants.initial, popularMovies: []}

  componentDidMount() {
    this.popularApiCall()
  }

  popularApiCall = async () => {
    this.setState({
      PopularApiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    const apiUrl = 'https://apis.ccbp.in/movies-app/popular-movies'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData, 'trending movies')
      const {results} = await fetchedData
      console.log(results)
      const CamelCaseTrendingMovies = results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        id: eachMovie.id,

        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      this.setState({
        PopularApiStatus: apiStatusConstants.success,
        popularMovies: [...CamelCaseTrendingMovies],
      })
    } else {
      this.setState({PopularApiStatus: apiStatusConstants.failure})
    }
  }

  getPopularViews = () => {
    const {PopularApiStatus} = this.state
    console.log(PopularApiStatus)
    switch (PopularApiStatus) {
      case apiStatusConstants.success:
        return this.PopularSucessView()
      case apiStatusConstants.failure:
        return this.PosterFailureView()
      case apiStatusConstants.inProgress:
        return this.HomePageLoadingView()
      default:
        return null
    }
  }

  PosterFailureView = () => {
    const {ApiPosterStatus} = this.state
    return (
      <div className="col-12 d-flex flex-column align-items-center justify-content-center">
        {/* <BiError /> */}
        <p>Something went wrong. Please try again</p>
        <button onClick={this.popularApiCall} className="try-again">
          Try Again
        </button>
      </div>
    )
  }

  PopularSucessView = () => {
    const {popularMovies} = this.state
    console.log('sucess', popularMovies)
    const num = 0
    return (
      <div className="popular-movies-section">
        <ul className="d-flex flex-row col-12 similar-movies-list-items">
          {popularMovies.map(eachMovie => (
            <li className="col-4 p-1">
              <Link to={`/movies/${eachMovie.id}`}>
                <img
                  className="popular-movie-item col-12"
                  src={eachMovie.backdropPath}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  truncateString = (string = '', maxLength = 50) =>
    string.length > maxLength ? `${string.substring(0, maxLength)}…` : string
  // demo the above function

  HomePageLoadingView = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {PopularApiStatus} = this.state
    console.log(PopularApiStatus)
    return (
      <div className="bg-color-black popular-section">
        <div className="bg-color-black ">
          <Header />
          {this.getPopularViews()}
        </div>
        <Footer />
      </div>
    )
  }
}

export default Popular
