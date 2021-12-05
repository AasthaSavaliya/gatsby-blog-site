import * as React from "react"
import {Link} from "gatsby"

// markup
const Header = () => {
    return (
        <>
            <Link to="/">Home</Link>
            <Link to="/news">News</Link>
            <Link to="/contact">Contact</Link>
        </>
    )
}

export default Header