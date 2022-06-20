import React, {Component} from 'react'
import Slider from 'react-slick'
import {Link} from 'react-router-dom'
import {BiError} from 'react-icons/bi'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Trending extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    ApiTrendingNowStatus: apiStatusConstants.initial,
    trndingMoviesList: [],
  }

  componentDidMount() {
    this.callTrendingApi()
  }

  callTrendingApi = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    this.setState({
      ApiTrendingNowStatus: apiStatusConstants.inProgress,
    })

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      //   console.log(fetchedData, 'trending movies')
      const {results} = fetchedData

      const CamelCaseTrendingMovies = results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        id: eachMovie.id,
        overview: eachMovie.overview,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      this.setState({
        ApiTrendingNowStatus: apiStatusConstants.success,
        trndingMoviesList: [...CamelCaseTrendingMovies],
      })
    } else {
      this.setState({ApiTrendingNowStatus: apiStatusConstants.failure})
    }
  }

  TrendingFailureView = () => {
    const {ApiPosterStatus} = this.state
    return (
      <div className=" p-4 d-flex flex-column align-items-center justify-content-center col-12">
        <BiError />
        <p>Something went wrong. Please try again</p>
        <button onClick={this.callApi} className="try-again">
          Try Again
        </button>
      </div>
    )
  }

  PosterSlickSucessView = movies => {
    // const {originalMoviesList} = movies
    const settings = {
      slidesToShow: 4,
      slidesToScroll: 1,
      dots: true,
    }
    return (
      <div className="movie-item-container" testid="trending">
        <Slider {...settings}>
          {movies.map(eachMovie => (
            <Link key={eachMovie.title} to={`/movies/${eachMovie.id}`}>
              <div  id={eachMovie.id} className="ml-1 p-1">
                <img
                  alt={eachMovie.title}
                  className="col-12"
                  src={eachMovie.posterPath}
                />
              </div>
            </Link>
          ))}
        </Slider>
      </div>
    )
  }

  trendingLoadingView = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  getTrendingNowViews = () => {
    const {ApiTrendingNowStatus, trndingMoviesList} = this.state
    console.log(ApiTrendingNowStatus)
    switch (ApiTrendingNowStatus) {
      case apiStatusConstants.success:
        return this.PosterSlickSucessView(trndingMoviesList)
      case apiStatusConstants.failure:
        return this.TrendingFailureView()
      case apiStatusConstants.inProgress:
        return this.trendingLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div className="bg-color-black">{this.getTrendingNowViews()}</div>
  }
}

export default Trending
