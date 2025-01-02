import React, {useCallback, useEffect, useState} from 'react';
import {axiosClient} from "./axiosClient";
import {BsChevronLeft, BsChevronRight} from "react-icons/bs";
import ProductBrief from "./ProductDisplay";

const FeaturedSection = ({header, fetchUrl, number}) => {
    const [books, setBooks] = useState([])
    const fetchData = useCallback(async () => {
        if (fetchUrl) {
            try {
                const response = await axiosClient.get(fetchUrl)
                if (response.status === 200) {
                    setBooks(response.data);
                }
            } catch (e) {

            }
        }
    }, [fetchUrl]);

    useEffect(() => {
        fetchData().then();
    }, [fetchData]);

    return (
        <div className={"featured-section"}>
            {
                header &&
                <div className={"featured-section-header"}>
                    {header && header}
                </div>
            }
            <div className={"featured-section-products"}>
                <div className={'to left'}>
                    <BsChevronLeft/>
                </div>
                {
                    books?.slice(0, number ? number : 5).map(book => <ProductBrief id={book?.bookId}
                        book={book}/>)
                }
                <div className={'to right'}>
                    <BsChevronRight/>
                </div>
            </div>
        </div>
    )

}
export default FeaturedSection;