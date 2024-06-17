import "../css/OtherPartners.css";
import { useState, useEffect } from "react";

const OtherPartners = () => {
  //storing details of other partners
  const [otherPartnersDetails, setOtherPartnersDetails] = useState([]);

  //reading from the data files
  useEffect(() => {
    const readOtherPartnersFile = async () => {
      try {
        const otherPartnersContent = await fetch("./data/other-partners.json");
        const otherPartnersContentText = await otherPartnersContent.json();
        setOtherPartnersDetails(otherPartnersContentText);
      } catch (error) {
        console.error(error);
      }
    };
    readOtherPartnersFile();
  }, []);

  //render the Other Partners section
  return (
    <div className="other-partners-section">
      <h1>JESA'23 Strategic Partners</h1>
      <div className="other-partners-list">
        {/* Looping through the other partners to display each partner */}
        {otherPartnersDetails.length !== 0 &&
          otherPartnersDetails.map((item: any) => (
            <a
              href={item.link}
              target="_blank"
              className="other-partner"
              key={item.id}
            >
              <img src={item.image} alt={item.partnership} />
              <h3 className="other-partners-title">{item.partnership}</h3>
            </a>
          ))}
      </div>
      <h2 className="other-partner-footer">
        You have been proposed to be an honorable partner of JESA ‘23
      </h2>
    </div>
  );
};

export default OtherPartners;
