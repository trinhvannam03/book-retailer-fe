import React, {useState} from 'react';
import {fetchWithRetry} from "../../components/axiosClient";

const SubPageChangePassword = () => {
    const [info, setInfo] = useState({
        currentPassword: undefined,
        newPassword: undefined,
        confirmedPassword: undefined
    })
    const changePassword = async () => {
        try {
            const response = await fetchWithRetry("api/user/password", "POST", info)
            if (response.status === 200) {
                setInfo(response.data)
            }
        } catch (error) {

        }
    }
    return (
        <>
            <div className={"sub-page password"}>
                <div className={"password-inputs"}>
                    <div className={"sub-page-header"}>
                        <p>
                            Change Password
                        </p>
                        To secure your account, please do not share your password with others.
                    </div>
                    <div className={"profile-input-wrapper"}>
                        <div className={"input-label"}>Current Password:</div>
                        <input type={"password"} onChange={(event) => {
                            setInfo(prev => {
                                return {
                                    ...prev, currentPassword: event.target.value
                                }
                            })
                        }}/>
                    </div>
                    <div className={"profile-input-wrapper"}>
                        <div className={"input-label"}>New Password:</div>
                        <input type={"password"} onChange={(event) => {
                            setInfo(prev => {
                                return {
                                    ...prev, password: event.target.value
                                }
                            })
                        }}/>
                    </div>
                    <div className={"profile-input-wrapper"}>
                        <div className={"input-label"}>Confirm Password:</div>
                        <input type={"password"} onChange={(event) => {
                            setInfo(prev => {
                                return {
                                    ...prev, confirmedPassword: event.target.value
                                }
                            })
                        }}/>
                    </div>
                    <div className={"profile-input-wrapper save"}>

                        <div className={"input-label"}></div>
                        <button onClick={() => {
                            changePassword().then()
                        }} className={"save-profile"}>
                            Confirm
                        </button>
                    </div>

                </div>
                <div>
                    <div className={"sub-page-header"}>
                    </div>
                </div>
            </div>
        </>
    )
        ;
};

export default SubPageChangePassword;