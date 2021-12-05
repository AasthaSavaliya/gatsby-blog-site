import * as React from "react"
import {Link, graphql} from "gatsby"
import Header from "../components/header";
import Footer from "../components/footer";
import NewsItems from "../components/news-items";
import {Container} from "react-bootstrap";

// markup
const NewsPage = () => {
    return (
        <>
            <Container>
                <Header/>
                <h1>News</h1>
                <NewsItems/>
                <Footer/>
            </Container>
        </>
    )
}

export default NewsPage