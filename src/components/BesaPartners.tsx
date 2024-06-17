import "../css/BesaPartners.css";

// Declaring component for a single besa partner
const BesaPartners = ({ selectedAward, awardid }: any) => {
  // rednering the besa partners component
  return (
    // attaching the id of the award to the div to be able to scroll to it
    <div className="besa-partners" id={awardid}>
      <h2 className="faculty-name">{selectedAward.description}</h2>
      <div className="besa-partner-container">
        {/* Previous besa platinum partners section */}
        <div className="prev-besa-partners">
          <h2 className="prev-besa-plat-partners">
            Previous Platinum Partners
          </h2>
          <div className="prev-besa-partners-list">
            <div className="prev-besa-partner">
              <img src={selectedAward.plat2019} alt="Platinum Partner 2019" />
              <h3>2019</h3>
            </div>
            <div className="prev-besa-partner">
              <img src={selectedAward.plat2021} alt="Platinum Partner 2021" />
              <h3>2021</h3>
            </div>
            <div className="prev-besa-partner">
              <img src={selectedAward.plat2022} alt="Platinum Partner 2022" />
              <h3>2022</h3>
            </div>
          </div>
        </div>

        {/* Current Besa partners section */}
        <div className="current-besa-partners">
          <h3 className="besa-partner-subtitle">Who will be the partners of</h3>
          <h1>2023</h1>
          <div className="current-besa-partners-list">
            <a
              href={selectedAward.gold2023link}
              target="_blank"
              className="current-besa-partner besa-gold"
            >
              <img src={selectedAward.gold2023} alt="Gold Partner 2023" />
              <h3 className="gold-text">Gold</h3>
            </a>
            <a
              href={selectedAward.plat2023link}
              target="_blank"
              className="current-besa-partner besa-platinum"
            >
              <img src={selectedAward.plat2023} alt="Platinum Partner 2023" />
              <h3 className="platinum-text">Platinum</h3>
            </a>
            <a
              href={selectedAward.silv2023link}
              target="_blank"
              className="current-besa-partner besa-silver"
            >
              <img src={selectedAward.silv2023} alt="Silver Partner 2023" />
              <h3 className="silver-text">Silver</h3>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BesaPartners;
