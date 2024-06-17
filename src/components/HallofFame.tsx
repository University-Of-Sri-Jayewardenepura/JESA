import "../css/HallofFame.css";
import { useState, useEffect } from "react";

const HallofFame = () => {
  //storing details of hall of fame
  const [hallOfFameDetails, setHallOfFameDetails] = useState([]);

  //reading from the data files
  useEffect(() => {
    const readHallOfFameFile = async () => {
      try {
        const hallOfFameContent = await fetch("./data/hall-of-fame.json");
        const hallOfFameContentText = await hallOfFameContent.json();
        setHallOfFameDetails(hallOfFameContentText);
      } catch (error) {
        console.error(error);
      }
    };
    readHallOfFameFile();
  }, []);

  //render the Hall of Fame section
  return (
    <>
      <div className="hof-container" id="hall-of-fame">
        <h1>Hall of Fame</h1>
        <p className="hof-description">
          The legacy of JESA is an enduring testament to the celebration of
          young talents and their exceptional achievements. Over the years, this
          prestigious platform has become synonymous with excellence and
          recognition, showcasing the remarkable skills and capabilities of
          undergraduates from the University of Sri Jayewardenepura and beyond
        </p>
        <div className="hof-row">
          {/* display hall of fame years as active if there's a link to the image. Otherwise display as disabled */}
          {hallOfFameDetails.map((item: any) => (
            <a
              href={"#" + item.year}
              className={item.image !== "" ? "hof-tag" : "hof-tag-disable"}
              key={item.id}
            >
              {item.year}
            </a>
          ))}
        </div>

        {/* Looping through the years to display image */}
        {hallOfFameDetails.length !== 0 &&
          hallOfFameDetails.map(
            (item: any) =>
              item.image !== "" && (
                // attaching the id to the div to scroll to the image when the year is clicked
                <div className="hof-section" id={item.year}>
                  <h2>{item.year}</h2>
                  <img
                    src={item.image}
                    alt={"Hall of Fame " + item.year}
                    className="hof-image"
                  />
                </div>
              )
          )}
      </div>
    </>
  );
};

export default HallofFame;
