import "../css/RegistrationForm.css";

// declaring the registration page component
const RegistrationForm = ({ isRegistrationClosed = 0 }: any) => {
  // rendering the registration page
  return (
    <div className="registration-page">
      <h1>JESA'23 Registration</h1>
      <div className="reg-page-description">
        <img src="./images/jesa23-logo.png" alt="JESA'23 Logo" />
        <div>
          <p>
            Challenges that we don't accept become our limits So don't let your
            nervousness limit you
          </p>
          <p>
            The most elegant award ceremony ever organized Is awaiting your
            arrival !
          </p>
        </div>
      </div>
      <h3>
        {/* show correctly with registration closed */}
        Registrations{isRegistrationClosed === 0 ? " will be " : " were "}closed
        on <span>30th of July</span>
      </h3>
      <div className="reg-page-form-links">
        <div className="reg-link-section">
          <h2>USJ Undergrads</h2>
          <p className="reg-link-text">Compete againt all the JESA awards</p>
          {/* display buttons according to the date */}
          {isRegistrationClosed === 0 ? (
            <a
              href="https://forms.gle/HkYRdbzjn1dE3TLr5"
              target="_blank"
              className="jesa-reg-btn"
            >
              REGISTER HERE
            </a>
          ) : (
            <a className="jesa-reg-btn disable-btn">CLOSED</a>
          )}
        </div>
        <div className="reg-link-section">
          <h2>Other Undergrads</h2>
          <p className="reg-link-text">
            Compete againts the Best Innovator award
          </p>
          {/* display buttons according to the date */}
          {isRegistrationClosed === 0 ? (
            <a
              href="https://forms.gle/zdZtUWgzCv7mHRnF7"
              target="_blank"
              className="jesa-reg-btn"
            >
              REGISTER HERE
            </a>
          ) : (
            <a className="jesa-reg-btn disable-btn">CLOSED</a>
          )}
          {/* <p className="extended-reg">Extended till 15th of August</p> */}
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
