import * as React from "react";
import {Container, Nav} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'

export const Navbar = () => {
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>Navbar</Navbar.Brand>
                    <Nav className="me-auto">
                        <LinkContainer to="/"><Nav.Link>Home</Nav.Link></LinkContainer>
                        <LinkContainer to="/about"><Nav.Link>About</Nav.Link></LinkContainer>
                        <LinkContainer to="/contact"><Nav.Link>Contact</Nav.Link></LinkContainer>
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}