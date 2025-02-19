import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import Checkbox from "../components/Checkbox";
import {axiosClient} from "../components/axiosClient";
import PageWrapper from "../components/PageWrapper";
import {oauthURL, useAuthentication} from "../context/AuthenticationContext";

const PageAuth = () => {
    const [switcher, setSwitcher] = useState(false);
    return (<PageWrapper>
        <div className={"page-content page-auth"}>
            <div className={"forms-wrapper"}>
                <div className={"switcher"}>
                    <button style={switcher ? undefined : styles.selected} onClick={() => {
                        setSwitcher(false)
                    }}>SIGN IN
                    </button>
                    <button style={switcher ? styles.selected : undefined} onClick={() => {
                        setSwitcher(true)
                    }}>CREATE ACCOUNT
                    </button>
                    <div className={"glider"}>
                        <div style={!switcher ? styles.login : undefined} className={"slider"}>
                        </div>
                    </div>
                </div>
                <div className={`forms`}>
                    <LoginForm switcher={switcher}/>
                    <RegisterForm/>
                </div>
            </div>
        </div>
    </PageWrapper>);
};
const LoginForm = ({switcher}) => {
    const [messages, setMessages] = useState({})
    const {browser} = useAuthentication()
    const [identifier, setIdentifier] = useState(undefined)
    const [password, setPassword] = useState(undefined)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^(\s*(09|05|03|08|07)\s*\d{8})$|^(\s*84\s*(9|5|3|8|7)\s*\d{8})$/;
    const [debounceIdentifier, setDebounceIdentifier] = useState(undefined)
    const [debouncePassword, setDebouncePassword] = useState(undefined);
    const [identifierValid, setIdentifierValid] = useState(false);
    const [status, setStatus] = useState("");
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceIdentifier(identifier)
        }, 500)
        return () => {
            clearTimeout(handler)
        }
    }, [identifier]);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncePassword(password)
        }, 500)
        return () => {
            clearTimeout(handler)
        }
    }, [password]);
    useEffect(() => {
        if (debouncePassword !== undefined) {
            setMessages(prev => {
                if (debouncePassword.trim() === "") {
                    return {
                        ...prev, password: "This field is required!"
                    }
                } else {
                    try {
                        const {password, ...rest} = prev
                        return rest;
                    } catch (error) {
                        return prev
                    }
                }
            })
        }
    }, [debouncePassword]);
    useEffect(() => {
        if (debounceIdentifier !== undefined) {
            setMessages((prevState) => {
                if (debounceIdentifier.trim().length === 0) {
                    setIdentifierValid(false);
                    return {
                        ...prevState, identifier: "This field is required"
                    }
                } else if (!emailRegex.test(debounceIdentifier) && !phoneRegex.test(debounceIdentifier)) {
                    setIdentifierValid(false);
                    return {
                        ...prevState, identifier: "Invalid email/phone format!"
                    }
                } else {
                    setIdentifierValid(true);
                }
            })
        }
    }, [debounceIdentifier, emailRegex, phoneRegex]);
    const redirectURL = oauthURL
    const login = async () => {
        try {
            const response = await axiosClient.post("/auth/login", {
                identifier, password, ...browser
            });
            if (response.status === 200) {
                const {
                    accessToken, refreshToken, session
                } = response.data
                localStorage.setItem("access_token", accessToken)
                localStorage.setItem("refresh_token", refreshToken);
                localStorage.setItem("session", JSON.stringify(session));
                window.location.href = "http://localhost:3000/"
            }
        } catch (error) {
            setStatus("Invalid identifier/password")
            setTimeout(() => {
                setStatus(undefined)
            }, 2000)
        }
    }
    return (<div className={`form login ${!switcher && "switched"}`}>
        <div className={"wrapper"}>
            <div className={"title"}>
                Sign In
            </div>
            <div className="input-wrapper">
                <input
                    onChange={(event) => {
                        setIdentifier(event.target.value)
                    }}
                    className="input-field"
                    placeholder=" "
                    required
                />
                <div className="input-placeholder">Your Email Or Phone*</div>
            </div>
            <div className={"message"}>
                {messages && messages.identifier}
            </div>
            <div className="input-wrapper">
                <input onChange={(event) => {
                    setPassword(event.target.value)
                }}
                       className="input-field"
                       placeholder=" "
                       required/>
                <div className="input-placeholder">Password*</div>
            </div>
            <div className={"message"}>
                {messages && messages.password}
            </div>
            <Link to={"/"}>Forgot Password?</Link>
            <>
                <div className={"remember-me"}>
                    <Checkbox/>
                    Remember Me
                </div>
                <button disabled={!identifierValid || password === undefined || password.trim() === ""}
                        onClick={() => {
                            login();
                        }}>Sign In
                </button>
                <div className={"message"}>{status}</div>
                <div className={"or"}>
                    <div></div>
                    or
                    <div></div>
                </div>
                <div className={"oauths"}>
                    <div onClick={() => {
                        // Opens a new tab with the specified URL
                        window.open(redirectURL, '_blank');
                    }} className={"oauth google"}>
                        <Google/> Google
                    </div>
                    <div className={"oauth facebook"}>
                        <Facebook/>Facebook
                    </div>
                </div>
            </>
        </div>
    </div>)
}
const RegisterForm = () => {
    const requiredFieldMessage = "This field is required"
    const [password, setPassword] = useState(undefined);
    const [confirmedPassword, setConfirmedPassword] = useState(undefined);
    const [email, setEmail] = useState(undefined)
    const validateEmail = async () => {
        try {
            const response = await axiosClient.post("auth/validate_email", {email})
            if (response.status === 200) {
                setMessages(prev => {
                    return {...prev, email: response.data.email}
                })
            }
        } catch (error) {

        }
    }
    const [fullName, setFullName] = useState(undefined)
    useEffect(() => {
        const message = "Name must be at least two words long"
        const nameRegex = /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/;
        const handler = setTimeout(() => {
            setMessages(prev => {
                return {
                    ...prev, fullName: undefined
                }
            })
            if (fullName?.length > 0) {
                if (!nameRegex.test(fullName)) {
                    setMessages(prev => {
                        return {
                            ...prev, fullName: message
                        }
                    })
                }
            } else if (fullName?.length === 0) {
                setMessages(prev => {
                    return {
                        ...prev, fullName: requiredFieldMessage
                    }
                })
            }
        }, 300)
        return () => {
            clearTimeout(handler)
        }
    }, [fullName]);
    useEffect(() => {
        const message = "Invalid email"
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const handler = setTimeout(() => {
            setMessages(prev => {
                return {
                    ...prev, email: undefined
                }
            })
            if (email?.length > 0) {
                if (!emailRegex.test(email)) {
                    setMessages(prev => {
                        return {
                            ...prev, email: message
                        }
                    })
                } else {
                    validateEmail().then()
                }
            } else if (email?.length === 0) {
                setMessages(prev => {
                    return {
                        ...prev, email: requiredFieldMessage
                    }
                })
            }
        }, 300)
        return () => {
            clearTimeout(handler)
        }
    }, [email]);
    useEffect(() => {
        const message = "Password must be at least 6 characters long" + " and contain at least one uppercase letter and one digit."
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        const handler = setTimeout(() => {
            setMessages(prev => {
                return {
                    ...prev, password: undefined
                }
            })
            if (password?.length > 0) {
                if (!passwordRegex.test(password)) {
                    setMessages(prev => {
                        return {
                            ...prev, password: message
                        }
                    })
                }
            } else if (password?.length === 0) {
                setMessages(prev => {
                    return {
                        ...prev, password: requiredFieldMessage
                    }
                })
            }
        }, 300)
        return () => {
            clearTimeout(handler)
        }
    }, [password]);
    useEffect(() => {
        const message = "Password must match confirmed password"
        const handler = setTimeout(() => {
            setMessages(prev => {
                return {
                    ...prev, confirmedPassword: undefined
                }
            })
            if (password?.length > 0) {
                if (confirmedPassword?.length > 0) {
                    if (confirmedPassword !== password) {
                        setMessages(prev => {
                            return {
                                ...prev, confirmedPassword: message
                            }
                        })
                    }
                } else if (confirmedPassword?.length === 0) {
                    setMessages(prev => {
                        return {
                            ...prev, confirmedPassword: requiredFieldMessage
                        }
                    })
                }
            }

        }, 300)
        return () => {
            clearTimeout(handler)
        }
    }, [confirmedPassword, password]);
    const [messages, setMessages] = useState({});
    const submit = async () => {
        try {
            const response = await axiosClient.post("/auth/register", {
                password, email, fullName, confirmedPassword
            });
            if (response.status === 200) {
                const {
                    accessToken, refreshToken, session
                } = response.data
                localStorage.setItem("access_token", accessToken)
                localStorage.setItem("refresh_token", refreshToken);
                localStorage.setItem("session", JSON.stringify(session));
                window.location.href = "localhost:3000/"
            }
        } catch (error) {
            if (error.response?.status === 400) {

            }
        }
    }

    return (<div className={`form register`}>
        <div className={"wrapper"}>
            <div className={"title"}>
                Register
            </div>
            <>
                <div className="input-wrapper">
                    <input
                        onChange={(event) => {
                            setFullName(event.target.value)
                        }}
                        className="input-field"
                        placeholder=" "
                        required
                    />
                    <div className="input-placeholder">Full Name*</div>
                </div>
                <div
                    className={"message"}>{messages?.fullName}</div>
                <div className="input-wrapper">
                    <input
                        onChange={(event) => {
                            setEmail(event.target.value)
                        }}
                        className="input-field"
                        placeholder=" "
                        required
                    />
                    <div className="input-placeholder">Email*</div>
                </div>
                <div
                    className={"message"}>{messages?.email}</div>

                <div className="input-wrapper">
                    <input
                        type={"password"}
                        onChange={(event) => {
                            setPassword(event.target.value)
                        }}
                        className="input-field"
                        placeholder=" "
                        required
                    />
                    <div className="input-placeholder">Password*</div>
                </div>
                <div
                    className={"message"}>{messages?.password}</div>

                <div className="input-wrapper">
                    <input type={"password"}
                           onChange={(event) => {
                               setConfirmedPassword(event.target.value)
                           }}
                           className="input-field"
                           placeholder=" "
                           required
                    />
                    <div className="input-placeholder">Confirm Password*</div>
                </div>
                <div
                    className={"message"}>{messages?.confirmedPassword}</div>
            </>
            <>
                <div className={"subscribe"}>
                    <Checkbox/>
                    <div className={"check"}>
                        <div>
                            Subscribe to Newsletter
                        </div>
                        <p>
                            Be the first to know about sales, new arrivals & more!
                        </p>
                    </div>
                </div>
                <div className={"agreement"}>
                    <Checkbox/>
                    <div>
                        By creating an account, you are agreeing to our <span><a
                        href={"https://bookoutlet.com/privacy-policy"}>Privacy Policy</a></span> and
                        our <span><a href={"https://bookoutlet.com/privacy-policy"}>Terms
                                of Service</a></span> for the Book Outlet Rewards program.
                    </div>
                </div>
                <button onClick={() => {
                    submit().then();
                }}>Submit
                </button>
                <div className={"or"}>
                    <div></div>
                    or
                    <div></div>
                </div>
                <div className={"oauths"}>
                    <div className={"oauth google"}>
                        <Google/> Google
                    </div>
                    <div className={"oauth facebook"}>
                        <Facebook/>Facebook
                    </div>
                </div>
            </>
        </div>
    </div>)
}
const Google = () => (<svg
    xmlns="http://www.w3.org/2000/svg"
    style={{display: 'block'}}
    viewBox="0 0 46 46"
>
    <defs>
        <filter
            id="a"
            width="200%"
            height="200%"
            x="-50%"
            y="-50%"
            filterUnits="objectBoundingBox"
        >
            <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/>
            <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation=".5"/>
            <feColorMatrix
                in="shadowBlurOuter1"
                result="shadowMatrixOuter1"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.168 0"
            />
            <feOffset in="SourceAlpha" result="shadowOffsetOuter2"/>
            <feGaussianBlur in="shadowOffsetOuter2" result="shadowBlurOuter2" stdDeviation=".5"/>
            <feColorMatrix
                in="shadowBlurOuter2"
                result="shadowMatrixOuter2"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.084 0"
            />
            <feMerge>
                <feMergeNode in="shadowMatrixOuter1"/>
                <feMergeNode in="shadowMatrixOuter2"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
    <g fill="none" fillRule="evenodd">
        <g filter="url(#a)" transform="translate(3 3)">
            <use fill="#FFF"/>
            <use/>
            <use/>
            <use/>
        </g>
        <path
            fill="#4285F4"
            d="m31.6 23.2-.1-1.8H23v3.4h4.8C27.6 26 27 27 26 27.6v2.2h3a8.8 8.8 0 0 0 2.6-6.6Z"
        />
        <path
            fill="#34A853"
            d="M23 32c2.4 0 4.5-.8 6-2.2l-3-2.2a5.4 5.4 0 0 1-8-2.9h-3V27a9 9 0 0 0 8 5Z"
        />
        <path
            fill="#FBBC05"
            d="M18 24.7a5.4 5.4 0 0 1 0-3.4V19h-3a9 9 0 0 0 0 8l3-2.3Z"
        />
        <path
            fill="#EA4335"
            d="M23 17.6c1.3 0 2.5.4 3.4 1.3l2.6-2.6A9 9 0 0 0 15 19l3 2.4a5.4 5.4 0 0 1 5-3.7Z"
        />
        <path d="M14 14h18v18H14V14Z"/>
    </g>
</svg>);
const styles = {
    login: {
        left: 0
    }, selected: {
        color: "#d1282f", fontWeight: 'bolder', backgroundColor: "#f4f4f4"
    }, formsLogin: {
        left: 0
    }
}
const Facebook = () => (<svg
    aria-hidden="true"
    className="MuiSvgIcon-root"
    style={{
        filter: 'invert(1)', // This will invert the colors of the SVG
    }}
    width='25px'
    viewBox="0 0 24 24"
>
    <path
        d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z"/>
</svg>);
export default PageAuth;