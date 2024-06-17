import "../css/AwardPage.css";
import AwardDetails from "./AwardDetails";
import BesaPartners from "./BesaPartners";
import DefaultPartner from "./DefaultPartner";
import { useParams } from "react-router-dom";

const AwardPage = ({ selectedAward, awardData }: any) => {
  //getting the id of the award from the url
  const uri = useParams();
  //getting the award id from the awardData array using award params
  const award = awardData.find((award: any) => award.uri === uri.award);
  selectedAward = awardData.indexOf(award);

  return (
    <div className="award-page">
      {/* Award description */}
      <AwardDetails
        currentAward={awardData[selectedAward]}
        awardData={awardData}
      />

      {/* Partner section */}
      <div className="current-partners">
        {/* Default partner section (NOT for BESA award)*/}
        {awardData[selectedAward].name !== "BESA" && (
          <DefaultPartner selectedAward={selectedAward} awardData={awardData} />
        )}

        {/* Partner section only for BESA */}
        {awardData[selectedAward].name === "BESA" &&
          awardData.map(
            (award: any) =>
              award.id > 7 &&
              award.name === "BESA" && (
                <BesaPartners selectedAward={award} awardid={award.id} />
              )
          )}

        {/* Inviting for paterns */}
        <h2 className="partner-footer">
          You have been proposed to be an honorable partner of JESA ‘23
        </h2>
      </div>
    </div>
  );
};

export default AwardPage;
