import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import './styles/meta.scss'
import PageHome from "./pages/PageHome";
import PageProduct from "./pages/PageProduct";
import PageAdmin from "./pages/admin/PageAdmin";
import PageAuth from "./pages/PageAuth";
import PageCart from "./pages/PageCart";
import {useState} from "react";
import PageExtractData from "./pages/admin/PageExtractData";
import PageCheckout from "./pages/checkout/PageCheckout";
import {CartProvider} from "./context/CartContext";
import {AuthenticationProvider} from "./context/AuthenticationContext";
import PageOrderLanding from "./pages/checkout/PageOrderLanding";
import PageOrderFallback from "./pages/checkout/PageOrderFallback";
import PageAccount from "./pages/user/PageAccount";
import SubPageProfile from "./pages/user/SubPageProfile";
import SubPageOrders from "./pages/user/SubPageOrders";
import SubPageWishLish from "./pages/user/SubPageWishList";
import SubPageChangePassword from "./pages/user/SubPageChangePassword";
import SubPageSessions from "./pages/user/SubPageSessions";
import PageSearchResult from "./pages/PageSearchResult";
// Incorrect for browser-based apps:


let now = new Date();

function App() {
    const [notifications, setNotifications] = useState([]);

    return (
        <>
            <AuthenticationProvider>
                <CartProvider>
                    <Router>
                        <Routes>
                            <Route path="/admin/extract-data" element={<PageExtractData/>}/>
                            <Route path="/admin/browse-all" element={<PageAdmin/>}/>
                            <Route path="/checkout" element={<PageCheckout/>}/>
                            <Route path="/cart" element={<PageCart/>}/>
                            <Route index element={<PageHome/>}/>
                            <Route path="/book/:id" element={<PageProduct/>}/>
                            <Route path="/auth" element={<PageAuth/>}/>
                            <Route path="/checkout/landing" element={<PageOrderLanding/>}/>
                            <Route path="/checkout/landing" element={<PageOrderFallback/>}/>
                            <Route path="/user/" element={<PageAccount/>}>
                                <Route path="profile" element={<SubPageProfile/>}/>
                                <Route path="orders" element={<SubPageOrders/>}/>
                                <Route path="wishlist" element={<SubPageWishLish/>}/>
                                <Route path="password" element={<SubPageChangePassword/>}/>
                                <Route path="sessions" element={<SubPageSessions/>}/>
                            </Route>
                            <Route path="/search" element={<PageSearchResult/>}/>
                        </Routes>
                    </Router>
                </CartProvider>
            </AuthenticationProvider>
        </>);
}

export default App;
