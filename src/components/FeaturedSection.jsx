import React, {useEffect, useState} from 'react';
import {axiosClient} from "./axiosClient";
import {BsChevronLeft, BsChevronRight} from "react-icons/bs";
import ProductBrief from "./ProductDisplay";
import {useCart} from "../context/CartContext";

const FeaturedSection = ({header, fetchRandomProduct, number}) => {
    const [products, setProducts] = useState([])
    const fetchRandom = async () => {
        try {
            const response = await axiosClient.get("/api/books/random");
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            return []
        }
    }
    const fetchData = async () => {
        if (fetchRandomProduct) {
            const data = await fetchRandomProduct();
            setProducts(data);
        } else {
            const data = await axiosClient.get("/api/books/random");
            if (data.status === 200) {
                setProducts(data.data);
            }
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

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
                    products && products.slice(0, number ? number : 5).map(product => <ProductBrief
                        book={product}/>)
                }
                <div className={'to right'}>
                    <BsChevronRight/>
                </div>
            </div>
        </div>
    )

}
export default FeaturedSection;