import Cookies from 'js-cookie'
import {withRouter} from 'react-router-dom'
import Loader from 'react-loader-spinner'

import Footer from '../Footer'
import Header from '../Header'
import './index.css'

const Account = props => {
  const num = 0

  const logout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  const username = Cookies.get('username')

  return (
    <div className="Account-background-color">
      <Header />
      <div className="account-details-container">
        <h1>Account</h1>
        <hr />
        <div className="d-flex flex-row">
          <p className="account-membership">Member ship</p>
          <div className="d-flex flex-column ml-1">
            <p className="">{username}@gmail.com</p>
            <div className="d-flex flex-row">
              <p>Password</p>
              <p>********</p>
            </div>
          </div>
        </div>
        <hr />
        <div className="d-flex flex-row">
          <p className="account-membership">Plan details</p>
          <div className="d-flex flex-row ml-1">
            <p>Premium</p>
            <p>Ultra HD</p>
          </div>
        </div>
        <hr />
        <button onClick={logout}>Logout</button>
      </div>
      <Footer />
    </div>
  )
}
export default withRouter(Account)
