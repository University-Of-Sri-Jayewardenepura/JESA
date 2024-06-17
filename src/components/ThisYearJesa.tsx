import "../css/ThisYearJesa.css";
import OtherPartners from "./OtherPartners";
import Registration from "./Registration";

// declaring this year jesa section to show in the Home Page
const ThisYearJesa = ({ scrollToTop, isRegistrationClosed }: any) => {
  // rendering this year jesa section
  return (
    <div className="this-year-section" id="jesa23">
      <h1>JESA'23</h1>

      {/* display Registration Section */}
      <Registration
        getToTop={scrollToTop}
        isRegistrationClosed={isRegistrationClosed}
      />

      {/* display This year sponsor section */}
      <OtherPartners />

      {/* Later add other sections as components */}
    </div>
  );
};

export default ThisYearJesa;
