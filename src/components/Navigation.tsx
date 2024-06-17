import "../css/Navigation.css";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// declaring navigation component
const Navigation = ({ getToTop, isRegistrationClosed = 1 }: any) => {
  //declaring the state variables
  const [regIsVisible, setRegIsVisible] = useState(false);

  // getting the current path location
  const currentLocation = useLocation();
  const currentRegistrationPageStatus =
    currentLocation.pathname === "/registration" ||
    currentLocation.pathname === "/invitation" ||
    currentLocation.pathname === "/attendance";

  //displaying register button when scroll down 600px
  const updateregIsVisible = () => {
    const scrollTop = document.documentElement.scrollTop;
    setRegIsVisible(scrollTop > 600);
  };
  // adding event listener to the window to check if the user has scrolled down 400px
  useEffect(() => {
    window.addEventListener("scroll", updateregIsVisible);
    return () => {
      window.removeEventListener("scroll", updateregIsVisible);
    };
  }, []);

  //making sure that the awards section is loaded before scrolling
  const scrollToAwards = () => {
    setTimeout(() => {
      const awardsSection = document.getElementById("awards");
      if (awardsSection != null)
        awardsSection.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // rendering the navigation bar
  return (
    <>
      <div
        // move the nav bar left except when the registration page is visible
        // also hides the register button when registration date is passed
        className={`header ${
          regIsVisible && !currentRegistrationPageStatus
            ? isRegistrationClosed === 0
              ? "nav-move"
              : "closed-nav-move"
            : ""
        }`}
      >
        {/* Nav bar with using router */}
        <div className="nav-bar">
          <Link to="/" onClick={() => getToTop()} className="nav-btn">
            Home
          </Link>
          <Link to="/" onClick={() => scrollToAwards()} className="nav-btn">
            Awards
          </Link>
          <Link
            to="/hall-of-fame"
            onClick={() => getToTop()}
            className="nav-btn"
          >
            Hall of Fame
          </Link>
        </div>

        {/* Registration button visible except when the registration page is visible */}
        {/* also hides the register button when registration date is passed then display jesa23 button*/}
        {isRegistrationClosed === 0 ? (
          <Link
            to="/registration"
            className={`reg-nav-btn ${
              regIsVisible && !currentRegistrationPageStatus
                ? "show-reg-btn"
                : ""
            }`}
            onClick={() => getToTop()}
          >
            Register for JESA'23
          </Link>
        ) : (
          <Link
            to="/registration"
            className={`jesa23-nav-btn ${
              regIsVisible && !currentRegistrationPageStatus
                ? "show-jesa23-btn"
                : ""
            }`}
            onClick={() => getToTop()}
          >
            Check JESA'23 Registration
          </Link>
        )}
      </div>
      {/* Spacer for the nav bar */}
      <div className="spacer" id="home"></div>
    </>
  );
};

export default Navigation;
