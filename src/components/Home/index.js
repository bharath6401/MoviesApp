import React, {Component} from 'react'
import Slider from 'react-slick'
import {Link} from 'react-router-dom'
import {BiError} from 'react-icons/bi'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import Footer from '../Footer'
import Header from '../Header'
import Trending from '../Trending'
import Originals from '../Originals'
import TopRated from '../TopRated'

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

    trndingMoviesList: [],
  }

  componentDidMount() {
    this.callHomeApi()
  }

  callHomeApi = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
      ApiPosterStatus: apiStatusConstants.inProgress,
      originalMoviesList: [],
    })
    const jwtToken = Cookies.get('jwt_token')
    // console.log(jwtToken)

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

      const CamelOriginalMoviesList = await results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        id: eachMovie.id,
        overview: eachMovie.overview,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      await this.setState({
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
      <div className=" p-4 d-flex flex-column align-items-center justify-content-center col-12">
        <BiError />
        <p>Something went wrong. Please try again</p>
        <button onClick={this.callHomeApi} className="try-again">
          Try Again
        </button>
      </div>
    )
  }

  PosterSucessView = () => {
    const {originalMoviesList} = this.state
    const randomNum = Math.floor(Math.random(0, 1) * 10)

    //   console.log(fetchedData, randomNum)
    const randomMovieOfOriginals = originalMoviesList[randomNum]
    const camelRandomMovieOfOriginals = {
      backdropPath: randomMovieOfOriginals.backdrop_path,
      id: randomMovieOfOriginals.id,
      overview: randomMovieOfOriginals.overview,
      posterPath: randomMovieOfOriginals.poster_path,
      title: randomMovieOfOriginals.title,
    }
    const {
      backdropPath,
      id,
      overview,
      posterPath,
      title,
    } = camelRandomMovieOfOriginals

    return (
      <div className="home-container">
        <div
          style={{
            backgroundSize: 'cover',
            top: '0px',
            backgroundImage: `url("${backdropPath}")`,
          }}
          className="col-12 banner"
        >
          <Header />
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

  render() {
    const {apiStatus} = this.state
    console.log(apiStatus)
    return (
      <>
        <div className="bg-color-black" testid="home">
          {this.getPosterViews()}
          <h1 className="trending-heading">Trending Now</h1>
          <Trending />
          <h1 className="trending-heading">Top Rated</h1>
          <TopRated />
          <h1 className="trending-heading">Originals</h1>
          <Originals />
          <Footer />
        </div>
      </>
    )
  }
}

export default Home
