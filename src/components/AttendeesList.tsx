import "../css/AttendeesList.css";

const AttendeesList = ({
  userData,
  currentFilter,
  updateSelectedUser,
  selectedUser,
}: any) => {
  //getting a list of attendees for the current filter
  let attendeesList: any = [];
  if (userData.length > 0) {
    userData.forEach((user: any) => {
      if (user.award.includes(currentFilter)) {
        attendeesList.push(user);
      }
    });
    attendeesList = [...new Set(attendeesList)];
  }
  //getting a list of partenr groups available
  let partnerGroups: any = [];
  if (attendeesList.length > 0) {
    attendeesList.forEach((attendee: any) => {
      if (attendee.category.includes("Partner")) {
        partnerGroups.push(attendee.category);
      }
    });
    partnerGroups = [...new Set(partnerGroups)];
  }
  // getting a list of catergories for each award except deans
  let otherCategories: any = [];
  if (attendeesList.length > 0) {
    attendeesList.forEach((attendee: any) => {
      if (attendee.award === currentFilter && attendee.category !== "Deans") {
        otherCategories.push(attendee.category);
      }
    });
    otherCategories = [...new Set(otherCategories)];
  }

  //filter based on the current filter
  return attendeesList.length !== 0 ? (
    <div className="ap-list-card">
      {/* display the current award in the title */}
      <div className="apc-title">{currentFilter}</div>

      {/* display the attendees list */}
      {currentFilter.includes("BESA") || currentFilter.includes("Best") ? (
        <>
          {/* section for nominees */}
          <div className="apc-subsection">
            <div className="apc-subtitle">Nominees</div>
            {attendeesList.map((attendee: any) => {
              if (attendee.category === "nominee") {
                return (
                  // seleting style based on the selectedUser
                  <div
                    className={
                      selectedUser === attendee
                        ? "apc-attendee-clicked"
                        : "apc-attendee"
                    }
                    key={attendee.id}
                    //update the selectedUser
                    onClick={() => {
                      updateSelectedUser(attendee);
                    }}
                  >
                    {/* check and apply style if user attended */}
                    <div
                      className={
                        !attendee.attended ? "ap-status" : "apc-active"
                      }
                    ></div>
                    {attendee.name}
                  </div>
                );
              }
            })}
          </div>
          {/* section for judge panel */}
          <div className="apc-subsection">
            <div className="apc-subtitle">Judge Panel</div>
            {attendeesList.map((attendee: any) => {
              if (attendee.category === "judge") {
                return (
                  // seleting style based on the selectedUser
                  <div
                    className={
                      selectedUser === attendee
                        ? "apc-attendee-clicked"
                        : "apc-attendee"
                    }
                    key={attendee.id}
                    //update the selectedUser
                    onClick={() => {
                      updateSelectedUser(attendee);
                    }}
                  >
                    {/* check and apply style if user attended */}
                    <div
                      className={
                        !attendee.attended ? "ap-status" : "apc-active"
                      }
                    ></div>
                    {attendee.name}
                  </div>
                );
              }
            })}
          </div>
          {/* section for partners */}
          {partnerGroups.length > 0 ? (
            <div className="apc-subsection">
              {partnerGroups.map((partnerGroup: any) => {
                return (
                  <>
                    <div className="apc-subtitle">{partnerGroup}</div>
                    {attendeesList.map((attendee: any) => {
                      if (attendee.category === partnerGroup) {
                        return (
                          <div
                            // selecting style based on the selectedUser
                            className={
                              selectedUser === attendee
                                ? "apc-attendee-clicked"
                                : "apc-attendee"
                            }
                            key={attendee.id}
                            //update the selectedUser
                            onClick={() => {
                              updateSelectedUser(attendee);
                            }}
                          >
                            {/* check and apply style if user attended */}
                            <div
                              className={
                                !attendee.attended ? "ap-status" : "apc-active"
                              }
                            ></div>
                            {attendee.name}
                          </div>
                        );
                      }
                    })}
                  </>
                );
              })}
            </div>
          ) : null}
        </>
      ) : (
        // display cards for other categories
        <div className="apc-subsection">
          {otherCategories.map((category: any) => {
            return (
              <>
                <div className="apc-subtitle">{category}</div>
                {attendeesList.map((attendee: any) => {
                  if (attendee.category === category) {
                    return (
                      <div
                        // selecting style based on the selectedUser
                        className={
                          selectedUser === attendee
                            ? "apc-attendee-clicked"
                            : "apc-attendee"
                        }
                        key={attendee.id}
                        //update the selectedUser
                        onClick={() => {
                          updateSelectedUser(attendee);
                        }}
                      >
                        {/* check and apply style if user attended */}
                        <div
                          className={
                            !attendee.attended ? "ap-status" : "apc-active"
                          }
                        ></div>
                        {attendee.name}
                      </div>
                    );
                  }
                })}
              </>
            );
          })}
        </div>
      )}
    </div>
  ) : null;
};

export default AttendeesList;
