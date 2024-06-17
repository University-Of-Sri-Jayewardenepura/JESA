// import React from "react";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import "./css/App.css";
import HomePage from "./components/HomePage";
import AwardPage from "./components/AwardPage";
import HallofFame from "./components/HallofFame";
import RegistrationPage from "./components/RegistrationPage";
import InvitationPage from "./components/InvitationPage";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import NotFoundPage from "./components/NotFoundPage";
import AttendancePage from "./components/AttendancePage";
import BulkMessage from "./components/BulkMessage";
// import Loading from "./components/Loading";

//lazy loading the components to increase the speed (remvoed due to a bug)
// const LazyHomePage = React.lazy(() => import("./components/HomePage"));
// const LazyAwardPage = React.lazy(() => import("./components/AwardPage"));
// const LazyHallofFame = React.lazy(() => import("./components/HallofFame"));
// const LazyRegistrationPage = React.lazy(
//   () => import("./components/RegistrationPage")
// );
// const LazyInvitationPage = React.lazy(
//   () => import("./components/InvitationPage")
// );

//main application
function App() {
  //storing details of each awards
  const [awardDetails, setAwardDetails] = useState([]);
  const [selectedAward, setSelectedAward] = useState(0);
  const [registrationClosed, setRegistrationClosed] = useState(0);

  //reading from the data files
  useEffect(() => {
    const readAwardFile = async () => {
      try {
        const awardConent = await fetch("/data/award.json");
        const awardConentText = await awardConent.json();
        setAwardDetails(awardConentText);
      } catch (error) {
        console.error(error);
      }
    };
    readAwardFile();
  }, []);

  //chekcing if the registration date is passed and updating the state
  useEffect(() => {
    const closingDate = new Date("2023-07-31");
    const todayDate = new Date();
    // automatically close the registration
    if (todayDate > closingDate) setRegistrationClosed(1);
  }, []);

  //handling animation with buttons
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  //handling clicking on an award
  const handleAwardClick = (value: any) => {
    setSelectedAward(value);
    scrollToTop();
  };

  //render the main application
  return (
    awardDetails.length != 0 && (
      <>
        {/* always display the navigation bar */}
        <Navigation
          getToTop={scrollToTop}
          isRegistrationClosed={registrationClosed}
        />

        {/* using react router dom to handle the routes */}
        <Routes>
          {/* display home page */}
          <Route
            path="/"
            element={
              // <React.Suspense fallback={<Loading />}>
              //   <LazyHomePage
              //     awardsData={awardDetails}
              //     isRegistrationClosed={registrationClosed}
              //     getToTop={scrollToTop}
              //     updateEachAwardClick={handleAwardClick}
              //   />
              // </React.Suspense>
              <HomePage
                awardsData={awardDetails}
                isRegistrationClosed={registrationClosed}
                getToTop={scrollToTop}
                updateEachAwardClick={handleAwardClick}
              />
            }
          />
          {/* display hall of fame page */}
          <Route path="/hall-of-fame" element={<HallofFame />} />
          {/* display registration page */}
          <Route
            path="/registration"
            element={
              <RegistrationPage isRegistrationClosed={registrationClosed} />
            }
          />
          {/* display Awards page with the selected award */}
          <Route
            path="/award/:award"
            element={
              <AwardPage
                awardData={awardDetails}
                selectedAward={selectedAward}
              />
            }
          />
          <Route path="/invitation" element={<InvitationPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/bulk-message" element={<BulkMessage />} />
          {/* <Route path="/loading" element={<Loading />} /> */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Always display the footer and scroll to top */}
        <ScrollToTop />
        <Footer />
      </>
    )
  );
}

export default App;
