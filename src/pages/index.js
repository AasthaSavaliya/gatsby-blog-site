import * as React from "react"
import {Link} from "gatsby"
import Header from '../components/header'
import Footer from '../components/footer'
import NewsItems from '../components/news-items'

// markup
const IndexPage = () => {
    return (
      <>
          <Header/>
            <NewsItems/>
          <Footer/>
      </>
  )
}

export default IndexPage