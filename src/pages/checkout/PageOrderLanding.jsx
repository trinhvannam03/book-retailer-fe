import React from 'react';
import PageWrapper from "../../components/PageWrapper";
import img from "../../images/rb_1003.png"
const PageOrderLanding = () => {
    return (
        <PageWrapper suffix={"checkout-landing"}>
            <div className={"page-content page-landing-checkout"}>
                <img src={img}/>
            </div>
        </PageWrapper>
    );
};

export default PageOrderLanding;