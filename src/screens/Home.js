import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Modal } from 'react-bootstrap';
import Axios from 'axios'

import Products from '../components/Products';
import AddProduct from '../components/AddProduct';
import CheckOutCounter from '../components/CheckOutCounter'

const Home = () => {

    const [products, setProducts] = useState([])
    const [showAdd, setShowAdd] = useState(false)

    useEffect(() => {
        getProducts()
    }, [])

    const getProducts = () => {
        Axios({
            method: "GET",
            url: "/product"
        }).then((response) => {
            setProducts(response.data)
        })
    }

    const updateProduct = (product) => {
        setProducts([...products, product])
    }

    return (
        <Container fluid>
            <Modal show={showAdd} onHide={() => setShowAdd(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddProduct updateProduct={updateProduct} />
                </Modal.Body>
            </Modal>
            <Row>
                <Col lg={7} >
                    <Products products={products} setShowAdd={setShowAdd} />
                </Col>
                <Col lg={5} ><CheckOutCounter getProducts={getProducts} /></Col>
            </Row>
        </Container>
    )
}

export default Home
