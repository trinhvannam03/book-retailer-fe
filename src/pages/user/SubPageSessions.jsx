import React, {useEffect, useState} from 'react';
import {fetchWithRetry} from "../../components/axiosClient";
import {useAuthentication} from "../../context/AuthenticationContext";

const SubPageSessions = () => {
    const [sessions, setSessions] = useState([])
    const fetchSessions = async () => {
        try {
            const response = await fetchWithRetry("api/user/sessions", "GET")
            if (response.status === 200) {
                setSessions(response.data)
            }
        } catch (error) {

        }
    }

    const stringDate = (createdAt) => {

        const date = new Date(
            createdAt[0], // Year
            createdAt[1] - 1,
            createdAt[2], // Day
            createdAt[3], // Hours
            createdAt[4], // Minutes
            createdAt[5] // Seconds
        );
        const options = {year: "numeric", month: "long", day: "numeric"};
        const formattedDate = date.toLocaleDateString("en-US", options);
        return formattedDate
    }
    useEffect(() => {
        fetchSessions().then()
    }, []);
    const logout = async (session) => {
        try {
            const response = await fetchWithRetry("auth/logout", "POST", session)
        } catch (error) {

        }
    }
    return (<div className={"sub-page sessions"}>
        <div className={"session-actions"}></div>
        <div className={"session-logs"}>
            <div className={"session-logs-header"}>Where you're logged in</div>
            {sessions?.map(session =>
                <div className={"session-log"}>
                    <div className={"session-date"}>{stringDate(session.createdAt)}
                        {session?.sessionStatus === "ACTIVE" ?
                            <div className={"log-out-session"} onClick={() => {
                                logout(session).then()
                            }}>Sign Out
                            </div> : <div className={"log-out-session logged-out"}>SIGNED OUT</div>
                        }
                    </div>
                    <div className={"profile-image"}>
                        <img
                            src={"https://static.vecteezy.com/system/resources/previews/007/033/146/non_2x/profile-icon-login-head-icon-vector.jpg"}/>
                    </div>
                    <div className={"session-description"}>
                        <div className={"session-device"}>
                            Your account was logged in on {session.deviceType}
                        </div>
                        {session.sessionDescription}
                    </div>
                </div>
            )}
        </div>
    </div>);
};

export default SubPageSessions;