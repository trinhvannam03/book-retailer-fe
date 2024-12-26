import React, {useEffect, useState} from 'react';
import PageWrapper from "../../components/PageWrapper";
import axios from "axios";
import {axiosClient} from "../../components/axiosClient";

const axi = axios.create({
    baseURL: "https://api.groq.com/openai/v1/chat/completions", headers: {
        "Content-Type": "Application/json",
        "Authorization": "Bearer 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"
    },
})

const PageExtractData = () => {
    const [data, setData] = useState({})
    const [search, setSearch] = useState('')
    const apiKey = "Bearer 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"
    const [rawData, setRawData] = useState('');
    const [author, setAuthorName] = useState()
    const [books, setBooks] = useState(new Map())
    const fetchDescription = async (prompt) => {
        const response = await axi.post("", {
            model: "llama3-8b-8192", messages: [{role: "user", content: prompt}]
        })
        if (response.status === 200) {
            setBookDesc(response.data.choices[0].message.content)
        }
    }
    useEffect(() => {
        if (data.bookDesc) {
            setSearch(data.category)
            setBooks(prev => {
                const newMap = new Map(prev);
                newMap.set(data.isbn, data)
                return newMap;
            })
        } else {
            let pr = `Generate  a description for the book ${data.title} by ${data.authorName} 
        that contains at least 400 words and 3 paragraphs. The paragraphs 
         are split into p> tags in HTML. If you dont have the data for the book, or the author and the book don't match, just
          ignore and generate an imaginary description without saying anything`
            setPrompt(pr)
        }
    }, [data]);

    const [title, setTitle] = useState('')
    const [prompt, setPrompt] = useState('')


    function extractBookInfo(text) {
        function extractDimensions(rawText) {
            const regex = /\b\d+(\.\d+)?"\s+l\s+x\s+\d+(\.\d+)?"\s+w\s+x\s+\d+(\.\d+)?"\s+h\b/;
            const match = rawText.match(regex);
            return match ? match[0] : null;
        }

        function extractDimensions2(rawText) {
            const regex = /(\d+(\.\d+)?)/g;  // Matches integers and floats (e.g., 8.31, 5.43, 1.12)

            const matches = rawText.match(regex);

            if (matches && matches.length >= 3) {
                return {
                    length: parseFloat(matches[0]),  // First match is length
                    width: parseFloat(matches[1]),   // Second match is width
                    height: parseFloat(matches[2])   // Third match is height
                };
            }
            return null;
        }

        // Regular Expressions to match the different fields in the text
        const regexCategory = /"category"\s*:\s*"([^"]+)"/;
        const regexPageCount = /"page_count"\s*:\s*(\d+)/;
        const regexPublishDate = /"publish_date"\s*:\s*"([^"]+)"/;
        const regexImageUrl = /"path"\s*:\s*"([^"]+)"/;
        const regexItemId = /"item_id"\s*:\s*"([^"]+)"/;
        const regexBinding = /"binding_1"\s*:\s*"([^"]+)"/;
        const regexPrice = /"regular_price_usd"\s*:\s*([\d.]+)/;
        const regexDimensions = /(\d+(\.\d+)?)\s*l\s*x\s*(\d+(\.\d+)?)\s*w\s*x\s*(\d+(\.\d+)?)/;
        const regex = /"publisher"\s*:\s*"([^"]+)"/;        // Match each pattern in the text
        const categoryMatch = text.match(regexCategory);
        const pageCountMatch = text.match(regexPageCount);
        const publishDateMatch = text.match(regexPublishDate);
        const imageUrlMatch = text.match(regexImageUrl);
        const itemIdMatch = text.match(regexItemId);
        const bindingMatch = text.match(regexBinding);
        const priceMatch = text.match(regexPrice);
        const dimensionsMatch = text.match(regexDimensions);
        let publishDate = null;
        if (publishDateMatch) {
            const date = new Date(publishDateMatch[1]);
            publishDate = date.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD' format
        }
        const dimensions = extractDimensions2(extractDimensions(text))

        let titleStart = text.indexOf("\"title\":");
        let title = ""
        for (let i = titleStart + 9; i < text.length; i++) {
            if (text[i] === "\"") {
                break;
            }
            title += text[i]
        }
        setTitle(title);
        let publisher = ''
        const start = text.indexOf("\"publisher\":")
        for (let i = start + 13; i < text.length; i++) {
            if (text[i] === "\"") {
                break;
            }
            publisher += text[i]
        }
        let authorName = '';
        const authorStart = text.indexOf("\"author_1\":");
        for (let i = authorStart + 12; i < text.length; i++) {
            if (text[i] === "\"") {
                break;
            }
            authorName += text[i]
        }

        authorName = authorName.slice(authorName.indexOf(",") + 2) + " " + authorName.slice(0, authorName.indexOf(",") - 1)
        setAuthorName(author);
        return {
            category: categoryMatch ? categoryMatch[1] : null,
            pageCount: pageCountMatch ? parseInt(pageCountMatch[1], 10) : null,
            publishDate: publishDate,
            imageUrl: imageUrlMatch ? imageUrlMatch[1] : null,
            isbn: itemIdMatch ? itemIdMatch[1] : null,  // Rename 'item_id' to 'isbn'
            authorName,
            binding: bindingMatch ? bindingMatch[1] : null,
            regularPrice: priceMatch ? parseFloat(priceMatch[1]) : null,
            publisher: publisher,
            title: title, ...dimensions
        };
    }

    const [bookDesc, setBookDesc] = useState('')
    const [dimensions, setDimensions] = useState({})
    const [info, setInfo] = useState({})
    useEffect(() => {
        setData({...dimensions, ...info})
    }, [dimensions, info]);
    useEffect(() => {
        setData(prev => {
            return {
                ...prev, bookDesc: bookDesc
            }
        })

    }, [bookDesc]);

    const [categories, setCategories] = useState([])
    const fetchCategories = async () => {
        try {
            const response = await axiosClient.get("/api/category/")
            if (response.status === 200) {
                setCategories(response.data)
            }
        } catch (e) {

        }
    }
    useEffect(() => {
        fetchCategories();
    }, []);

    const [categoryIds, setCategoryIds] = useState([])

    return (<>
        <div className={"page-content page-extract"}>
            <input onChange={(event) => {
                setRawData(event.target.value)
            }}/>
            <button onClick={() => {
                setInfo(extractBookInfo(rawData))
            }}>Extract
            </button>
            <div>{prompt}</div>
            <button onClick={() => {
                fetchDescription(prompt)
            }}>Generate Description
            </button>
            <div className={"category-selection"}>
                <input onChange={(event) => {
                    setSearch(event.target.value)
                }}/>
                {categories.map(category => <CategoryDisplay setCategoryIds={setCategoryIds} key={category.categoryId}
                                                             search={search} category={category}/>)}
            </div>
            <p dangerouslySetInnerHTML={{__html: bookDesc}}/>
            <p>{data.category}</p>
            <p>{data.pageCount}</p>
            <p>{data.publishDate}</p>
            <p>{data.imageUrl}</p>
            <p>{data.isbn}</p>
            <p>{data.authorName}</p>
            <p>{data.binding}</p>
            <p>{data.regularPrice}</p>
            <p>{data.publisher}</p>
            <p>{data.title}</p>
            <p>{data.bookDesc}</p>

        </div>

    </>);
};
const CategoryDisplay = ({category, search, setCategoryIds}) => {

    return (<div className={"category-display"}>
        {category.categoryName.includes(search) && <p onClick={() => {
            setCategoryIds(prev => {
                return [...prev, category.categoryId]
            })
        }}>
            {category.categoryName}
        </p>}

        {category.children.map(child => <CategoryDisplay setCategoryIds={setCategoryIds} key={child.categoryId}
                                                         category={child}/>)}
    </div>)
}
export default PageExtractData;