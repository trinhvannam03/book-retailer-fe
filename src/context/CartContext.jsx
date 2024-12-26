import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {axiosClient, fetchWithRetry} from "../components/axiosClient";
import {useAuthentication} from "./AuthenticationContext";

export const CartContext = createContext(undefined);
export const CartProvider = ({children}) => {
    const [records, setRecords] = useState(new Map());
    const [checkedItems, setCheckedItems] = useState([]);
    const [discount, setDiscount] = useState(0)
    const [coupon, setCoupon] = useState('')
    const calculateDiscount = useCallback(async () => {
        if (coupon !== '') {
            try {
                const response = await axiosClient.post("api/sales/coupon", {coupon})
                if (response.status === 200) {
                    setDiscount(response.data.rate)
                }
            } catch (error) {
                setDiscount(10);
            }
        }
    }, [coupon]);
    const [timeOut, setTimeOut] = useState(500);
    useEffect(() => {
        calculateDiscount().then()
    }, [calculateDiscount]);
    const {isAuthenticated} = useAuthentication();
    const checkItem = useCallback((id, checked) => {
        setCheckedItems(prev => {
            const newArr = prev.filter(c => c !== id)
            if (checked) {
                newArr.push(id);
            }
            return newArr;
        })
    }, []);
    const [queue, setQueue] = useState([])
    const addToCart = useCallback(async (payload) => {
        try {
            const response = await fetchWithRetry("api/cart/", "POST", payload)
            if (response.status === 200) {
                setRecords(() => {
                    const newMap = new Map();
                    response.data.forEach(record => newMap.set(record?.id, record))
                    return newMap;
                })
            }
        } catch (error) {
            if (error.response?.status === 403 || error.response.status === 401) {
                window.location.redirect = "/auth/"
            }
        }
    }, []);
    const updateCart = useCallback(async (payload) => {
        try {
            const response = await axiosClient.put("api/cart/update", payload)
            if (response.status === 200) {
                setRecords((prev) => {
                    const newMap = new Map(prev);
                    newMap.set(response.data.id, response.data)
                    return newMap;
                })
            }
        } catch (error) {
            setRecords(prev => {
                const newMap = new Map(prev);
                newMap.delete(payload.cart_record_id);
                return newMap;
            })
        }
    }, []);
    const getPreliminaryCalculation = useCallback(() => {
        const subtotal = checkedItems.reduce((sum, item) => Number(sum) + Number(Number(records.get(item)?.book.price) * Number(records.get(item)?.quantity)), 0).toFixed(2)
        const amount = (checkedItems.reduce((sum, item) => Number(sum) + Number(Number(records.get(item)?.book.price) * Number(records.get(item)?.quantity)), 0) * (discount / 100)).toFixed(2)
        const total = (checkedItems.reduce((sum, item) => Number(sum) + Number(Number(records.get(item)?.book.price) * Number(records.get(item)?.quantity)), 0).toFixed(2) - amount).toFixed(2)
        return {
            subtotal: subtotal,
            discount: amount,
            total: total
        }
    }, [checkedItems, discount, records]);
    useEffect(() => {
        setCheckedItems(prev => {
            return prev.filter(id => records?.get(id)?.quantity <= records.get(id)?.book.stock)
        })
    }, [records]);
    const renderNotification = () => {

    }
    const getCheckoutData = useCallback(() => {
        const items = checkedItems.map(c => {
            const record = records.get(c);
            return {
                cart_record_id: record?.id, quantity: record?.quantity
            }
        })
        return encodeURIComponent(btoa(JSON.stringify({
            items: items,
            coupon: coupon
        })))
    }, [checkedItems, coupon, records]);
    const deleteFromCart = useCallback(async (payload) => {
        try {
            const response = await axiosClient.post("api/cart/delete", payload)
            if (response.status === 200) {
                setRecords((prev) => {
                    const newMap = new Map(prev);
                    payload.forEach(id => {
                        newMap.delete(id)
                    })
                    return newMap;
                })
            }
        } catch (error) {

        }
    }, []);
    const fetchCart = useCallback(async () => {
        try {
            const response = await fetchWithRetry("api/cart/", "GET")
            if (response.status === 200) {
                setRecords(() => {
                    const newMap = new Map();
                    response.data.forEach(record => newMap.set(record?.id, record))
                    return newMap;
                })
            }
        } catch (error) {

        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart().then()
        }
    }, [fetchCart, isAuthenticated]);
    return (
        <CartContext.Provider
            value={{
                setCoupon,
                getPreliminaryCalculation,
                getCheckoutData,
                updateCart,
                fetchCart,
                checkItem,
                addToCart,
                records,
                deleteFromCart,
                checkedItems
            }}>
            <CartNotification queue={queue}/>
            {children}
        </CartContext.Provider>);
};
const CartNotification = ({queue}) => {
    return (
        <div className={'add-to-cart-notifications'}>

        </div>
    )
}
export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        return {
            records: [], setRecords: () => {
            }, checkedItems: [], setCheckedItems: () => {

            }
        };
    }

    return context;
};
