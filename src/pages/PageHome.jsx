import React from 'react';
import {Link} from "react-router-dom";
import {axiosClient} from "../components/axiosClient";
import Footer from "../components/Footer";
import FeaturedSection from "../components/FeaturedSection";
import PageWrapper from "../components/PageWrapper";

const PageHome = () => {
    const fetchRandomProduct = async () => {
        try {
            const response = await axiosClient.get("/api/books/random");
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return []
        }
    }

    return (
        <PageWrapper>
            <div className={"poster"}>
                <img
                    src={"https://cdn.builder.io/api/v1/image/assets%2F12cbceb6be9648e2a8a23b8c10684f0b%2Fc06138a3074e4537b2599341e65af613?format=webp&width=2000"}/>
                <div className={"banner-middle"}>
                    <p>
                        MORE BOOKS
                    </p>
                    <p>
                        LESS BUCKS
                    </p>
                    <div className={"buttons"}>
                        <Link to={"/"}>Shop Now</Link>
                        <Link to={"/"}>View Cart</Link>
                    </div>
                </div>
                <img
                    src={"https://cdn.builder.io/api/v1/image/assets%2F12cbceb6be9648e2a8a23b8c10684f0b%2F2cc69396af4f427db6781544871884bd?format=webp&width=2000"}/>
            </div>
            <div className={"page-content page-home"}>
                {/*<FeaturedSection number={5} header={"RECENTLY VIEWED ITEMS"}/>*/}
                {/*<FeaturedSection number={5} header={"RECOMMENDED ITEMS"}/>*/}
                {/*<FeaturedSection number={5} header={"NEW THIS WEEK"}/>*/}
            </div>
        </PageWrapper>
    );
};

export default PageHome;