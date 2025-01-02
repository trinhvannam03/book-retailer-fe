import React, {useCallback, useEffect, useState} from 'react';
import PageWrapper from "../components/PageWrapper";
import ProductBrief from "../components/ProductDisplay";
import {axiosClient} from "../components/axiosClient";
import {useSearchParams} from "react-router-dom";

const PageSearchResult = () => {
    const [params, setSearchParams] = useSearchParams();
    const sortCriteria = new Map([["relevance", "Relevance"], ["price_asc", "Price Low-High"], ["price_desc", "Price High-Low"], ["title_asc", "Title A-Z"], ["title_desc", "Title Z-A"], ["publication_date", "Publish Date"]

    ])
    const [categories, setCategories] = useState([])
    const fetchCategories = useCallback(async () => {
        try {
            const response = await axiosClient.get("api/books/categories")
            if (response.status === 200) {
                setCategories(response.data)
            }
        } catch (error) {
        }
    }, []);
    useEffect(() => {
        fetchCategories().then()
    }, [fetchCategories]);
    const [filterCategories, setFilterCategories] = useState(new Map())
    console.log(params.get("price_gte"))
    const [price_gte, setPrice_gte] = useState(params.get("price_gte") || undefined);
    const [price_lte, setPrice_lte] = useState(params.get("price_lte") || undefined);
    const [sort, setSort] = useState([...sortCriteria.entries()][0])
    const [results, setResults] = useState([])
    const [page, setPage] = useState(1)

    const getURI = useCallback(() => {
        const fetchUrl = `api/books/search?${params.toString()}`
        return fetchUrl;
    }, [params])
    const fetchSearchResult = useCallback(async () => {
        try {
            const response = await axiosClient.get(getURI())
            if (response.status === 200) {
                setResults(response.data)
            }
        } catch (error) {

        }
    }, [getURI]);
    useEffect(() => {
        params.delete("price_gte")
        params.delete("price_lte")
        params.delete("categories")
        params.delete("sort_by")
        if (sort?.length === 2) {
            const sortBy = sort[0];
            params.set("sort_by", sortBy);
        }
        if (price_gte) {
            params.set("price_gte", price_gte + "");
        }
        if (price_lte) {
            params.set("price_lte", price_lte + "");
        }
        if (filterCategories?.size > 0) {
            const category_ids = [...filterCategories.keys()].join(",")
            console.log(category_ids)
            params.set("categories", category_ids);
        }
        setSearchParams(params);
    }, [filterCategories, price_gte, price_lte, sort]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchSearchResult().then();
        }, 200)
        return () => {
            clearTimeout(handler)
        }
    }, [fetchSearchResult]);
    return (<PageWrapper>
        <div className={"page-content search"}>
            <div className={"page-content-header"}>
                <p>
                    Search Results for "{params.get("keyword")}"
                </p>
            </div>
            <div className={"main-content"}>
                <div className={"main-content-left"}>
                    <div className={"filters-header"}>
                        Filter by
                    </div>
                    <div className={"price-filter"}>
                        <div className={"filter-header"}>
                            Price Range
                        </div>

                        <div className={"prices"}>

                            <div className={"price-range"}>
                                <label>$</label>
                                <input min={0} defaultValue={price_gte} onChange={(event) => {
                                    setPrice_gte(event.target.value)
                                }} type={"number"}/>
                            </div>
                            <div className={"to"}>to</div>
                            <div className={"price-range"}>
                                <label>$</label>
                                <input min={0} defaultValue={price_lte} onChange={(event) => {
                                    setPrice_lte(event.target.value)
                                }} type={"number"}/>
                            </div>
                        </div>
                    </div>

                    <div className={"category-filter"}>
                        <div className={"filter-header"}>
                            Categories
                        </div>
                        <div className={"category-filter-content"}>
                            {categories?.map(category => <div onClick={() => {
                                setFilterCategories(prev => {
                                    const newMap = new Map(prev)
                                    if (newMap.has(category.categoryId)) {
                                        newMap.delete(category.categoryId)
                                        return newMap;
                                    }
                                    newMap.set(category.categoryId, category.categoryName)
                                    return newMap;
                                })
                            }} className={"category-option"}>
                                <div>
                                    <input checked={filterCategories?.has(category.categoryId)} type={"checkbox"}/>
                                </div>
                                <p>
                                    {category?.categoryName}
                                </p>
                            </div>)}
                        </div>
                    </div>
                </div>
                <div className={"main-content-right"}>
                    <div className={"number-of-results"}>
                        Results for "<span>{params.get("keyword")}</span>"
                    </div>
                    <div className={"sort-results"}>
                        Sort by:
                        <div className={"address-input-wrapper"}>
                            <input value={sort[1]} placeholder={" "}/>

                            <div className={"times"}>
                                {[...sortCriteria.entries()].map(criterion => <div onClick={() => {
                                    setSort(criterion)
                                }} className={"time"}>{criterion[1]}</div>)}
                            </div>
                        </div>
                    </div>
                    <div className={"results"}>
                        {results?.map(result => <ProductBrief book={result}/>)}
                        <div className={"buttons"}>
                            <button onClick={() => {
                                setPage(prev => Math.max(1, prev - 1))
                            }} className={"prev-page"}>Previous Page
                            </button>
                            <button
                                onClick={() => {
                                    setPage(prev => prev + 1)
                                }}
                                className={"next-page"}>Next Page
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PageWrapper>)
        ;
};

export default PageSearchResult;