import React, {useCallback, useState} from 'react';
import Navbar from "../../components/Navbar";
import {Link, Outlet, useParams} from "react-router-dom";
import Footer from "../../components/Footer";
import clsx from "clsx";

const PageAccount = () => {
    const {page} = useParams();
    const [current, setCurrent] = useState(1);
    const returnStyle = useCallback(() => {
        const percentage = (Number(current) - 1) * 25 + "%"
        return {
            left: percentage
        }
    }, [current]);
    return (
        <div className={"page"}>
            <Navbar/>
            <div className={"page-content page-account"}>
                <div className={"page-content-header"}>
                    <p>Your Account</p>
                </div>
                <div className={"main-content"}>
                    <div className={"section-buttons"}>
                        <Link to="profile" className={clsx({"section-button": true, "selected": current === 1})}
                              onClick={() => {
                                  setCurrent(1)
                              }}>Your Profile
                        </Link>
                        <Link to="orders" onClick={() => {
                            setCurrent(2)
                        }} className={clsx({"section-button": true, "selected": current === 2})}>Your Orders
                        </Link>

                        <Link to="password" onClick={() => {
                            setCurrent(3)
                        }} className={clsx({"section-button": true, "selected": current === 3})}>Change Password
                        </Link>
                        <Link to="sessions" onClick={() => {
                            setCurrent(4)
                        }} className={clsx({"section-button": true, "selected": current === 4})}>My Sign-ins
                        </Link>
                        <div className={"slider"}>
                            <div className={clsx({"slider-object": true})} style={returnStyle()}>
                            </div>
                        </div>
                    </div>
                    <div className={"sub-pages"}>
                        <Outlet/>
                    </div>
                </div>

            </div>
            <Footer/>
        </div>);
};

export default PageAccount;