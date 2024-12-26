import React, {useEffect, useState} from 'react';
import {fetchWithRetry} from "../../components/axiosClient";
import {defaultProfilePicture} from "../../components/Navbar";
import clsx from "clsx";

const SubPageProfile = () => {
    const [profile, setProfile] = useState({userTier: undefined, gender: undefined, dateOfBirth: undefined})
    const [date, setDate] = useState(0)
    const [month, setMonth] = useState(0)
    const [year, setYear] = useState(0)
    const dates = Array.from({length: 31}, (_, index) => index + 1);
    const months = Array.from({length: 12}, (_, index) => index + 1);
    const years = Array.from({length: (new Date().getFullYear()) - 1900 + 1}, (_, index) => 1900 + index)
    const [successfulUpdate, setSuccessfulUpdate] = useState(false)
    useEffect(() => {
        if (successfulUpdate) {
            setTimeout(() => {
                setSuccessfulUpdate(false)
            }, 5000)
        }
    }, [successfulUpdate]);
    const isValidDate = (day, month, year) => {
        const lastDayOfMonth = new Date(year, month, 0).getDate(); // Get the last day of the selected month
        return day <= lastDayOfMonth;
    };
    useEffect(() => {
        try {
            const dateOfBirth = new Date(profile.dateOfBirth);
            const day = dateOfBirth.getDate();
            const month = dateOfBirth.getMonth() + 1;
            const year = dateOfBirth.getFullYear();
            setDate(day);
            setMonth(month);
            setYear(year);
        } catch (error) {
        }
    }, [profile.dateOfBirth]);
    const tiers = {
        bronze: "BRONZE",
        gold: "GOLD",
        silver: "SILVER"
    }
    useEffect(() => {
        // If the current date is not valid for the selected month/year, adjust it to the last valid day of the month
        if (!isValidDate(date, month, year)) {
            const lastDayOfMonth = new Date(year, month, 0).getDate();
            setDate(lastDayOfMonth); // Set date to the last valid day of the month
        }
    }, [date, month, year]);
    const genders = {
        male: "MALE",
        female: "FEMALE",
        other: "OTHER"
    }
    const updateProfile = async () => {
        const dateOfBrith = year + "-" + (month < 10 ? `0${month}` : month) + "-" + (date < 10 ? `0${date}` : date)
        try {
            const response = await fetchWithRetry("api/user/profile", "PUT", {
                ...profile,
                dateOfBirth: dateOfBrith
            })
            if (response.status === 200) {
                setProfile(response.data)
                setSuccessfulUpdate(true)
            }
        } catch (error) {
            if (error.response?.status === 403) {
                window.location.href = "/auth"
            }
        }
    }
    const fetchProfile = async () => {
        try {
            const response = await fetchWithRetry("api/user/profile", "GET")
            if (response.status === 200) {
                setProfile(response.data)
            }
        } catch (e) {
            if (e.response?.status === 403) {
                window.location.href = "/auth"
            }
        }
    }

    useEffect(() => {
        fetchProfile().then();
    }, []);
    return (
        <div className={"sub-page profile"}>
            <div className={"profile-inputs"}>
                <div className={"profile-input-wrapper"}>
                    <div className={"input-label"}>Full Name:</div>
                    <input onChange={(event) => {
                        setProfile(prev => {
                            return {
                                ...prev, fullName: event.target.value
                            }
                        })
                    }} defaultValue={profile?.fullName}/>
                </div>
                <div className={"profile-input-wrapper"}>
                    <div className={"input-label"}>Phone:</div>
                    <input onChange={(event) => {
                        setProfile(prev => {
                            return {
                                ...prev, phone: event.target.value
                            }
                        })
                    }} defaultValue={profile?.phone}/>
                </div>
                <div className={"profile-input-wrapper"}>
                    <div className={"input-label"}>Email:</div>
                    <input onChange={(event) => {
                        setProfile(prev => {
                            return {
                                ...prev, email: event.target.value
                            }
                        })
                    }} defaultValue={profile?.email}/>
                </div>
                <div className={"profile-input-wrapper"}>
                    <div className={"input-label"}>Gender:</div>
                    <div className={"genders"}>
                        <div className={"gender"}>
                            <input onChange={(event) => {
                                if (event.target.checked) {
                                    setProfile(prev => {
                                        return {
                                            ...prev, gender: genders.male
                                        }
                                    })
                                }
                            }} checked={profile?.gender === "MALE"} name={"name"} type={"radio"}/>
                            <p>
                                Male
                            </p>
                        </div>
                        <div className={"gender"}>
                            <input onChange={(event) => {
                                if (event.target.checked) {
                                    setProfile(prev => {
                                        return {
                                            ...prev, gender: genders.female
                                        }
                                    })
                                }
                            }} checked={profile?.gender === "FEMALE"} name={"name"} type={"radio"}/>
                            <p>
                                Female
                            </p>
                        </div>
                        <div className={"gender"}>
                            <input onChange={(event) => {
                                if (event.target.checked) {
                                    setProfile(prev => {
                                        return {
                                            ...prev, gender: genders.other
                                        }
                                    })
                                }
                            }} checked={profile?.gender === "OTHER"} name={"name"} type={"radio"}/>
                            <p>
                                Other
                            </p></div>
                    </div>
                </div>
                <div className={"profile-input-wrapper date-of-birth"}>
                    <div className={"input-label"}>Date Of Birth:</div>
                    <div className={"date-of-birth"}>

                        <div className={"address-input-wrapper"}>
                            <input value={year > 0 ? year : ''} placeholder={" "}/>
                            <div className={"address-input-placeholder"}>
                                Year
                            </div>
                            <div className={"times"}>
                                {years.map(year =>
                                    <div onClick={() => {
                                        setYear(year)
                                    }} className={"time"}>{year}</div>
                                )}
                            </div>
                        </div>
                        <div className={"address-input-wrapper"}>
                            <input value={month > 0 ? month : ''} placeholder={" "}/>
                            <div className={"address-input-placeholder"}>
                                Month
                            </div>
                            <div className={"times"}>
                                {months.map(month =>
                                    <div onClick={() => {
                                        setMonth(month)
                                    }} className={"time"}>{month}</div>
                                )}
                            </div>
                        </div>
                        <div className={"address-input-wrapper"}>
                            <input value={date > 0 ? date : ''} placeholder={" "}/>
                            <div className={"address-input-placeholder"}>
                                Date
                            </div>
                            <div className={"times"}>
                                {dates.map(date =>
                                    <div onClick={() => {
                                        setDate(date)
                                    }} className={"time"}>{date}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"profile-input-wrapper"}>
                    <div className={"input-label"}></div>
                    <div className={"genders"}>
                        {
                            successfulUpdate && <p className={"updated"}>Personal information successfully updated</p>
                        }
                    </div>
                </div>

                <div className={"profile-input-wrapper save"}>
                    <div className={"input-label"}></div>
                    <button onClick={() => {
                        updateProfile().then()
                    }} className={"save-profile"}>
                        Save
                    </button>
                </div>
            </div>
            <div className={"profile-image"}>
                {profile?.profilePicture ?
                    <img src={profile?.profilePicture}/>
                    : defaultProfilePicture()}
                <div className={"choose-image"}>
                    <input type={"file"}/>
                    Choose Image
                </div>
            </div>
        </div>)
        ;
};

const GoldTier = () => (
    <g>
        <path
            style={{fill: "#F41943"}}
            d="M170.138,211.293v99.599c0,6.514-7.212,10.426-12.695,6.923l-24.392-15.68L112.45,288.89l-20.606,13.246l-24.392,15.68c-5.478,3.503-12.69-0.409-12.69-6.923v-99.599H170.138z"
        />
        <polygon
            style={{fill: "#EBF2F2"}}
            points="133.05,211.293 133.05,302.136 112.45,288.89 91.844,302.136 91.844,211.293"
        />
        <path
            style={{fill: "#C6123D"}}
            d="M170.138,211.293v12.837c-7.927,5.467-20.901,12.925-37.088,16.858v-29.695H170.138z"
        />
        <path
            style={{fill: "#C3DBDA"}}
            d="M133.05,211.293v29.695c-6.798,1.659-14.168,2.69-21.965,2.69c-6.803,0-13.241-0.802-19.242-2.122v-30.263H133.05z"
        />
        <path
            style={{fill: "#C6123D"}}
            d="M91.844,211.293v30.263c-15.963-3.53-28.822-10.759-37.082-16.476v-13.786H91.844z"
        />
        <circle style={{fill: "#F9B906"}} cx="112.448" cy="151.271" r="85.448"/>
        <circle style={{fill: "#E8A615"}} cx="112.448" cy="151.271" r="77.85"/>
        <path
            style={{fill: "#F9B906"}}
            d="M185.534,151.27c0,40.301-32.783,73.09-73.084,73.09c-11.43,0-22.254-2.635-31.894-7.332c-10.06-4.899-18.833-12.035-25.669-20.764c-3.121-3.983-5.838-8.298-8.091-12.886c-4.757-9.695-7.436-20.595-7.436-32.107c0-8.538,1.473-16.733,4.174-24.354c8.134-22.958,27.437-40.672,51.338-46.592c5.63-1.397,11.522-2.139,17.578-2.139c13.481,0,26.116,3.666,36.968,10.055c4.839,2.853,9.324,6.241,13.372,10.093c7.632,7.262,13.699,16.149,17.638,26.105C183.723,132.748,185.534,141.799,185.534,151.27z"
        />
        <path
            style={{fill: "#FFC943"}}
            d="M149.418,88.24L46.796,183.377c-4.757-9.695-7.436-20.595-7.436-32.107c0-8.538,1.473-16.733,4.174-24.354l51.338-46.592c5.63-1.397,11.522-2.139,17.578-2.139C125.931,78.186,138.566,81.852,149.418,88.24z"
        />
        <path
            style={{fill: "#FFC943"}}
            d="M180.428,124.439l-99.872,92.588c-10.06-4.899-18.833-12.035-25.669-20.764l107.903-97.93C170.422,105.595,176.489,114.482,180.428,124.439z"
        />
    </g>
);

const SilverTier = () => (
    <g>
        <path
            style={{fill: "#F41943"}}
            d="M357.69,211.293v99.599c0,6.514-7.212,10.426-12.695,6.923l-24.392-15.68l-20.601-13.246l-20.606,13.246l-24.392,15.68c-5.478,3.503-12.69-0.409-12.69-6.923v-99.599H357.69z"
        />
        <polygon
            style={{fill: "#EBF2F2"}}
            points="320.602,211.293 320.602,302.136 300.002,288.89 279.395,302.136 279.395,211.293"
        />
        <path
            style={{fill: "#C6123D"}}
            d="M357.69,211.293v12.837c-7.927,5.467-20.901,12.925-37.088,16.858v-29.695H357.69z"
        />
        <path
            style={{fill: "#C3DBDA"}}
            d="M320.602,211.293v29.695c-6.798,1.659-14.168,2.69-21.965,2.69c-6.803,0-13.241-0.802-19.242-2.122v-30.263H320.602z"
        />
        <path
            style={{fill: "#C6123D"}}
            d="M279.395,211.293v30.263c-15.963-3.53-28.822-10.759-37.082-16.476v-13.786H279.395z"
        />
        <circle style={{fill: "#EBF2F2"}} cx="300" cy="151.271" r="85.448"/>
        <circle style={{fill: "#C3DBDA"}} cx="300" cy="151.271" r="77.85"/>
        <path
            style={{fill: "#EBF2F2"}}
            d="M373.086,151.27c0,40.301-32.783,73.09-73.084,73.09c-11.43,0-22.254-2.635-31.894-7.332c-10.06-4.899-18.833-12.035-25.669-20.764c-3.121-3.983-5.838-8.298-8.091-12.886c-4.757-9.695-7.436-20.595-7.436-32.107c0-8.538,1.473-16.733,4.174-24.354c8.134-22.958,27.437-40.672,51.338-46.592c5.63-1.397,11.522-2.139,17.578-2.139c13.481,0,26.116,3.666,36.968,10.055c4.839,2.853,9.324,6.241,13.372,10.093c7.633,7.262,13.699,16.149,17.638,26.105C371.275,132.748,373.086,141.799,373.086,151.27z"
        />
        <path
            style={{fill: "#FFFFFF"}}
            d="M336.969,88.24l-102.622,95.136c-4.757-9.695-7.436-20.595-7.436-32.107c0-8.538,1.473-16.733,4.174-24.354l51.338-46.592c5.63-1.397,11.522-2.139,17.578-2.139C313.483,78.186,326.118,81.852,336.969,88.24z"
        />
        <path
            style={{fill: "#FFFFFF"}}
            d="M367.979,124.439l-99.872,92.588c-10.06-4.899-18.833-12.035-25.669-20.764l107.903-97.93C357.974,105.595,364.04,114.482,367.979,124.439z"
        />
    </g>
);

const BronzeTier = () => (
    <g>
        <path
            style={{fill: "#F41943"}}
            d="M545.242,211.293v99.599c0,6.514-7.212,10.426-12.695,6.923l-24.392-15.68l-20.601-13.246l-20.606,13.246l-24.392,15.68c-5.478,3.503-12.69-0.409-12.69-6.923v-99.599H545.242z"
        />
        <polygon
            style={{fill: "#EBF2F2"}}
            points="508.154,211.293 508.154,302.136 487.553,288.89 466.947,302.136 466.947,211.293"
        />
        <path
            style={{fill: "#C6123D"}}
            d="M545.242,211.293v12.837c-7.927,5.467-20.901,12.925-37.088,16.858v-29.695H545.242z"
        />
        <path
            style={{fill: "#C3DBDA"}}
            d="M508.154,211.293v29.695c-6.798,1.659-14.168,2.69-21.965,2.69c-6.803,0-13.241-0.802-19.242-2.122v-30.263H508.154z"
        />
        <path
            style={{fill: "#C6123D"}}
            d="M466.947,211.293v30.263c-15.963-3.53-28.822-10.759-37.082-16.476v-13.786H466.947z"
        />
        <circle style={{fill: "#E37F22"}} cx="487.552" cy="151.271" r="85.448"/>
        <circle style={{fill: "#BA6017"}} cx="487.552" cy="151.271" r="77.85"/>
        <path
            style={{fill: "#E37F22"}}
            d="M560.638,151.27c0,40.301-32.783,73.09-73.084,73.09c-11.43,0-22.254-2.635-31.894-7.332c-10.06-4.899-18.833-12.035-25.669-20.764c-3.121-3.983-5.838-8.298-8.091-12.886c-4.757-9.695-7.436-20.595-7.436-32.107c0-8.538,1.473-16.733,4.174-24.354c8.134-22.958,27.437-40.672,51.338-46.592c5.63-1.397,11.522-2.139,17.578-2.139c13.481,0,26.116,3.666,36.968,10.055c4.839,2.853,9.324,6.241,13.372,10.093c7.633,7.262,13.699,16.149,17.638,26.105C558.826,132.748,560.638,141.799,560.638,151.27z"
        />
        <path
            style={{fill: "#F79A4D"}}
            d="M524.521,88.24L421.9,183.377c-4.757-9.695-7.436-20.595-7.436-32.107c0-8.538,1.473-16.733,4.174-24.354l51.338-46.592c5.63-1.397,11.522-2.139,17.578-2.139C501.034,78.186,513.67,81.852,524.521,88.24z"
        />
        <path
            style={{fill: "#F79A4D"}}
            d="M555.531,124.439l-99.872,92.588c-10.06-4.899-18.833-12.035-25.669-20.764l107.903-97.93C545.525,105.595,551.592,114.482,555.531,124.439z"
        />
    </g>
);

export default SubPageProfile;