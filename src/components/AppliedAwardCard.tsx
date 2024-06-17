import "../css/AppliedAwardCard.css";

// declaring the applied award card component
const AppliedAwardCard = ({ selectedAwards }: any) => {
  //declaring state vaiables
  const awardsArray = selectedAwards.split(",");

  //function to select the award name
  const selectAwardName = (award: string) => {
    let awardName = "";
    switch (true) {
      case award.includes("BL"):
        awardName = "Best Leader";
        break;
      case award.includes("BT"):
        awardName = "Best Team Player";
        break;
      case award.includes("BI"):
        awardName = "Best Innovator";
        break;
      case award.includes("BD"):
        awardName = "Best Creative Designer";
        break;
      case award.includes("BC"):
        awardName = "Best Communicator";
        break;
      case award.includes("BE"):
        awardName = "Best Young Entrepreneur";
        break;
      case award.includes("CSR"):
        awardName = "Best CSR";
        break;
      case award.includes("FOT"):
        awardName = "BESA FOT";
        break;
      case award.includes("FMS"):
        awardName = "BESA FMS";
        break;
      case award.includes("FMSC"):
        awardName = "BESA FMSC";
        break;
      case award.includes("FHSS"):
        awardName = "BESA FHSS";
        break;
      case award.includes("FOE"):
        awardName = "BESA FOE";
        break;
      case award.includes("FAS"):
        awardName = "BESA FAS";
        break;
      case award.includes("FAHS"):
        awardName = "BESA FAHS";
        break;
    }
    return awardName;
  };

  // rendering the applied award card component
  return (
    <div className="applied-cards">
      <h2>Applied Awards</h2>
      <div className="applied-card-container">
        {awardsArray.map((award: string, index: number) => (
          <div className="applied-card" key={index}>
            <h3>{selectAwardName(award)}</h3>
            <p>Registration Number</p>
            <div className="applied-card-reg-no">{awardsArray[index]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppliedAwardCard;
