import "../css/BulkMessage.css";
import axios from "axios";
import { useEffect, useState } from "react";
import AttendanceLogin from "./AttendanceLogin";
import Loading from "./Loading";

const BulkMessage = () => {
  //defining state variables
  // const backendUrl = "http://localhost:8080";
  // const backendUrl = "https://jesa-23.azurewebsites.net";
  const backendUrl = "https://jesa-backend.onrender.com";
  const [userList, setUserList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [isUserPermitted, setIsUserPermitted] = useState("none");
  const [isloading, setIsLoading] = useState(false);
  // const testcontactList = [
  //   "+94766885466",
  //   "+94785580252",
  //   // "+94711766662",
  //   // "+94718938256",
  //   // "+94763886390",
  // ];

  // event listeners for each input field
  const handleTextChange = (e: any) => {
    setMessageContent(e.target.value);
  };

  //fetching data from backend
  const getUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(backendUrl + "/user/list");
      setUserList(response.data);
    } catch (error) {
      console.log(error);
      alert(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  //getting the list of contact numbers
  useEffect(() => {
    var contactList: any = [];
    userList.forEach((user: any) => {
      if (user.contactNo !== "") contactList.push(user.contactNo);
    });
    contactList = [...new Set(contactList)];
    setContactList(contactList);
    console.log(contactList);
  }, [userList]);

  // sending the message
  const sendSMSrequest = async ({ recipientNo, content }: any) => {
    try {
      // configs for api call
      const apiUrl = "https://dashboard.smsapi.lk/api/v3/sms/send";
      const apiToken = "41|GuVkuGRBlvf8AhMikKJcgXh8UYqMjPhfpiWARx4P";
      //const apiToken = "";
      const senderId = "JESA 2023";
      const message = content;

      // Request Header Parameters
      const headers = {
        Authorization: `Bearer ${apiToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      // Request Body Parameters
      const requestBody = {
        recipient: recipientNo,
        sender_id: senderId,
        type: "plain",
        message: message,
      };

      // Make the HTTP POST request
      const response = await axios.post(apiUrl, requestBody, { headers });

      // Log the response or handle it as needed
      console.log("SMS API Response:", response.data);

      // Return the response
      return response.data;
    } catch (error: any) {
      // Log and handle errors
      console.log(error);
    }
  };
  //sending the message one by one
  const sendSMS = async () => {
    var totalMessages = 0;
    var successMessages = 0;
    var failedMessages = 0;
    if (messageContent !== "") {
      setIsLoading(true);
      for (let i = 0; i < contactList.length; i++) {
        const response = await sendSMSrequest({
          recipientNo: contactList[i],
          content: messageContent,
        });
        if (response?.status === "success") successMessages++;
        else failedMessages++;
        totalMessages++;
      }
      // send the summary message
      console.log(
        `SMS Campaign Summary\n\nTotal : ${totalMessages}\nSuccessful : ${successMessages}\nFailed : ${failedMessages}`
      );
      sendSMSrequest({
        recipientNo: "+94766885466",
        content: `SMS Campaign Summary\n\nTotal : ${totalMessages}\nSuccessful : ${successMessages}\nFailed : ${failedMessages}`,
      });
      setIsLoading(false);
      alert(
        `SMS Campaign Summary\n\nTotal : ${totalMessages}\nSuccessful : ${successMessages}\nFailed : ${failedMessages}`
      );
    } else {
      alert("Please enter a message");
    }
  };

  // rendering the component
  return (
    <>
      {isloading ? <Loading /> : null}
      <div className="bm-card">
        {isUserPermitted === "superAdmin" ? (
          <>
            <div className="bm-title">Bulk Message</div>
            <div className="bm-subtitle">Send SMS to all attendees</div>
            <div className="bm-input">
              <textarea
                className="bm-textarea"
                placeholder="Enter your message here"
                value={messageContent}
                onChange={handleTextChange}
              ></textarea>
              <a
                className="bm-hint"
                href="https://sms.cx/unicode-to-gsm-converter/"
                target="_blank"
              >
                https://sms.cx/unicode-to-gsm-converter/
              </a>
            </div>
            <div className="bm-button" onClick={sendSMS}>
              Send
            </div>
          </>
        ) : (
          <AttendanceLogin setUserPermission={setIsUserPermitted} />
        )}
      </div>
    </>
  );
};

export default BulkMessage;
