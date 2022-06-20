const NotFound = props => {
  const num = 0
  const goHome = () => {
    const {history} = props
    history.replace('/')
  }

  return (
    <div className="not-found-background">
      <div>
        <img alt="not found" src="" />
        <h1>Lost Your Way ?</h1>
        <p>
          we are sorry the page you requested could not be found Please go back
          to the homepage.
        </p>
        <button onClick={goHome} className="home-button">
          Go To Home
        </button>
      </div>
    </div>
  )
}
export default NotFound
