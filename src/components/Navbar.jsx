import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {IoSearch} from "react-icons/io5";
import {axiosClient} from "./axiosClient";
import logo from "../images/0b6c68ac-b240-4f34-92be-9945fb90d12d.png"
import {useAuthentication} from "../context/AuthenticationContext";
import {useCart} from "../context/CartContext";
import profilePicture from "../images/images.png"
import no_result from "../images/no-result-found.jpg"
import clsx from "clsx";
import ProductBrief from "./ProductDisplay";

export const defaultProfilePicture = () => {
    return (
        <>
            <img src={profilePicture}/>
        </>
    )
}
const Navbar = ({redirect}) => {
    const inputRef = useRef(null);
    const [focused, setFocused] = useState(false);
    const [accountActionsShown, setAccountActionsShown] = useState(false);
    const [keyword, setKeyword] = useState(undefined);
    const navigate = useNavigate();
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter" && focused) {
                // Navigate to the search page without reload
                navigate(`/search?keyword=${keyword}`);
                if (inputRef.current) {
                    inputRef.current.blur(); // Trigger the blur event
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            // Cleanup the event listener
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [focused, keyword, navigate]);
    const [searchResult, setSearchResult] = useState(undefined)
    useEffect(() => {
        const handler = setTimeout(async () => {
            if (keyword) {
                try {
                    const response = await axiosClient.get(`/api/books/search?keyword=${keyword}`);
                    if (response.status === 200) {
                        setSearchResult(response.data)
                    }
                } catch (error) {
                    setSearchResult([])
                    console.error(error)
                }
            }
        }, 100)
        return () => {
            clearTimeout(handler)
        }
    }, [keyword]);

    const {isAuthenticated, profile, logout} = useAuthentication();
    const {records} = useCart();

    const alt = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnSA1zygA3rubv-VK0DrVcQ02Po79kJhXo_A&s"
    return (<>
        <>
            <div className={"navbar top"}>
                <div className={"top-left"}>
                    <div className={"section"}>
                        {isAuthenticated ?
                            <>
                                <img
                                    src={profile.profilePicture ? profile.profilePicture : alt}/>
                                Hello, {profile.fullName}
                                <div className={`account-actions ${accountActionsShown && "shown"}`}>
                                    <div className={'button'}>
                                        <button onClick={() => {
                                            const session = JSON.parse(localStorage.getItem("session"))
                                            logout(session).then()
                                        }}>Sign Out
                                        </button>
                                    </div>
                                    <Link to={"/user/profile"} className={"account-action"}>Profile</Link>
                                    <Link to={"/user/orders"} className={"account-action"}>Orders</Link>
                                    <Link to={"/user/password"} className={"account-action"}>Change Password</Link>
                                </div>
                            </> :
                            <>
                                <Link to={"/auth"} className={"section"}>Sign In
                                </Link>
                            </>}

                    </div>
                    <Link to={"/"} className={"section"}>Refer a Friend
                    </Link>
                    <Link to={"/"} className={"section"}>My Wishlist</Link>
                </div>
                <div className={"top-right"}>
                    <div className={"section language"}>
                        <p><img
                            src={"https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/United-states_flag_icon_round.svg/1024px-United-states_flag_icon_round.svg.png"}/>
                            <div>USD</div>
                        </p>

                    </div>
                </div>
            </div>
            <div className={"navbar middle"}>
                <div className={"business-logo"}>
                    <Link to={"/"}>
                        <img src={logo}/>
                    </Link>
                </div>
                <div className={"search-section"}>
                    <div className={clsx({"search-wrapper": true, "focused": focused})}>
                        <div className={`searchbar`}>
                            <input ref={inputRef} placeholder={"What are your looking for?"}
                                   onChange={(event) => {
                                       setTimeout(() => {
                                           setKeyword(event.target.value)
                                       }, 500)
                                   }}
                                   onFocus={() => {
                                       setFocused(true)
                                   }}
                                   onBlur={() => {
                                       setTimeout(() => {
                                           setFocused(false)
                                           if (keyword?.length === 0) {
                                               setSearchResult(undefined)
                                           }
                                       }, 200)
                                   }}/>
                            <div className={`searchbutton ${focused && " focused"}`}>
                                <IoSearch/>
                            </div>
                        </div>
                        {keyword && searchResult &&
                            <div className={"search-results"}>
                                {
                                    searchResult?.length > 0 ?
                                        <>
                                            <div className={"result-header"}>
                                                <p> Most Relevant Results </p>
                                                <Link to={`/search?keyword=${keyword}`}>Show All</Link>
                                            </div>
                                            <div className={"results"}>
                                                {searchResult.slice(0, 6).map(r => <SearchResult result={r}/>)}
                                            </div>
                                        </>
                                        :
                                        <>
                                            <img className={"no-result"} src={no_result}/>
                                        </>
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className={"cart-section"}>
                    <Link to={"/wishlist"}>
                        <WishlistSvg/>
                    </Link>
                    <Link to={"/cart"}>
                        <CartSvg/>
                        <div className={"number"}>
                            {
                                records &&
                                records.size}
                        </div>
                    </Link>
                </div>
                <div className="loading-line"></div>
            </div>
            <div className={"navbar bottom normal"}>
                <div className={`section`}>
                    <p>All Categories</p>
                    <div className={"underline"}></div>
                </div>
                <div className={"section"}>
                    <p>Fiction</p>
                    <div className={"underline"}></div>
                </div>
                <div className={"section"}>
                    <p>Non Fiction</p>
                    <div className={"underline"}></div>
                </div>
                <div className={"section"}>
                    <p>Teen & Young Adults</p>
                    <div className={"underline"}></div>
                </div>
                <div className={"section"}>
                    <p>Kids</p>
                    <div className={"underline"}></div>
                </div>
                <div className={"section"}>
                    <p>Flash Sales</p>
                    <div className={"underline"}></div>
                </div>
            </div>
        </>
    </>)
        ;
};

const SearchResult = ({result}) => {
    return (
        <Link to={`/book/${result?.id}`} className={"result"}>
            <div className={"result-image"}>
                <img src={result?.book_cover} alt={"/"}/>
            </div>
            <div className={"result-details"}>
                <p>{result?.title}</p>
                <h4>${result?.price.toFixed(2)}</h4>
            </div>
        </Link>)
}
export const WishlistSvg = () => {
    return (<svg aria-hidden="true" className="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge"
                 style={{color: "#444950"}}
                 viewBox="0 0 24 24"
    >
        <path
            d="M16.5 3A6 6 0 0 0 12 5a6 6 0 0 0-4.5-2C4.5 3 2 5.4 2 8.5c0 3.8 3.4 6.9 8.6 11.5l1.4 1.4 1.4-1.4c5.2-4.6 8.6-7.7 8.6-11.5 0-3-2.4-5.5-5.5-5.5zm-4.4 15.6h-.2C7.1 14.2 4 11.4 4 8.5 4 6.5 5.5 5 7.5 5c1.5 0 3 1 3.6 2.4h1.8C13.5 6 15 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.9-3.1 5.7-7.9 10z"/>
    </svg>)
}


const CartSvg = () => {
    return (<svg aria-hidden="true" className="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge"
                 style={{color: "#444950"}}
                 viewBox="0 0 24 24"
    >

        <path
            d="M15.6 13a2 2 0 0 0 1.7-1l3.6-6.5A1 1 0 0 0 20 4H5.2l-1-2H1v2h2l3.6 7.6L5.2 14A2 2 0 0 0 7 17h12v-2H7l1.1-2h7.5zM6.2 6h12.1l-2.7 5h-7L6.1 6zM7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
    </svg>)
}
export default Navbar;