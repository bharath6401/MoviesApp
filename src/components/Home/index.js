import React, {Component} from 'react'
import Slider from 'react-slick'
import {Link} from 'react-router-dom'
import {BiError} from 'react-icons/bi'

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

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    RandomMovieOfOriginals: [],
    ApiPosterStatus: apiStatusConstants.initial,
    ApiTrendingNowStatus: apiStatusConstants.initial,
    trndingMoviesList: [],
  }

  componentDidMount() {
    this.callTrendingApi()
    this.callHomeApi()
  }

  callTrendingApi = async () => {
    this.setState({
      ApiTrendingNowStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)
    const apiUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
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

  TrendingNowSucessView = () => {
    const {trndingMoviesList} = this.state
  }

  callHomeApi = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
      ApiPosterStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    console.log(jwtToken)

    const apiUrl = 'https://apis.ccbp.in/movies-app/originals'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const {results} = await fetchedData
      const randomNum = Math.floor(Math.random(0, 1) * 10)

      console.log(fetchedData, randomNum)
      const randomMovieOfOriginals = results[randomNum]
      const camelRandomMovieOfOriginals = {
        backdropPath: randomMovieOfOriginals.backdrop_path,
        id: randomMovieOfOriginals.id,
        overview: randomMovieOfOriginals.overview,
        posterPath: randomMovieOfOriginals.poster_path,
        title: randomMovieOfOriginals.title,
      }
      const CamelOriginalMoviesList = results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        id: eachMovie.id,
        overview: eachMovie.overview,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      this.setState({
        RandomMovieOfOriginals: {...camelRandomMovieOfOriginals},
        ApiPosterStatus: apiStatusConstants.success,
        originalMoviesList: [...CamelOriginalMoviesList],
      })
    } else {
      this.setState({ApiPosterStatus: apiStatusConstants.failure})
    }
  }

  //   HomePageSucessView = () => {

  //   }

  getPosterViews = () => {
    const {ApiPosterStatus} = this.state
    console.log(ApiPosterStatus)
    switch (ApiPosterStatus) {
      case apiStatusConstants.success:
        return this.PosterSucessView()
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
      <div>
        <BiError />
        <p>Something went wrong. Please try again</p>
        <button className="try-again">Try Again</button>
      </div>
    )
  }

  PosterSucessView = () => {
    const {RandomMovieOfOriginals} = this.state
    const {
      backdropPath,
      id,
      overview,
      posterPath,
      title,
    } = RandomMovieOfOriginals

    return (
      <div className="">
        <div
          style={{
            backgroundSize: 'cover',
            top: '0px',
            backgroundImage: `url("${backdropPath}")`,
          }}
          className="col-12 banner"
        >
          {/* <img className="col-12" src={`${backdropPath}`} /> */}
          <h1 className="banner-title ml-2">{title}</h1>
          <p className="banner-description ml-2">
            {this.truncateString(overview, 100)}
          </p>
          <button className="play-button ml-2">Play</button>
        </div>
        {/* <div className="title-overview col-12">
          
        </div> */}
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

  getTrendingNowViews = () => {
    const {ApiTrendingNowStatus, trndingMoviesList} = this.state
    console.log(ApiTrendingNowStatus)
    switch (ApiTrendingNowStatus) {
      case apiStatusConstants.success:
        return this.PosterSlickSucessView(trndingMoviesList)
      case apiStatusConstants.failure:
        return this.PosterFailureView()
      case apiStatusConstants.inProgress:
        return this.HomePageLoadingView()
      default:
        return null
    }
  }

  getPosterSlick = () => {
    const {ApiPosterStatus, originalMoviesList} = this.state
    console.log(ApiPosterStatus)
    switch (ApiPosterStatus) {
      case apiStatusConstants.success:
        return this.PosterSlickSucessView(originalMoviesList)
      case apiStatusConstants.failure:
        return this.PosterFailureView()
      case apiStatusConstants.inProgress:
        return this.HomePageLoadingView()
      default:
        return null
    }
  }

  PosterSlickSucessView = movies => {
    // const {originalMoviesList} = movies
    const settings = {
      slidesToShow: 4,
      slidesToScroll: 1,
      dots: true,
    }
    return (
      <div className="movie-item-container">
        <Slider {...settings}>
          {movies.map(eachMovie => (
            <Link to={`/movies/${eachMovie.id}`}>
              <div id={eachMovie.id} className="ml-1 p-1">
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

  render() {
    const {apiStatus} = this.state
    console.log(apiStatus)
    return (
      <div className="bg-color-black">
        <Header />
        <div className="bg-color-black">{this.getPosterViews()}</div>

        <div className="trendingNow bg-color-black">
          <h1 className="trnding-now-title ml-2">Trending Now</h1>
          <div className="bg-color-black">{this.getTrendingNowViews()}</div>
        </div>
        <div className="bg-color-black">
          <h1 className="trnding-now-title ml-2">Originals</h1>
          {this.getPosterSlick()}
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
