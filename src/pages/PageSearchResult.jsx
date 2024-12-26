import React, {useState} from 'react';
import PageWrapper from "../components/PageWrapper";
import ProductBrief from "../components/ProductDisplay";

const PageSearchResult = () => {
    const sortCriteria = [
        "Relevance",
        "Price Low-High",
        "Price High-Low",
        "Title A-Z",
        "Title Z-A",
        "Author A-Z",
        "Author Z-A",
        "Arrival Date",
        "Publish Date"
    ]
    const [sortingCriterion, setSortingCriterion] = useState('Relevance')
    return (
        <PageWrapper>
            <div className={"page-content search"}>
                <div className={"page-content-header"}>
                    <p>
                        Search Results for "Tim Marshall"
                    </p>
                </div>
                <div className={"main-content"}>
                    <div className={"main-content-left"}></div>
                    <div className={"main-content-right"}>
                        <div className={"number-of-results"}>
                            25 Results for "<span>tim marshall</span>"
                        </div>
                        <div className={"sort-results"}>
                            Sort by:
                            <div className={"address-input-wrapper"}>
                                <input value={sortingCriterion} placeholder={" "}/>

                                <div className={"times"}>
                                    {sortCriteria.map(criterion =>
                                        <div onClick={() => {
                                            setSortingCriterion(criterion)
                                        }} className={"time"}>{criterion}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={"results"}>
                            <ProductBrief/>
                            <ProductBrief/>
                            <ProductBrief/>
                            <ProductBrief/>
                            <ProductBrief/>
                            <ProductBrief/>
                            <ProductBrief/>
                            <ProductBrief/>
                            <ProductBrief/>
                            <ProductBrief/>
                            <ProductBrief/>
                            <ProductBrief/>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default PageSearchResult;