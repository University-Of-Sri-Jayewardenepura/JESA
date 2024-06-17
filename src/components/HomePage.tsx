import "../css/HomePage.css";
import AwardDetails from "./AwardDetails";
import AwardCard from "./AwardCard";
import Carousel from "./Carousel";
import ThisYearJesa from "./ThisYearJesa";

const HomePage = ({
  awardsData,
  getToTop,
  isRegistrationClosed = 1,
  updateEachAwardClick,
}: any) => {
  return (
    <div className="container" id="home">
      {/* Carousel section of the home page */}
      <Carousel />

      {/* About section of the home page */}
      <div className="description" id="about">
        <img
          src="./images/jesa-logo.png"
          alt="Jesa Logo"
          className="description-logo"
        />
        <div className="description-text">
          <h1 className="description-title"> What is JESA?</h1>
          <p>
            JESA (J'pura Employability Skills Awards), the ultimate platform for
            honoring the accomplishments of young talents. With{" "}
            <b>13 prestigious awards</b> exclusively dedicated to undergraduates
            of the University of Sri Jayewardenepura, and{" "}
            <b>a new special award </b>
            open to students from other universities, JESA sets a remarkable
            standard for recognition.
          </p>
          <p>
            Organized by the Career Skills Development Society of the
            University, this highly regarded award ceremony, initiated in 2015,
            continues to captivate audiences. Join us this year to witness the
            expansion of the JESA legacy, as talented undergraduates from
            diverse institutions compete for the coveted Best Innovator Award.
          </p>
        </div>
      </div>

      {/* Award section of the home page */}
      <div className="award-section" id="awards">
        <div className="award-topic">JESA Awards</div>
        {/* Display BEST Innovation award exclusivly */}
        <AwardDetails
          currentAward={awardsData[4]}
          handleClick={updateEachAwardClick}
        />
        {/* Display other awards like cards */}
        <div className="other-awards">
          {awardsData.map(
            (award: any) =>
              // display only if the award has an image (since all awards has images except each faculty BESA award) and skip the BEST Innovation award
              award.image !== "" &&
              award.id !== "4" && (
                <AwardCard
                  award={award}
                  key={award.id}
                  handleClick={updateEachAwardClick}
                />
              )
          )}
        </div>
      </div>

      {/* This Year JESA section */}
      <ThisYearJesa
        scrollToTop={getToTop}
        isRegistrationClosed={isRegistrationClosed}
      />
    </div>
  );
};

export default HomePage;
