import "../css/AfterRegistration.css";
import RegistrationDetails from "./RegistrationDetails";
import { useEffect, useState } from "react";

// declaring the after registration component
const AfterRegistration = () => {
  //declaring state vaiables
  const [candidates, setCandidates] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isTextValid, setIsTextValid] = useState("");
  const [istimeout, setIsTimeout] = useState(false);

  // reading from the canidates.json file on load
  useEffect(() => {
    const readCandidateFile = async () => {
      try {
        const candidateContent = await fetch("./data/candidates.json");
        const candidateJson = await candidateContent.json();
        setCandidates(candidateJson);
      } catch (error) {
        console.log(error);
      }
    };
    readCandidateFile();
  }, []);

  // setting auto timeout the error message after 4s
  const animateError = () => {
    setIsTimeout(true);
    setTimeout(() => {
      setIsTimeout(false);
    }, 4000);
  };

  //setting the search text
  const onSearchTextChange = (event: any) => {
    setSearchText(event.target.value);
  };

  //on clear scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // filtering the candidates based on the search text
  const onSearch = () => {
    animateError();
    if (searchText !== "") {
      // what happens when clear button is clicked. Set the butto to clear when there's a text
      if (searchResults.length !== 0) {
        setSearchText("");
        setSearchResults([]);
        setIsTextValid("notempty");
        scrollToTop();
      } else {
        //what happens when the check button is clicked
        const results = candidates.filter(
          (candidate: any) => candidate.contactNo === searchText
        );
        setSearchResults(results);
        results.length === 0 ? setIsTextValid("false") : setIsTextValid("true");
      }
    } else {
      setSearchText("");
      setSearchResults([]);
      setIsTextValid("empty");
      scrollToTop();
    }
  };

  // rendering the after registration component
  return (
    <div className="ar-section">
      {/* Heading section */}
      <div className="ar-headings">
        <h1>JESA'23</h1>
        <div className="ar-description">
          <img src="./images/jesa23-logo.png" alt="JESA 2023 Logo" />
          <div className="ar-subtext">
            <h3>
              Check your registrations for JESA'23 and get your Registration
              Numbers!
            </h3>
            <div className="ar-check-container">
              <input
                type="text"
                placeholder="TP : 07XXXXXXXX"
                value={searchText}
                onChange={onSearchTextChange}
              />
              {/* change the button function based on the action */}
              <button className="ar-check-btn" onClick={onSearch}>
                {searchResults.length !== 0 ? "Clear" : "Check"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Registration Details Section */}
      {searchResults.length !== 0 ? (
        <RegistrationDetails candidateDetails={searchResults} />
      ) : null}

      {/* Error message section */}
      {isTextValid === "empty" ? (
        // Auto hide error message after 4s
        <div
          className={
            istimeout ? "ar-error-message ar-error-hide" : "ar-error-message"
          }
        >
          Please enter your contact number!
        </div>
      ) : isTextValid === "false" ? (
        // Auto hide error message after 4s
        <div
          className={
            istimeout ? "ar-error-message ar-error-hide" : "ar-error-message"
          }
        >
          Oh no! We can't find your registration. Did you enter your contact
          number correctly?
        </div>
      ) : null}

      <h3 className="ar-footer-text">
        Something is wrong? Reach us from below!
      </h3>
    </div>
  );
};

export default AfterRegistration;
