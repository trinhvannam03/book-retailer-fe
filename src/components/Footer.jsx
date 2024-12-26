import React from 'react';
import {Link} from "react-router-dom";

const Footer = () => {
    return (<div className={"footer"}>
        <div className={"email-subscription"}>
            <div className="signup-container">
                <h1>BE THE FIRST TO KNOW</h1>
                <p>The best offers delivered straight to your inbox.</p>

                <div className="email-signup">
                    <h2>Sign up for email updates</h2>
                    <p>Get $5 off your next purchase of $25+, plus know about exclusive offers, new arrivals, and
                        more.</p>
                    <form className="email-form">
                        <input type="email" placeholder="Email *" required/>
                        <button type="submit">Subscribe</button>
                    </form>
                    <p className="disclaimer">
                        *By entering your email, you agree to our Terms of Use and
                        Privacy
                        Policy, including receipt of emails and promotions. You can unsubscribe at any time.
                    </p>
                </div>

                <div className="text-signup">
                    <h2>Sign up for text updates</h2>
                    <p className="sms-disclaimer">
                        SMS is available in the United States only. By texting 'BOOKS,' you consent to receive
                        general marketing text messages (e.g., marketing and promotional messages) from us
                        at the number provided, including messages sent by autodialer. Consent is not a condition of
                        purchase. Msg &amp; data rates may apply. Msg frequency varies. Unsubscribe at any time by
                        replying 'STOP' or clicking the unsubscribe link (where available).
                    </p>
                </div>
            </div>
        </div>
        <div className={"about-us"}>
            <FooterRight/>
        </div>
    </div>);
};
const FooterRight = () => {
    return (
        <footer className="footer-right">
            <div className="footer-section">
                <h3>Who We Are</h3>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Our Pricing</a></li>
                    <li><a href="#">Location</a></li>
                </ul>
            </div>
            <div className="footer-section">
                <h3>My Account</h3>
                <ul>
                    <li><a href="#">Profile</a></li>
                    <li><a href="#">My Rewards</a></li>
                    <li><a href="#">Past Orders</a></li>
                    <li><a href="#">My Gift Cards</a></li>
                    <li><a href="#">Wishlist</a></li>
                </ul>
            </div>
            <div className="footer-section">
                <h3>Help</h3>
                <ul>
                    <li><a href="#">Orders</a></li>
                    <li><a href="#">Shipping</a></li>
                    <li><a href="#">Loyalty</a></li>
                    <li><a href="#">FAQs</a></li>
                    <li><a href="#">Contact Us</a></li>
                </ul>
            </div>
            <div className="footer-section">
                <h3>Featured</h3>
                <ul>
                    <li><a href="#">Rewards</a></li>
                    <li><a href="#">Refer A Friend</a></li>
                    <li><a href="#">Gift Cards</a></li>
                </ul>
            </div>
            <div className="footer-bottom">
                <ul>
                    <li><a href="#">Policies</a></li>
                    <li><a href="#">Terms of Use</a></li>
                    <li><a href="#">Sitemap</a></li>
                </ul>
                <p>&copy; This website is not by all means created for commercial use or any purpose other than learning.</p>
            </div>
        </footer>
    );
};

export default Footer;