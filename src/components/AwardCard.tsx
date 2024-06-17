import "../css/AwardCard.css";
import { Link } from "react-router-dom";

const AwardCard = ({ award, handleClick }: any) => {
  //handling clicking on an award card
  const handleAwardClick = () => {
    handleClick(award.id);
  };

  // rendering the award card
  return (
    <Link
      to={`/award/${award.uri}`}
      className="awd-card"
      onClick={handleAwardClick}
    >
      <img className="awd-card-image" src={award.image} alt={award.name} />
      <div className="awd-card-title">{award.name}</div>
      {/* display only in the BESA award */}
      {award.id === "7" && <div className="awd-besa">07 Awards</div>}
    </Link>
  );
};

export default AwardCard;
