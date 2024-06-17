import { useState, useEffect } from "react";
import "../css/Carousel.css";

const Carousel = () => {
  //declaring the state variables
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagItems, setImagItems] = useState([]);
  const [clickedDirection, setClickedDirection] = useState("right" as any);

  //getting links and data of the images
  useEffect(() => {
    const readCarouselFile = async () => {
      try {
        const carouselContent = await fetch("./data/carousel.json");
        const carouselContentText = await carouselContent.json();
        setImagItems(carouselContentText);
      } catch (error) {
        console.error(error);
      }
    };
    readCarouselFile();
  }, []);

  //handling the previous and next button actions
  const handlePrevious = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setClickedDirection("left");
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? imagItems.length - 1 : prevIndex - 1
      );
    }
  };
  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setClickedDirection("right");
      setCurrentIndex((prevIndex) =>
        prevIndex === imagItems.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  // Auto-scroll to the next item every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === imagItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000);
    // Clear the interval when the currentIndex changes
    return () => clearInterval(interval);
  }, [currentIndex, imagItems.length]);

  //handling the transition of the images by attaching a class to the image
  useEffect(() => {
    const transitionTimeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 750);

    return () => {
      clearTimeout(transitionTimeout);
      setIsTransitioning(true);
    };
  }, [currentIndex]);

  //setting the selected item
  const currentItem = imagItems[currentIndex];

  //rendering the carousel component
  return (
    //checking if the carousel has any items and renders it
    imagItems.length !== 0 && (
      <div className="carousel-image-holder">
        <picture>
          {/* displaying narrow images for smaller screens */}
          <source
            media="(max-width: 810px)"
            srcSet={currentItem["narrow-link"]}
          />
          <img
            src={currentItem["link"]}
            alt={currentItem["description"]}
            // handling the transition for next and previous buttons
            className={
              isTransitioning
                ? clickedDirection == "right"
                  ? "carousel-image transitioning-right"
                  : "carousel-image transitioning-left"
                : "carousel-image"
            }
          />
        </picture>
        {/* Displaying the buttons */}
        <button
          onClick={handleNext}
          className="fa fa-angle-right prev-btn"
        ></button>
        <button
          onClick={handlePrevious}
          className="fa fa-angle-left next-btn"
        ></button>
        <a href="#about" className="scroll-btn">
          Scroll Down
        </a>
      </div>
    )
  );
};

export default Carousel;
