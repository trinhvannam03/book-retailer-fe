import React, {useState} from 'react';
import {HeartOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {axiosClient, fetchWithRetry} from "./axiosClient";
import {useCart} from "../context/CartContext";
import RippleButton from "./RippleButton";

const ProductBrief = ({book, id}) => {
    const {addToCart} = useCart();
    return (<>
        {<div className={"product-brief"}>
            <Link to={`/book/${book?.id}`} className={"product-image"}>
                <img src={book?.bookCover || book?.book_cover}/>
            </Link>
            <div className={"product-details"}>
                <p>
                    {book?.title}
                </p>

                <div className={"binding-type"}>{book?.coverType?.toUpperCase()}</div>
                <div className={"price"}>
                    ${book?.price.toFixed(2)}
                </div>
                <div className={"buttons brief"}>
                    <RippleButton onClick={() => {
                        addToCart({
                            book_id: Number(book?.id),
                            quantity: 1,
                            title: book?.title
                        });
                    }}>
                        Add to Cart
                    </RippleButton>
                    <div className={"wish"}>
                        <HeartOutlined/></div>
                </div>
            </div>
        </div>}
    </>);
};

export default ProductBrief;