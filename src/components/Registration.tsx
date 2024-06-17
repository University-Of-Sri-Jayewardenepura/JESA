import "../css/Registration.css";
import { Link } from "react-router-dom";

// declaring registration component
const Registration = ({ getToTop, isRegistrationClosed = 1 }: any) => {
  // rendering registration component
  return (
    <div className="registration">
      <div className="registration-text">
        <p>
          Are you looking forward to being honoured for your accomplishments?
          <br />
          This is your moment to make history!{" "}
        </p>
        <p>
          <b>
            The most elegant award ceremony ever organized is awaiting your
            arrival!
          </b>
        </p>
      </div>
      {/* Only display registration page */}
      <div className="registration-links">
        {/* Display each button if the registration date is closed */}
        {isRegistrationClosed === 0 ? (
          <Link
            to="/registration"
            className="registration-btn"
            onClick={() => getToTop()}
          >
            REGISTER NOW
          </Link>
        ) : (
          // <button className="registration-btn reg-closed">
          //   Registration Closed
          // </button>

          // Check registration event
          <Link
            to="/registration"
            className="registration-btn"
            onClick={() => getToTop()}
          >
            Check Registration
          </Link>
        )}
        <h4>
          JESA'23 Registrations
          {isRegistrationClosed === 0 ? " will be " : " were "}
          closed on 30th of July
        </h4>
      </div>
    </div>
  );
};

export default Registration;
