import React, {useEffect, useState} from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {Link} from "react-router-dom";
import {FaCheck} from "react-icons/fa";
import {useCart} from "../context/CartContext";
import FeaturedSection from "../components/FeaturedSection";
import clsx from "clsx";
import {ScrollToTop} from "../components/axiosClient";

const Item = ({record}) => {
    const {deleteFromCart, checkedItems, checkItem, updateCart} = useCart();
    const [quantity, setQuantity] = useState(record.quantity);
    useEffect(() => {
        const update = setTimeout(() => {
            if (quantity !== staleQuantity) {
                try {
                    updateCart({cart_record_id: record.id, quantity: quantity})
                } catch (error) {
                    setQuantity(staleQuantity)
                }
            }
        }, 500)
        return () => {
            clearTimeout(update)
        }
    }, [quantity, updateCart]);
    const [staleQuantity, setStaleQuantity] = useState(quantity);
    const [checked, setChecked] = useState(checkedItems.includes(record.id));
    const [outOfStock, setOutOfStock] = useState(false)
    useEffect(() => {
        checkItem(record.id, checked)
    }, [checkItem, checked, record.id]);
    useEffect(() => {
        setChecked(checkedItems.includes(record.id));
    }, [checkedItems, record.id]);

    return (<div className={clsx({
        "item-wrapper": true, "out-of-stock": record?.book?.stock < record.quantity
    })}>
        <div className={"blurred-item"}>
        </div>
        <div className={`item`}>

            <div className={"item-information check"}>
                <div onClick={() => {
                    setChecked(!checked)
                }} className={clsx({'checkbox': true, 'checked': checked})}>
                    <FaCheck/>
                </div>
            </div>
            <div className={"item-information"}>
                <Link to={`/book/${record?.book.isbn}`}>
                    <img src={record?.book.bookCover}/>
                </Link>
            </div>
            <div className={"item-information details"}>
                <h4>
                    {record?.book.title}</h4>
                <p></p>
                <div className={"binding"}>Paperback</div>
                <div className={"actions"}>
                    <div onClick={() => {
                        deleteFromCart([record?.id]);
                    }}>Remove
                    </div>
                    <div>Save For Later</div>
                    <div>View</div>
                </div>
            </div>
            <div className={"item-information price"}>${(record?.book.price).toFixed(2)}</div>
            <div className={"item-information quantity"}>
                <div className={"quantity"}>
                    <button onClick={() => {
                        setQuantity(prev => {
                            if (prev === 1) {
                                return prev
                            }
                            return prev - 1
                        })
                    }}>-
                    </button>
                    <div>{quantity}</div>
                    <button disabled={record?.book.stock <= quantity} onClick={() => {
                        setQuantity(prev => prev + 1)
                    }}>+
                    </button>
                </div>
                {outOfStock && <p>
                    Out of stock
                </p>}
            </div>
            <div className={"item-information total"}>${(record?.book.price * quantity).toFixed(2)}</div>
        </div>
    </div>)
}

const PageCart = () => {
    const {fetchCart, getPreliminaryCalculation, records, setCoupon, getCheckoutData} = useCart();
    useEffect(() => {
        fetchCart().then();
    }, [fetchCart]);

    return (
        <div className="page">
            <ScrollToTop/>
            <Navbar></Navbar>
            <>
                <div className={"page-content page-cart"}>
                    <div className={"page-content-header"}>
                        <p>Your Shopping Cart</p>
                    </div>
                    <div className={"main-content"}>
                        <div className={"items"}>
                            <div className={"items-header"}>
                                <div className={"header-title"}></div>
                                <div className={"header-title"}>Items</div>
                                <div className={"header-title"}></div>
                                <div className={"header-title price"}>Price</div>
                                <div className={"header-title quantity"}>Quantity</div>
                                <div className={"header-title total"}>Total</div>
                            </div>
                            {records && [...records.values()].map(record => <Item
                                key={record?.id + "_" + record?.quantity}
                                record={record}
                            />)}
                        </div>
                        <div className={"billing"}>
                            <div className={"billing-header"}>
                                Coupon
                            </div>
                            <div className={"coupon-input"}>
                                <input onChange={(event) => {
                                    setCoupon(event.target.value)
                                }}/>
                                <button>Apply</button>
                                <div className={"label"}>Coupon Code</div>

                            </div>
                            <div className={"billing-header"}>
                                Order Summary
                            </div>
                            <div className={"bill"}>
                                <div><p>Subtotal:</p>
                                    <p>${getPreliminaryCalculation().subtotal}
                                    </p>
                                </div>
                                <div><p>Discount:</p><p>${getPreliminaryCalculation().discount}</p></div>
                                <div className={"line"}></div>
                                <div className={"total"}><p>Total:</p>
                                    <p>
                                        ${getPreliminaryCalculation().total}
                                    </p>
                                </div>
                            </div>

                            <Link to={`/checkout?state=${getCheckoutData()}`}
                                  className={"proceed"}>Proceed To
                                Checkout
                            </Link>
                        </div>
                    </div>
                    <FeaturedSection header={"From This Author"}/>
                    {/*<FeaturedSection number={5} header={"Others Also Bought"}/>*/}
                </div>
                <Footer/>
            </>
        </div>);
};
export default PageCart;