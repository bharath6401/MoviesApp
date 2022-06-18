import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'

const Footer = () => (
  <footer className="footer d-flex flex-column align-items-center">
    <div className="m-2 col-12 d-flex flex-row justify-content-center align-items-center">
      <div>
        <FaGoogle />
      </div>
      <div className="ml-2">
        <FaTwitter />
      </div>
      <div className="ml-2">
        <FaInstagram />
      </div>
      <div className="ml-2">
        <FaYoutube />
      </div>
    </div>
    <div>
      <p>Contact Us</p>
    </div>
  </footer>
)
export default Footer
