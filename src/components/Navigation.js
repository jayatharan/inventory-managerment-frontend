import React from 'react'
import { Navbar, Container } from 'react-bootstrap';

const Navigation = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">
                    Inventory Management System
                </Navbar.Brand>
            </Container>
        </Navbar>
    )
}

export default Navigation
