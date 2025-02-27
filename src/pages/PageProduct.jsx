import React, {useCallback, useEffect, useState} from 'react';
import {WishlistSvg} from "../components/Navbar";
import {Link, useNavigate, useParams} from "react-router-dom";
import {axiosClient} from "../components/axiosClient";
import {Result} from "antd";
import FeaturedSection from "../components/FeaturedSection";
import PageWrapper from "../components/PageWrapper";
import {useCart} from "../context/CartContext";
import {IoLocationOutline} from "react-icons/io5";
import RippleButton from "../components/RippleButton";


const PageProduct = () => {
    const [error, setError] = useState(false)
    const {addToCart, getCheckoutData, setCheckedItems} = useCart();
    const [quantity, setQuantity] = useState(1);
    const increase = () => {
        setQuantity(prev => prev + 1)
    }
    const decrease = () => {
        setQuantity(prev => {
            return prev === 1 ? prev : prev - 1
        })
    }
    const navigate = useNavigate()
    const {id} = useParams();
    const [book, setBook] = useState(undefined);
    const [stores, setStores] = useState([])
    const fetchStores = useCallback(async () => {
        //this function actually fetches the stock records associated with this book in all available stores
        try {
            const response = await axiosClient.get(`api/books/${book?.bookId}/stores`)
            if (response.status === 200) {
                setStores(response.data)
            }
        } catch (error) {

        }
    }, [book])
    useEffect(() => {
        if (book) {
            fetchStores().then()
        }
    }, [book, fetchStores]);
    const fetchBook = useCallback(async () => {
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
    useEffect(() => {
        fetchBook().then();
    }, [fetchBook, id]);


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
                                                <span>By&nbsp;</span>{book?.authors?.map(author => author.authorName).join(', ')}
                                             </span>
                                        </h3>

                                        <h5 className={"binding-type"}>
                                            Paperback
                                        </h5>
                                        <div className={"price"}>
                                            <div className={"display-price"}>
                                                ${book && book.price.toFixed(2)}
                                            </div>
                                        </div>


                                        <div className={"quantity-and-stock"}>
                                            <div className={"quantity"}>
                                                <RippleButton onClick={() => {
                                                    decrease();
                                                }}>-
                                                </RippleButton>
                                                <div>{quantity}</div>
                                                <RippleButton onClick={() => {
                                                    increase()
                                                }}>+
                                                </RippleButton>
                                            </div>
                                            <div className={"stock"}>
                                                <p>{book ? (Number(book.stock) > 100 ? "100+ available" : `${book.stock} available`) : null}&nbsp;</p>
                                            </div>
                                        </div>
                                        <div className={'buttons'}>
                                            <RippleButton onClick={() => {
                                                addToCart({
                                                    book_id: book.bookId,
                                                    quantity: 1,
                                                    title: book.title
                                                });
                                            }}>
                                                Add To Cart
                                            </RippleButton>
                                            <RippleButton>
                                                Buy Now
                                            </RippleButton>
                                            <div className={"wish"}>
                                                <WishlistSvg/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"stores-section"}>
                                        <h3 className={"stores-header"}>
                                            Find an available store
                                        </h3>
                                        <div className={"search-stores"}>
                                            <input/>
                                            <button>Find</button>
                                            <div className={"nearest"}>
                                                Nearest
                                            </div>
                                        </div>
                                        <div className={"stores"}>
                                            {stores?.map(store =>
                                                <div className={"store"}>
                                                    <div className={"store-details"}>
                                                        <p>
                                                            {store?.location.locationName}
                                                        </p>
                                                        <p>
                                                            Opening: from 9:00 A.M to 9:00 P.M
                                                        </p>
                                                        <p>
                                                            {store?.quantity > 0 ? `${store?.quantity} available` : "Out of stock"}
                                                        </p>
                                                        <p>
                                                            <IoLocationOutline/>&nbsp;{store?.location.city.name}
                                                        </p>
                                                    </div>
                                                    <div className={"store-buttons"}>
                                                        <RippleButton>Reserve</RippleButton>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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
                            <FeaturedSection
                                fetchUrl={`api/books/similar-author?author=${book?.authors[0]?.authorName}`}
                                header={"From This Author"}/>
                            <FeaturedSection fetchUrl={`api/books/similar?id=${book?.bookId}`}
                                             header={"Similar Items"}/>
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