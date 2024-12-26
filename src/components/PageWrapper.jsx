import React from 'react';
import Navbar from "./Navbar";
import {Outlet} from "react-router-dom";
import Footer from "./Footer";
import {ScrollToTop} from "./axiosClient";

const PageWrapper = ({children, suffix}) => {
    return (

        <div className={`page ${suffix}`}>
            <ScrollToTop/>
            <Navbar></Navbar>
            <Outlet/>
            {children}
            <Footer/>
        </div>
    );
};
export default PageWrapper;