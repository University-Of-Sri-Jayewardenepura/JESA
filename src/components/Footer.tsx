import "../css/Footer.css";

// declaring the footer component
const Footer = () => {
  return (
    <>
      <div className="footer">
        <img
          src="/images/footer-image-white.png"
          alt="footer logo"
          className="footer-image"
        />
        {/* Displaying contact details */}
        <div className="contact-us">
          <h3>Contact Us</h3>
          <div className="contacts">
            <p>
              <p>For More Details</p>
              <a
                href="https://www.linkedin.com/in/naveen-hewage/"
                target="_blank"
              >
                <i className="fa fa-linkedin"></i> : Naveen T Hewage
              </a>{" "}
              : 071 176 6662
              <br />
              <a
                href="https://www.linkedin.com/in/induwara-gamage/"
                target="_blank"
              >
                <i className="fa fa-linkedin"></i> : Induwara Gamage
              </a>{" "}
              : 071 893 8256
            </p>
          </div>
          <div className="footer-links">
            <a href="http://careerskills.sjp.ac.lk/" target="_blank">
              <i className="fa fa-globe"></i>
            </a>
            <a href="https://facebook.com/jesa2022" target="_blank">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="https://www.instagram.com/jesa_2023/" target="_blank">
              <i className="fa fa-instagram"></i>
            </a>
            <a
              href="https://www.linkedin.com/showcase/j-pura-employability-skills-awards/"
              target="_blank"
            >
              <i className="fa fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
      {/* declaring the copyright section */}
      <h4 className="copyright">
        {/* Footer links section */}
        <h3>&#169; 2023 Career Skills Development Society</h3>
        {/* Author section */}
        Developed by{" "}
        <a
          href="https://www.linkedin.com/in/vinura-gallage/"
          target="_blank"
          className="copyright-links"
        >
          Vinura Gallage
        </a>{" "}
        in <span className="copyright-heart">&#10084;</span> with React |
        Open-sourced @
        <a
          href="https://github.com/th3-s7r4ng3r/JESA-2023-App"
          target="_blank"
          className="copyright-links"
        >
          GitHub
        </a>
      </h4>
    </>
  );
};

export default Footer;
