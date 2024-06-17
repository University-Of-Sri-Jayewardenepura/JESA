import "../css/ScrollToTop.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// declaring scroll to top button's functionality
const ScrollToTop = ({}: any) => {
  //declaring the state variables
  const [isVisible, setIsVisible] = useState(false);
  const [isPartnershipBtnVisible, setIsPartnershipBtnVisible] = useState(false);

  // getting the current path location
  const currentLocation = useLocation();
  const isInRegistrationPage =
    currentLocation.pathname === "/registration" ||
    currentLocation.pathname === "/invitation" ||
    currentLocation.pathname === "/attendance";

  // displaying the scroll to top button when the user scrolls down 400px
  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    setIsVisible(scrollTop > 400);
  };

  // declaring a function to show and hide partnership button
  const updatePartnershipBtn = () => {
    const scrollTop = document.documentElement.scrollTop;
    setIsPartnershipBtnVisible(scrollTop > 700);
  };

  // scrolling to the top of the page when the user clicks the button
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // adding event listener to the window to check if the user has scrolled down 400px
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", updatePartnershipBtn);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", updatePartnershipBtn);
    };
  }, []);

  // rendering the scroll to top button
  return (
    <>
      <div
        className={`scroll-to-top ${isVisible ? "show" : "hide"}`}
        onClick={scrollToTop}
      >
        <i className="fa fa-chevron-up"></i>
      </div>
      {/* Adding a fixed button to the partnership google form */}
      {/* Always visible except in student registration page */}
      {!isInRegistrationPage && (
        <div
          className={`partnership-button ${
            isPartnershipBtnVisible
              ? "partnership-button-show"
              : "partnership-button-hide"
          }`}
        >
          <a
            href="https://forms.gle/NnJT9ZK25GuVau677"
            target="_blank"
            rel="noreferrer"
          >
            Partner with us!
          </a>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
