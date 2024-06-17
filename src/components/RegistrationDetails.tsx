import "../css/RegistrationDetails.css";
import AppliedAwardCard from "./AppliedAwardCard";

// declaring the registration details component
const RegistrationDetails = ({ candidateDetails }: any) => {
  //declaring state vaiables
  const selectedCandidate = candidateDetails[0];

  // rendering the registration details component
  return (
    <div className="reg-details" id="#reg-details">
      {/* Registration details section */}
      <div className="reg-details-container">
        <h1>Registration Details</h1>
        <h3>
          Name : <div>{selectedCandidate.name}</div>
        </h3>
        <h3>
          Mobile No : <div>{selectedCandidate.contactNo}</div>
        </h3>
        <h3>
          Email : <div>{selectedCandidate.email}</div>
        </h3>
        <h3>
          {selectedCandidate.faculty.toLowerCase().includes("university")
            ? "University"
            : "Faculty"}
          : <div>{selectedCandidate.faculty}</div>
        </h3>
        <div className="reg-details-row-tags">
          <h3>Tags :</h3>
          <div className="candidate-tag">Candidate</div>
          {selectedCandidate.isOC === "Yes" ? (
            <div className="oc-tag">Organizing Committee</div>
          ) : null}
        </div>
      </div>

      {/* Applied award section */}
      <AppliedAwardCard selectedAwards={selectedCandidate.regNo} />
    </div>
  );
};

export default RegistrationDetails;
