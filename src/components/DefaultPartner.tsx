import "../css/DefaultPartner.css";

// Declaring component for new partners except for BESA
const DefaultPartner = ({ selectedAward, awardData }: any) => {
  const selectedAwardData = awardData[selectedAward];

  return (
    <div className="default-partners">
      <h2 className="partner-subtitle">Who will be the partners of</h2>
      <h1 className="partner-title">2023</h1>
      <div className="partner-cont">
        <div className="partner gold">
          <h2 className="partner-types">Gold</h2>
          <a href={selectedAwardData.gold2023link} target="_blank">
            <img src={selectedAwardData.gold2023} alt="Gold Partner" />
          </a>
        </div>
        <div className="partner platinum">
          <h2 className="partner-types">Platinum</h2>
          <a href={selectedAwardData.plat2023link} target="_blank">
            <img src={selectedAwardData.plat2023} alt="Platinum Partner" />
          </a>
        </div>
        <div className="partner silver">
          <h2 className="partner-types">Silver</h2>
          <a href={selectedAwardData.silv2023link} target="_blank">
            <img src={selectedAwardData.silv2023} alt="Silver Partner" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DefaultPartner;
