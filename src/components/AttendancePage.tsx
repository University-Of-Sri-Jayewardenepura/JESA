import "../css/AttendancePage.css";
import CheckIn from "./CheckIn";
import Filters from "./Filters";
import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading";
import AttendanceLogin from "./AttendanceLogin";

const AttendancePage = () => {
  //defining state variables
  const backendUrl = "https://jesa-backend.onrender.com";
  // const backendUrl = "http://localhost:8080";
  // const backendUrl = "https://jesa-23.azurewebsites.net";
  const [userList, setUserList] = useState([]);
  const [filters, setFilters] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState({
    id: "",
    name: "",
    contactNo: "",
    award: "",
    category: "",
    attended: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isloading, setIsLoading] = useState(true);
  const [userPermission, setUserPermission] = useState("none");
  const [inOCMenu, setInOCMenu] = useState(false);
  const ocMenuFilters = ["JESA", "CSDS", "Crew"];

  //fetching data from backend
  const getUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(backendUrl + "/user/list");
      setUserList(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      alert(`Error: ${error}`);
    }
  };
  //get data from backend on page load using useEffect
  useEffect(() => {
    getUsers();
  }, [currentFilter, inOCMenu]);

  useEffect(() => {
    const fetchData = async () => {
      // Getting filters from the userList award field and grouping them
      if (userList.length > 0) {
        let awardList: any = [];
        let ocawardList: any = [];
        userList.forEach((user: any) => {
          // divide the filters into two groups
          var isInOC = false;
          ocMenuFilters.forEach((filter) => {
            // for OC attendees
            if (user.award.includes(filter)) {
              ocawardList.push(user.award);
              isInOC = true;
            }
          });
          // for non OC attendees
          if (!isInOC && !user.award.includes("/")) {
            awardList.push(user.award);
          }
        });

        // remove duplicates based on if in the OC menu or not
        if (inOCMenu) {
          awardList = [...new Set(ocawardList)];
        } else {
          awardList = [...new Set(awardList)];
        }
        setFilters(awardList);
      }
    };
    fetchData();
  }, [userList, inOCMenu]);

  // get a set of users based on the selected filter
  useEffect(() => {
    if (currentFilter !== "") {
      let filteredAttendeesList: any = [];
      if (userList.length > 0) {
        userList.forEach((user: any) => {
          if (user.award.includes(currentFilter)) {
            filteredAttendeesList.push(user);
          }
        });
      }
      setFilteredData(filteredAttendeesList);
    }
  }, [currentFilter, inOCMenu]);

  // getting changes from the search bar
  useEffect(() => {
    if (searchText !== "") {
      setCurrentFilter("");
      let filteredAttendeesList: any = [];
      if (userList.length > 0) {
        userList.forEach((user: any) => {
          if (user.name.toLowerCase().includes(searchText.toLowerCase())) {
            filteredAttendeesList.push(user);
          }
          if (user.contactNo.toLowerCase().includes(searchText.toLowerCase())) {
            filteredAttendeesList.push(user);
          }
          if (user.category.toLowerCase().includes(searchText.toLowerCase())) {
            filteredAttendeesList.push(user);
          }
        });
      }
      setFilteredData(filteredAttendeesList);
    }
  }, [searchText]);
  // get the search value
  const searchAttendee = (event: any) => {
    setSearchText(event.target.value);
  };
  // clear the search bar
  const clearSearch = () => {
    setSearchText("");
    setFilteredData([]);
  };

  //setting oc menu toggle
  const toggleOCMenu = () => {
    if (inOCMenu) {
      setInOCMenu(false);
    } else {
      setInOCMenu(true);
    }
    clearSearch();
  };

  //rendering the page
  return userPermission !== "none" ? (
    <>
      {isloading ? <Loading /> : null}
      <div className="attendance-page">
        {/* heading section */}
        <div className="ap-heading">
          <div className="ap-title">
            <h1>JESA 2023</h1>
            <h2>
              <span>Attendance</span>Marking System
            </h2>
          </div>

          {/* search section */}
          <div className="search-bar">
            <input
              type="text"
              value={searchText}
              onChange={searchAttendee}
              placeholder="Search an attendee"
              className="search-box"
            ></input>
            {/* change the icon depend on the input */}
            {searchText === "" ? (
              <i className="fa fa-search"></i>
            ) : (
              <i className="fa fa-times" onClick={clearSearch}></i>
            )}
          </div>
        </div>
        {/* Toggle menu for marking OC and Non OC */}
        <div className="oc-menu-toggle">
          <div className="toggle-holder">
            <div
              className={inOCMenu ? "oc-menu-off" : "oc-menu-on"}
              onClick={toggleOCMenu}
            >
              Admins & Awards
            </div>
            <div
              className={inOCMenu ? "oc-menu-on" : "oc-menu-off"}
              onClick={toggleOCMenu}
            >
              OC
            </div>
          </div>

          <h2>Attendees</h2>
        </div>
        {/* download button */}
        {userPermission === "editor" ? (
          <a
            href={backendUrl + "/user/list-download"}
            className="ap-download-btn"
          >
            Download Attendees List
          </a>
        ) : null}

        {/* Check in section */}
        <div className="ap-body">
          {/* filtering component */}
          <Filters
            filterData={filters}
            updateFilter={setCurrentFilter}
            currentFilter={currentFilter}
            searchText={setSearchText}
          />
          <CheckIn
            userData={
              currentFilter !== "" || searchText !== ""
                ? filteredData
                : userList
            }
            filterData={filters}
            updateFilter={setCurrentFilter}
            updateSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
            resetSearch={clearSearch}
            getAllData={getUsers}
            isInOCMenu={inOCMenu}
            userPermission={userPermission}
            backendUrl={backendUrl}
          />
        </div>
      </div>
    </>
  ) : (
    <div className="attendance-page">
      {/* heading section */}
      <div className="ap-heading">
        <div className="ap-title">
          <h1>JESA 2023</h1>
          <h2>
            <span>Attendance</span>Marking System
          </h2>
        </div>
      </div>
      <AttendanceLogin setUserPermission={setUserPermission} />
      <div className="ap-contactme">Something is wrong? Call 076 688 5466!</div>
    </div>
  );
};

export default AttendancePage;
