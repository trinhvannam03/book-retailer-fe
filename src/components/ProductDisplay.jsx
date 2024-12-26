import React, {useState} from 'react';
import {HeartOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {axiosClient, fetchWithRetry} from "./axiosClient";
import {useCart} from "../context/CartContext";

const ProductBrief = ({book}) => {
    const {addToCart} = useCart();
    return (<>

        {<div className={"product-brief"}>
            <Link to={`/book/${book?.isbn}`} className={"product-image"}>
                <img src={book?.bookCover}/>
            </Link>
            <div className={"product-details"}>
                <p>
                    {book?.title}
                </p>
                <div className={"price"}>
                    Available: {book?.stock}
                </div>
                <div className={"binding-type"}>{book?.coverType?.toUpperCase()}</div>

                <div className={"price"}>
                    ${book?.price}
                </div>
                <div className={"buttons"}>
                    <button onClick={() => {
                        addToCart({
                            book_id: book.id,
                            quantity: 1,
                            bookCover: book.bookCover,
                            title: book.title
                        });
                    }}>
                        Add to Cart
                    </button>
                    <div className={"wish"}>
                        <HeartOutlined/></div>
                </div>
            </div>
        </div>}
    </>);
};

export default ProductBrief;