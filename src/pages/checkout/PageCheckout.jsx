import React, {useCallback, useEffect, useState} from 'react';
import Navbar from "../../components/Navbar";
import {axiosClient, fetchWithRetry} from "../../components/axiosClient";
import {Link, useSearchParams} from "react-router-dom";
import Footer from "../../components/Footer";
import clsx from "clsx";
import {FiPlus} from "react-icons/fi";
import {RiSubtractLine} from "react-icons/ri";
import {HiOutlinePencilAlt} from "react-icons/hi";
import cod from "../../images/cash.png"
import vnpay from "../../images/vnpay.webp"
import cards from "../../images/176x24-credit.svg"


const DropdownSection = ({header, children, suffix}) => {
    const [toggled, setToggled] = useState(true)
    return (<div className={clsx({[`dropdown-section ${suffix}`]: true, "toggled": toggled})}>
        <div onClick={() => {
            setToggled(!toggled)
        }} className={"dropdown-section-header"}>{header || null}{!toggled ? <FiPlus/> : <RiSubtractLine/>}
        </div>
        {children}
    </div>)
}
const DropdownContent_Address = ({setAddress: superSetAddress, setShipping}) => {
    //address action to be rendered (create/update, use existing
    const [action, setAction] = useState(1);
    //single object for both creating and updating addresses. Remember to set this state to undefined after updating or creating
    const [address, setAddress] = useState(undefined)
    const [selectedAddress, setSelectedAddress] = useState(undefined)
    //selected address's id
    useEffect(() => {
        superSetAddress(selectedAddress)
    }, [selectedAddress]);
    //conditionally fetch states, cities, and countries
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])

    const fetchCountries = useCallback(async () => {
        const response = await axiosClient.get("/api/user/address/countries")
        if (response.status === 200) {
            setCountries(response.data)
        }
    }, []);
    const fetchCities = useCallback(async () => {
        if (address && address.state?.id) {
            try {
                const response = await axiosClient.get(`/api/user/address/cities/${address.state.id}`)
                if (response.status === 200) {
                    setCities(response.data)
                }
            } catch (error) {
            }
        }
    }, [address]);
    const fetchStates = useCallback(async () => {
        if (address && address.country?.id) {
            try {
                const response = await axiosClient.get(`api/user/address/states/${address.country.id}`)
                if (response.status === 200) {
                    setStates(response.data)
                }
            } catch (error) {

            }
        }
    }, [address]);
    useEffect(() => {
        fetchCountries().then()
    }, [fetchCountries]);
    useEffect(() => {
        fetchCities().then()
    }, [fetchCities]);
    useEffect(() => {
        fetchStates().then()
    }, [fetchStates]);
    //render all addresses (options)
    const [addresses, setAddresses] = useState([]);
    const fetchAddress = async () => {
        try {
            const response = await fetchWithRetry("api/user/address", "GET")
            if (response.status === 200) {
                setAddresses(response.data)
            }
        } catch (error) {
        }
    }
    useEffect(() => {
        fetchAddress().then()
    }, []);

    const createAddress = useCallback(async () => {
        try {
            const response = await fetchWithRetry("api/user/address", "POST", address);
            if (response.status === 200) {
                setSelectedAddress(response.data)
                setAddress(undefined)
                setAction(1)
            }
        } catch (error) {
        }
    }, [address]);

    const isSelected = useCallback((address) => {
        return selectedAddress?.id === address.id
    }, [selectedAddress]);

    return (<>
        {action === 1 ? <div className={"dropdown-section-content all"}>
            <div onClick={() => {
                setAction(2);
                setAddress(undefined)
            }} className={"change-action"}>
                Add New Address
            </div>
            <div className={"select"}>
                Select an address
            </div>
            <div className={"all-addresses"}>
                {addresses?.map(address => <>
                    <div key={address.id}
                         className={clsx({'address': true, 'selected': isSelected(address)})}>
                        <div onClick={() => {
                            setSelectedAddress(address)
                        }} className={"radio"}>
                            <input checked={isSelected(address)} type={"radio"}
                                   name={"name"}/>
                        </div>
                        <div onClick={() => {
                            setSelectedAddress(address)
                        }} className={"address-details"}>
                            <p>
                                {address?.fullName} | {address?.phone}
                            </p>
                            <div>
                                {address?.fullAddress}
                            </div>
                        </div>
                        <div className={"edit"}>
                            <div onClick={() => {
                                setAddress(address)
                                setAction(2)
                            }}><HiOutlinePencilAlt/></div>
                        </div>
                    </div>
                </>)}
            </div>
        </div> : <div className={"dropdown-section-content create"}>
            <div onClick={() => {
                setAction(1);
            }} className={"change-action"}>
                Use Existing
            </div>
            <div className={"input-fields"}>
                <div className="address-input-wrapper">
                    <input defaultValue={address?.fullName} onChange={(event) => {
                        setAddress(prev => {
                            return {...prev, fullName: event.target.value}
                        })
                    }} placeholder=" " required/>
                    <div className="address-input-placeholder">Full Name</div>
                </div>
                <div className="address-input-wrapper">
                    <input  defaultValue={address?.phone} onChange={(event) => {
                        setAddress(prev => {
                            return {...prev, phone: event.target.value}
                        })
                    }} placeholder=" " required/>
                    <div className="address-input-placeholder">Phone</div>
                </div>
                <div className="address-input-wrapper">
                    <input defaultValue={address?.detailedAddress} onChange={(event) => {
                        setAddress(prev => {
                            return {...prev, detailedAddress: event.target.value}
                        })
                    }} placeholder=" " required/>
                    <div className="address-input-placeholder">Street & Number</div>
                </div>
                <div className="address-input-wrapper">
                    <input className={"no-caret"} value={address && address.country ? address.country.name : ''} placeholder=" " required/>
                    <div className="address-input-placeholder">Country</div>
                    <div className={`dropdown-options`}>
                        {countries && countries.map(country => <div onClick={() => {
                            setAddress(prev => {
                                if (country.id === address?.country?.id) {
                                    return {...prev, country: country}
                                }
                                return {...prev, country: country, state: undefined}
                            })
                        }} className={"dropdown-option"}>
                            {country?.name}
                        </div>)}
                        {countries && countries.length === 0 ?
                            <div className={"dropdown-option"}>No country available</div> : null}
                    </div>
                </div>
                <div className="address-input-wrapper">
                    <input className={"no-caret"} value={address && address.state ? address.state.name : ''} placeholder=" " required/>
                    <div className="address-input-placeholder">State</div>
                    <div className={`dropdown-options`}>
                        {states && states.map(state => <div onClick={() => {
                            setAddress(prev => {
                                if (state.id === address?.state?.id) {
                                    return {...prev, state: state}
                                }
                                return {...prev, state: state, city: undefined}
                            })
                        }} className={"dropdown-option"}>
                            {state?.name}
                        </div>)}
                        {address?.country ? null :
                            <div className={"dropdown-option select"}>Please select a country</div>}
                    </div>
                </div>
                <div className="address-input-wrapper">
                    <input className={"no-caret"} placeholder=" " value={address && address.city ? address.city.name : ''} required/>
                    <div className="address-input-placeholder">City</div>
                    <div className={`dropdown-options`}>
                        {cities && cities.map(city => <div onClick={() => {
                            setAddress(prev => {
                                return {...prev, city: city}
                            })
                        }} className={"dropdown-option"}>
                            {city?.name}
                        </div>)}
                        {address?.state ? null : <div className={"dropdown-option select"}>Please select a state</div>}
                    </div>
                </div>
                <div className="address-input-wrapper">
                    <input className={"no-caret"} placeholder=" " required/>
                    <div className="address-input-placeholder">Zip</div>
                </div>
                <button className={"save-address"} onClick={() => {
                    createAddress().then();
                }}>Save Address
                </button>
            </div>
        </div>}
    </>)
}
const DropdownContent_Items = ({state, setItems: superSetItems}) => {
    const [items, setItems] = useState([])
    const fetchItems = useCallback(async () => {
        try {
            const response = await axiosClient.post("api/cart/checked-items", state.items)
            if (response.status === 200) {
                setItems(response.data)
            }
        } catch (error) {
        }
    }, []);
    useEffect(() => {
        superSetItems(items)
    }, [items]);
    useEffect(() => {
        fetchItems().then();
    }, [fetchItems]);
    const calculateTotal = (item) => {
        return `$${(Number(item?.book.price) * Number(item.quantity)).toFixed(2)}`
    }
    return (<div className={"dropdown-section-content"}>
        <div className={"checked-items"}>
            {items && items.map((item, index) => <div key={item.id} className={"checked-item"}>
                <div className={'checked-item-info index'}>{index + 1}</div>
                <div className={'checked-item-info image'}><img src={item?.book.bookCover}/></div>
                <div className={'checked-item-info details'}>
                    <p>
                        {item?.book.title}
                    </p>

                    <div>
                        ISBN: {item?.book.isbn}
                    </div>
                </div>
                <div className={'checked-item-info'}>{item.book.price}</div>
                <div className={'checked-item-info'}>x{item.quantity}</div>
                <div className={'checked-item-info'}>{calculateTotal(item)}</div>
            </div>)}
        </div>
    </div>)
}
const DropdownContent_Payment = ({setPayment}) => {
    const [paymentMethod, setPaymentMethod] = useState({paymentMethodId: undefined})
    const isSelected = useCallback((id) => {
        return id === paymentMethod.paymentMethodId
    }, [paymentMethod.paymentMethodId])
    const isSelectedSubMethod = useCallback((id) => {
        return id === paymentMethod.subMethod
    }, [paymentMethod.subMethod]);
    const renderMethod = useCallback(() => {
        switch (paymentMethod.paymentMethodId) {
            case 1000: {
                return <>
                    <div className={"method-details cod"}>
                        <div className={"method-details-section"}>
                            <div className={"description"}>
                                For orders paid by COD, collection fee may apply. Shipping discount (if any) also
                                applies to the
                                collection fee.
                            </div>
                        </div>
                    </div>
                </>
            }
            case 1001: {
                return <>
                    <div className={"method-details vnpay"}>
                        <div className={"method-details-section"}>
                            <div className={"vnpay-header"}>
                                <img src={"https://sandbox.vnpayment.vn/paymentv2/Images/brands/logo.svg"}/>
                                <img src={"https://sandbox.vnpayment.vn/paymentv2/images/merchant/vban.png"}/>
                            </div>
                            <div className={"vnpay-header-2"}>Select a payment method</div>
                            {/*<div onClick={() => {*/}
                            {/*    setPaymentMethod(prev => {*/}
                            {/*        return {...prev, subMethod: 1}*/}
                            {/*    })*/}
                            {/*}} className={clsx({"vnpay-method": true, "selected": isSelectedSubMethod(1)})}*/}
                            {/*>*/}
                            {/*    <p>*/}
                            {/*        VNPAY QR*/}
                            {/*    </p>*/}
                            {/*    <img*/}
                            {/*        src={"https://sandbox.vnpayment.vn/paymentv2/images/icons/mics/64x64-vnpay-qr.svg"}/>*/}
                            {/*</div>*/}
                            <div onClick={() => {
                                setPaymentMethod(prev => {
                                    return {...prev, subMethod: 2}
                                })
                            }} className={clsx({"vnpay-method": true, "selected": isSelectedSubMethod(2)})}>
                                <p>
                                    Domestic cards and bank accounts
                                </p>
                                <img src={"https://sandbox.vnpayment.vn/paymentv2/images/icons/mics/64x64-bank.svg"}/>
                            </div>
                            <div onClick={() => {
                                setPaymentMethod(prev => {
                                    return {...prev, subMethod: 3}
                                })
                            }} className={clsx({"vnpay-method": true, "selected": isSelectedSubMethod(3)})}>
                                <p>
                                    International payment cards
                                    <img src={cards}/>
                                </p>
                                <img src={"https://sandbox.vnpayment.vn/paymentv2/images/icons/mics/64x64-atm.svg"}/>
                            </div>
                        </div>
                    </div>
                </>
            }
            default: {
                return <></>
            }
        }
    }, [isSelectedSubMethod, paymentMethod.paymentMethodId]);
    useEffect(() => {
        setPayment(paymentMethod)
    }, [paymentMethod]);
    return (<div className={"dropdown-section-content"}>
        <div className={"payment-methods"}>
            <em>Select a payment method</em>
            <div className={"methods"}>
                <div onClick={() => {
                    setPaymentMethod({paymentMethodId: 1000})
                }} className={clsx({"method": true, "selected": isSelected(1000)})}
                >
                    <div className={"badge"}></div>
                    <div className={"img"}>
                        <img src={cod}/>
                    </div>
                    Cash On Delivery
                </div>
                <div onClick={() => {
                    setPaymentMethod({paymentMethodId: 1001})
                }} className={clsx({"method": true, "selected": isSelected(1001)})}>
                    <div className={"badge"}></div>
                    <div className={"img"}>
                        <img src={vnpay}/>
                    </div>
                    VNPAY
                </div>
            </div>
            {renderMethod()}
        </div>
    </div>)
}
const DropdownContent_Summary = ({
                                     items, state, shipping, placeOrder, setTotal, setDiscount
                                 }, length = items.length) => {
    const [summary, setSummary] = useState({
        subtotal: 0, discount: 0, quantity: 0, total: 0
    });
    // Function to calculate summary
    const getSummary = useCallback(async () => {
        const subtotal = items && items.reduce((sum, item) => {
            return Number(sum) + Number(Number(item.book.price) * Number(item.quantity));
        }, 0).toFixed(2);
        const quantity = length;
        const coupon = state.coupon;
        const discount = coupon ? coupon.discount : 0;
        const total = (Number(subtotal) - Number(discount) + Number(shipping)).toFixed(2);
        setTotal(total)
        setDiscount(discount)
        return {
            subtotal: `$${subtotal}`,
            discount: `$${discount}`,
            quantity: `$${quantity}`,
            shipping: Number(shipping) > 0 ? `$${shipping}` : "FREE",
            total: `$${total}`
        };
    }, [items, shipping, state.coupon]);

    useEffect(() => {
        const fetchSummary = async () => {
            const summaryData = await getSummary();
            setSummary(summaryData);
        };
        fetchSummary().then();
    }, [getSummary]);
    const submit = async () => {
        try {
            const response = await placeOrder();
        } catch (error) {

        }
    }
    return (<>

        <div className={"checkout-information"}>
            <div className={"checkout-information-body"}>
                <div className={"summary-information"}>
                    <div>Subtotal</div>
                    <div>{summary.subtotal}</div>
                </div>
                <div className={"summary-information"}>
                    <div>Shipping</div>
                    <div>{summary.shipping}</div>
                </div>
                <div className={"summary-information"}>
                    <div>Discount</div>
                    <div>{summary.discount}</div>
                </div>
                <div className={"summary-information total"}>
                    <div>Total</div>
                    <div>{summary.total}</div>
                </div>
            </div>
            <button onClick={() => {
                submit().then()
            }}>
                Place Order
            </button>
        </div>
    </>)
}
const PageCheckout = () => {
    //alert and redirect
    const [alerted, setAlerted] = useState(false);

    //state transferred from page cart
    const [params] = useSearchParams();
    const encodedState = params.get("state");
    const decodedState = decodeURIComponent(encodedState);
    const state = JSON.parse(atob(decodedState));

    /*data to place order. the items are only fetched once for consistency,
    even if the cart has changed in other sessions.
    */
    const [address, setAddress] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [payment, setPayment] = useState({});
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0)
    const [discount, setDiscount] = useState(0)
    const placeOrder = useCallback(async () => {
        const data = items.map(item => {
            const book = item.book;
            return {
                cartRecordId: item.id,
                bookId: book.id,
                quantity: item.quantity,
                price: book.price
            }
        })
        try {
            const payload = {
                address: {
                    fullName: address.fullName,
                    city: address.city,
                    state: address.state,
                    country: address.country,
                    fullAddress: address.fullAddress,
                    phone: address.phone,
                    longitude: '',
                    latitude: ''
                },
                payment: payment,
                items: data,
                estimatedShippingFee: shipping,
                estimatedTotal: total,
                estimatedDiscount: discount,
                appliedCoupon: state.coupon
            }
            const response = await fetchWithRetry("api/order/", "POST", payload)
            if (response.status === 200) {
                window.location = response.data.redirect || "/checkout/landing"
            } else if (response.status === 206) {
                setAlerted(true)
            }
        } catch (error) {
            setAlerted(true)
        }
    }, [address, discount, items, payment, shipping, state.coupon, total]);

    return (<div className={"page"}>
        {alerted && false && <div className={"blur"}>
            <div className={"message-cart"}>
                <h4>Your cart has been updated.</h4>
                <div>Some items in your cart has just been updated. Please check your cart again and retry.</div>
                <Link to={"/cart"}>Continue</Link>
            </div>
        </div>}
        <Navbar></Navbar>
        <div className={"page-content page-checkout"}>
            <div className={"page-content-header"}>
                <p>Checkout</p>
            </div>
            <div className={"main-content"}>
                <DropdownSection suffix={'address'} header={"Shipping Address"}>
                    {/* eslint-disable-next-line react/jsx-pascal-case */}
                    <DropdownContent_Address setAddress={setAddress} setShipping={setShipping}/>
                </DropdownSection>
                <DropdownSection suffix={"item-summary"} header={"Items Summary"}>
                    {/* eslint-disable-next-line react/jsx-pascal-case */}
                    <DropdownContent_Items setTotal={setTotal} state={state} setItems={setItems}/>
                </DropdownSection>
                <DropdownSection suffix={"payment"} header={"Payment Method"}>
                    {/* eslint-disable-next-line react/jsx-pascal-case */}
                    <DropdownContent_Payment setPayment={setPayment}/>
                </DropdownSection>
                <DropdownSection header={"Order Summary"}>
                    {/* eslint-disable-next-line react/jsx-pascal-case */}
                    <DropdownContent_Summary setTotal={setTotal}
                                             state={state}
                                             shipping={shipping}
                                             items={items}
                                             payment={payment}
                                             placeOrder={placeOrder}
                                             setDiscount={setDiscount}
                    />
                </DropdownSection>
            </div>
        </div>
        <Footer/>
    </div>);
};

export default PageCheckout;