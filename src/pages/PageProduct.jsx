import React, {useCallback, useEffect, useState} from 'react';
import {WishlistSvg} from "../components/Navbar";
import {Link, useParams} from "react-router-dom";
import {axiosClient, ScrollToTop} from "../components/axiosClient";
import {Result} from "antd";
import FeaturedSection from "../components/FeaturedSection";
import PageWrapper from "../components/PageWrapper";
import {useCart} from "../context/CartContext";


const PageProduct = () => {
    const [error, setError] = useState(false)
    const [quantity, setQuantity] = useState(1);
    const {id} = useParams();
    const increase = () => {
        setQuantity(prev => prev + 1)
    }
    const decrease = () => {
        setQuantity(prev => {
            return prev === 1 ? prev : prev - 1
        })
    }
    const [book, setBook] = useState(undefined);
    const getBook = useCallback(async () => {
        try {
            const response = await axiosClient.get(`/api/books/${id}`)
            if (response.status === 200) {
                setBook(response.data);
            }
        } catch (er) {
            if (er.response.status === 404) {
                setError(true);
            }
        }
    }, [id]);
    const {addToCart} = useCart();
    useEffect(() => {
        getBook().then();
    }, [getBook, id]);
    return (
        <PageWrapper>
            {
                !error ?
                    <>
                        <div className={"page-content page-product"}>
                            <div className={"book-details"}>
                                <div className={"small-details"}>
                                    <div className={'product-image'}>
                                        <img src={book?.bookCover}/>
                                    </div>
                                    <div className={"product-details"}>
                                        <h3 className={"title"}>
                                            {book && book.title}
                                            &nbsp;<span>
                                                <span>By&nbsp;</span>{book?.authors?.map(author => author.fullName).join(', ')}
                                             </span>
                                        </h3>

                                        <h5 className={"binding-type"}>
                                            Paperback
                                        </h5>
                                        <div className={"price"}>
                                            <div className={"display-price"}>
                                                ${book && book.price}
                                            </div>
                                        </div>


                                        <div className={"quantity-and-stock"}>
                                            <div className={"quantity"}>
                                                <div onClick={() => {
                                                    decrease();
                                                }}>-
                                                </div>
                                                <div>{quantity}</div>
                                                <div onClick={() => {
                                                    increase()
                                                }}>+
                                                </div>
                                            </div>
                                            <div className={"stock"}>
                                                <p>{book ? (Number(book.stock) > 100 ? "100+ available" : `${book.stock} available`) : null}&nbsp;</p>
                                            </div>
                                        </div>
                                        <div className={'buttons'}>
                                            <button onClick={() => {
                                                addToCart({
                                                    book_id: book.id,
                                                    quantity: 1,
                                                    bookCover: book.bookCover,
                                                    title: book.title
                                                });
                                            }}>
                                                Add To Cart
                                            </button>
                                            <button>
                                                Buy Now
                                            </button>
                                            <div className={"wish"}>
                                                <WishlistSvg/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"stores"}>

                                        <div className={"stores-header"}></div>
                                    </div>
                                </div>
                                <div className={"additional-details about"}>
                                    <div className={"additional-details-header"}>
                                        About This Book
                                    </div>
                                    <div className={"additional-details-content"}>
                                        <div className={"category"}>
                                            Categories:&nbsp;<span>{book && book.categories.map(category =>
                                            <Link><span>, </span>{category.categoryName}</Link>)}</span>
                                        </div>
                                        <div className={"specifications"}>

                                            <div className={"isbn"}>
                                                <span>ISBN:</span>&nbsp;{book && book.isbn}
                                            </div>
                                            <div className={"publication-year"}>
                            <span>
                                Published Year:
                            </span> &nbsp;2024
                                            </div>
                                            <div className={"publisher"}>

                                                <span>Publisher:</span>&nbsp; {book && book.publisher}
                                            </div>
                                            <div className={"language"}>
                                                <span>Language:</span>&nbsp;     English
                                            </div>
                                            <div className={"pages"}>
                                                <span>Pages:</span>&nbsp; {book && book.pages}
                                            </div>
                                            <div className={"dimensions"}>
                                                <span>Dimensions:</span>&nbsp;{book?.bookLength} x {book?.bookWidth} x {book?.bookHeight}
                                            </div>
                                        </div>

                                        <div className={"description"}>
                                            <h3>
                                                Description
                                            </h3>
                                            <div className={"inner"}
                                                 dangerouslySetInnerHTML={{__html: book?.bookDesc}}/>
                                        </div>
                                    </div>
                                </div>
                                <div className={"additional-details"}>
                                    <div className={"additional-details-header"}>
                                        About The Author
                                    </div>
                                    <div className={"additional-details-content"}
                                         dangerouslySetInnerHTML={{__html: book?.authors?.map(author => author.authorDesc).join("") || "<em>Details about the author are currently missing.</em>"}}/>
                                </div>
                            </div>
                            <FeaturedSection header={"From This Author"}/>
                            <FeaturedSection header={"Similar Items"}/>
                        </div>
                    </>
                    :
                    <Result
                        status="404"
                        title="404"
                        subTitle={<div className={"fallback"}>
                            Something is wrong with your request. Click <span><Link
                            style={{color: 'red', fontStyle: 'italic'}} to={"/"}>
                            here&nbsp;
                        </Link></span>
                            to return</div>}
                    />
            }
        </PageWrapper>
    );
};

const styles = {
    root: {
        border: '2px solid red'
    }
}

export default PageProduct;