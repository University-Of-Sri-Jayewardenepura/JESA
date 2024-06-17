import "../css/AwardDetails.css";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

//declaring the award detail component
const AwardDetails = ({ currentAward, awardData = 0, handleClick }: any) => {
  //handling clicking on inventor award
  const handleAwardClick = () => {
    handleClick(4);
  };

  // getting the current path location
  const currentLocation = useLocation();
  const isFromAwardPage = currentLocation.pathname === "/";

  //rendering the award details component
  return (
    // Selecting effects based on the section currently in
    <div className="award-card">
      {/* selecting the image of each award according to the input */}
      <Link to={`/award/${currentAward.uri}`} onClick={handleAwardClick}>
        <img
          src={currentAward.image}
          className={
            isFromAwardPage ? "award-card-image" : "award-card-image-award-page"
          }
          alt={currentAward.name}
        />
      </Link>
      {/* display the details of each selected award */}
      <div className="row">
        <div className="award-details">
          <h1 className="award-card-title">{currentAward.name}</h1>
          {/* only for innovator award */}
          {currentAward.id === "4" && (
            <div className="innovator-msg">
              Open for all the State Universities in Sri Lanka
            </div>
          )}
          <p className="award-card-description">{currentAward.description}</p>
          {/* Display exclusive section for best innovation award */}
          {currentAward.id === "4" && (
            <div className="innovator-class">
              {/* <div className="award-tag">UGC Approved</div> // Also update
              animation */}
              {isFromAwardPage && (
                <Link
                  to={`/award/${currentAward.uri}`}
                  className="become-partner"
                  onClick={handleAwardClick}
                >
                  Become a partner
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Previous Partners section @ AwardPage */}
        {!isFromAwardPage &&
          // Displaying previous partners section for all awards except BESA awards
          currentAward.id !== "7" && (
            <div className="prev-partners">
              <h2>Platinum Partners</h2>
              <div className="prev-partner-container">
                <div className="prev-partner">
                  <img
                    src={currentAward.plat2019}
                    alt="Previous Partner 2019"
                  />
                  <div className="prev-partner-year">2019</div>
                </div>
                <div className="prev-partner">
                  <img
                    src={currentAward.plat2021}
                    alt="Previous Partner 2021"
                  />
                  <div className="prev-partner-year">2021</div>
                </div>
                <div className="prev-partner">
                  <img
                    src={currentAward.plat2022}
                    alt="Previous Partner 2022"
                  />
                  <div className="prev-partner-year">2022</div>
                </div>
              </div>
            </div>
          )}

        {/* Displaying faculty names only for BESA award*/}
        <div className="faculty-names">
          {currentAward.id === "7" &&
            awardData.map(
              (award: any) =>
                award.id > 7 &&
                award.name === "BESA" && (
                  <a
                    href={"#" + award.id}
                    className="faculty-tag"
                    key={award.id}
                  >
                    {award.description}
                  </a>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default AwardDetails;
