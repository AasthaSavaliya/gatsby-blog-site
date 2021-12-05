import * as React from "react"
import {Link} from "gatsby"
import Header from '../components/header'
import Footer from '../components/footer'
import NewsItems from '../components/news-items'
import 'bootstrap';
import {Container} from 'react-bootstrap'

// markup
const IndexPage = () => {
    return (
      <>
          <Container>
              <Header/>
                <h1 className='text-center'>Home</h1>
                <NewsItems/>
              <Footer/>
          </Container>
      </>
  )
}

export default IndexPage