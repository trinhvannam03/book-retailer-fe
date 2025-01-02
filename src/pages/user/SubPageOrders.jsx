import React, {useCallback, useEffect, useState} from 'react';
import clsx from "clsx";
import {FaChevronDown, FaChevronUp, FaSortDown, FaSortUp} from "react-icons/fa";
import {fetchWithRetry} from "../../components/axiosClient";

const SubPageOrders = () => {
    const [selected, setSelected] = useState(1)
    const [orderStatus, setOrderStatus] = useState()
    useEffect(() => {
        setOrderStatus(() => {
            switch (selected) {
                case 1 :
                    return undefined
                case 2 :
                    return "PROCESSING"
                case 3 :
                    return "PENDING"
                case 4 :
                    return "CANCELLED"
                case 5 :
                    return "COMPLETED"
            }
        })
    }, [selected]);
    const [orders, setOrders] = useState([])
    const fetchOrders = async () => {
        try {
            const response = await fetchWithRetry("api/order/", "GET")
            if (response.status === 200) {
                setOrders(response.data)
            }
        } catch (e) {

        }
    }
    useEffect(() => {
        fetchOrders().then()
    }, []);
    const displaySelected = useCallback(() => {
        // eslint-disable-next-line default-case
        switch (selected) {
            case 1 :
                return "All Orders"
            case 2:
                return "Processing"
            case 3:
                return "Pending"
            case 4:
                return "Cancelled"
            case 5:
                return "Completed"
        }
    }, [selected]);
    return (<div className={"sub-page orders"}>
        <div className={"sub-page-left"}>
            <div className={"orders-filter-options"}>
                <input autoFocus value={displaySelected()}/>
                <div className={"up"}>
                    <FaChevronUp/>
                </div>
                <div className={"down"}>
                    <FaChevronDown/>
                </div>
                <div className={"view-options"}>
                    <div onClick={() => {
                        setSelected(1)
                    }} className={clsx({"view-option": true, "selected": selected === 1})}>All Orders
                    </div>
                    <div onClick={() => {
                        setSelected(2)
                    }} className={clsx({"view-option": true, "selected": selected === 2})}>Processing
                    </div>
                    <div onClick={() => {
                        setSelected(3)
                    }} className={clsx({"view-option": true, "selected": selected === 3})}>Pending
                    </div>
                    <div onClick={() => {
                        setSelected(4)
                    }} className={clsx({"view-option": true, "selected": selected === 4})}>Cancelled
                    </div>
                    <div onClick={() => {
                        setSelected(5)
                    }} className={clsx({"view-option": true, "selected": selected === 5})}>Completed
                    </div>
                </div>
            </div>
        </div>
        <div className={"sub-page-right"}>
            <div className={"orders"}>
                <div className={"orders-header"}></div>
                {orders?.map(order => <Order orderStatus={orderStatus} order={order}/>)}
            </div>
        </div>
    </div>);
};
const Order = ({order, orderStatus}) => {
    const [o, setO] = useState(order)

    const getStatus = useCallback(() => {
        return o?.orderStatus
    }, [o]);
    const cancelOrder = useCallback(async (orderId) => {
        try {
            const response = await fetchWithRetry(`api/order/${orderId}`, "PUT")
            setO(response.data)
            console.log(response.data)
        } catch (error) {

        }
    }, []);
    const renderOrderActions = useCallback((orderId) => {
        // eslint-disable-next-line default-case
        switch (getStatus()) {
            case "PROCESSING" :
                return <>
                    <button className={"report"}>View</button>
                    <button className={"report"}>Report</button>
                    <button onClick={() => {
                        cancelOrder(orderId).then()
                    }} className={"feedback"}>Cancel
                    </button>
                </>
            case "PENDING" :
                return <>
                    <button className={"report"}>View</button>
                    <button className={"report"}>Report</button>
                    <button onClick={() => {
                        cancelOrder(orderId).then()
                    }} className={"feedback"}>Cancel
                    </button>
                </>
            case "CANCELLED" :
                return <>
                    <button className={"report"}>View</button>
                    <button className={"report"}>Report</button>
                </>
            case "COMPLETED" :
                return <>
                    <button className={"report"}>View</button>
                    <button className={"report"}>Report</button>
                    <button className={"feedback"}>Feedback</button>
                </>

        }
    }, [cancelOrder, getStatus]);
    return (<>
            {!orderStatus || orderStatus === getStatus() ? <div className={"order"}>
                <div className={"order-header"}>
                    <p>#ORDER{order?.orderInformationId}</p>
                    <p>{getStatus()}</p>
                </div>
                {o?.items.map(item => <div className={"item-in-order"}>
                    <div className={"item-image"}>
                        <img src={item?.book?.bookCover}/>
                    </div>
                    <div className={"item-details"}>
                        <p>
                            {item?.book.title}
                        </p>
                        <p className={"quantity"}>
                            Quantity: {item?.quantity}
                        </p>
                    </div>
                    <div className={"item-price"}>
                        <p>
                            ${item?.price.toFixed(2)}
                        </p>
                    </div>
                </div>)}

                <div className={"order-footer"}>
                    <div className={"order-total"}>Total:<span>${order?.total}</span></div>
                    <div className={"order-actions"}>
                        {renderOrderActions(order?.orderInformationId)}
                    </div>
                </div>
            </div> : undefined}
        </>)
}


export default SubPageOrders;