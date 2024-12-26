import React, {useEffect, useState} from 'react';
import {axiosClient} from "../../components/axiosClient";

const PageAdmin = () => {
    const [books, setBooks] = useState([])
    const fetchAllProducts = async () => {
        try {
            const response = await axiosClient.get("/api/books/")
            if (response.status === 200) {
                setBooks(response.data)
            }
        } catch (e) {

        }
    }
    useEffect(() => {
        fetchAllProducts();
    }, []);
    const baseUrl = "http://localhost:3000/book?isbn="



// Example usage

    const text = "The package dimensions are Size: 8.24\" l x 5.50\" w x 1.01\" h and weighs 1.2 lbs.";
    return (
        <>
            <div className={'page-content page-admin'}>
                <div className={"browse-all"}>
                    <div className={"browse"}>
                        BROWSE
                    </div>
                    <>
                        {books.map(book =>
                            <div className={"product"}>
                                <input type={"checkbox"}/>
                                <button onClick={() => {
                                    window.open(baseUrl + book.isbn)
                                }}>View
                                </button>
                                <div className={'name'}>
                                    {book && book.title}
                                </div>
                                <div className={"view"}>

                                </div>
                            </div>)}
                    </>
                </div>
            </div>
        </>
    );
};

export default PageAdmin;