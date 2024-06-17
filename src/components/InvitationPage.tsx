import "../css/Invitation.css";
import { useState, useEffect } from "react";

// declaring the invitation component
const InvitationPage = () => {
  // state variables
  const [isTimePassed, setIsTimePassed] = useState(false);
  // Set up the state to store the time left until the target date
  const [timeLeft, setTimeLeft] = useState({
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
  });

  // counting down to the final day
  // Specify the target date and time in ISO format
  const targetDate = "2023-12-15T18:00:00";
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const targetTime = new Date(targetDate).getTime();
    const timeDifference = targetTime - now;

    // If the target date has passed, return 0
    if (timeDifference <= 0) {
      setIsTimePassed(true);
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }

    // Calculate the number of days, hours, minutes and seconds left
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return {
      days: days.toString().padStart(2, "0"),
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  // Update the time left every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // rendering the invitation page
  return (
    <div className="inv-container">
      <div className="inv-header">
        <h3>Join us for the</h3>
        <h1 className="inv-title">JESA 2023</h1>
        <h2>Japura Employability Skills Awards</h2>
        <p className="inv-header-para">
          Celebrating Excellence and Achievement!
        </p>
      </div>

      <div className="inv-mid">
        <div className="inv-body">
          We are thrilled to invite you to join us for the much awaited{" "}
          <span>JESA 2023</span> Awards ceremony, set to take place at the
          opulent{" "}
          <span>
            {" "}
            <a
              className="location-btn"
              href="https://maps.app.goo.gl/awz7hXzqRMEx74Gv9"
              target="_blank"
            >
              Golden Rose Hotel
            </a>
          </span>{" "}
          in Boralesgamuwa on the <span>15th of December 2023</span>
          <h3>Save the Date!</h3>
        </div>

        {/* Countdown section */}
        <div className="inv-countdown">
          <h2>
            {isTimePassed
              ? `It's time for the show! See you at there!`
              : "Countdown to the Final Day"}
          </h2>
          {!isTimePassed && (
            <div>
              <div className="inv-countdown-row inv-countdown-bg">
                <div className="inv-countdown-num">{timeLeft.days}</div>
                <div className="inv-countdown-num">{timeLeft.hours}</div>
                <div className="inv-countdown-num">{timeLeft.minutes}</div>
                <div className="inv-countdown-num">{timeLeft.seconds}</div>
              </div>
              <div className="inv-countdown-row">
                <div className="inv-countdown-text">Days</div>
                <div className="inv-countdown-text">Hours</div>
                <div className="inv-countdown-text">Mins</div>
                <div className="inv-countdown-text">Secs</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="inv-footer-section">
        <div className="inv-footer">
          <div className="inv-footer-details">
            <h2>Event Details</h2>
            <table cellPadding={"2px"} cellSpacing={0}>
              <tr>
                <td width={"18%"}>
                  <span>Date</span>
                </td>
                <td>:</td>
                <td>15th December 2023</td>
              </tr>
              <tr>
                <td>
                  <span>Time</span>
                </td>
                <td>:</td>
                <td>6pm Onwards</td>
              </tr>
              <tr>
                <td>
                  <span>Venue</span>
                </td>
                <td>:</td>
                <td>
                  Golden Rose Hotel, Boralesgamuwa
                  <div className="map-btn">
                    <a
                      href="https://maps.app.goo.gl/awz7hXzqRMEx74Gv9"
                      target="_blank"
                    >
                      Open on Maps
                    </a>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div className="inv-footer-para">
            Immerse yourself in an evening dedicated to honoring excellence,
            fostering innovation, and celebrating outstanding achievements
            across various categories
          </div>
        </div>
        <div className="inv-footer-end">
          Mark your calendars and be a part of this grand celebration! Stay
          tuned for updates and more event details
        </div>
        <div className="inv-footer-closing">
          We look forward to your esteemed presence at <span>JESA 2023!</span>
        </div>
      </div>
    </div>
  );
};

export default InvitationPage;
