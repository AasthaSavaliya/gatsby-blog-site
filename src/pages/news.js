import * as React from "react"
import {Link, graphql} from "gatsby"
import Header from "../components/header";
import Footer from "../components/footer";
import NewsItems from "../components/news-items";

// markup
const NewsPage = () => {
    return (
        <>
            <Header/>
                <NewsItems/>
            <Footer/>
        </>
    )
}

export default NewsPage