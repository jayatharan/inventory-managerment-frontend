import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import Axios from 'axios'

const AddProduct = ({ updateProduct }) => {
    const [showStatus, setShowStatus] = useState(false)
    const [status, setStatus] = useState(false)
    const [productData, setProductData] = useState({
        "name": "",
        "description": "",
        "price": 0.00,
        "discount": 0,
        "qty": 0,
        "margin": 0
    })

    const handleChange = (e) => {
        var name = e.target.name
        var value = e.target.value
        setProductData({ ...productData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        Axios({
            method: "POST",
            url: "/product",
            data: productData
        }).then((response) => {
            updateProduct(response.data)
            setProductData({
                "name": "",
                "description": "",
                "price": 0.00,
                "discount": 0,
                "qty": 0,
                "margin": 0
            })
            setStatus(true)
            setShowStatus(true)
            setTimeout(() => setShowStatus(false), 2000);
        }).catch((err) => {
            setStatus(false)
            setShowStatus(true)
            setTimeout(() => setShowStatus(false), 2000);
        })
    }

    return (
        <div>
            {showStatus && (<Alert className="py-1" variant={status ? 'success' : 'danger'} >{status ? 'Product Added Successfully' : 'Something went wrong. Try again'}</Alert>)}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="" controlId="productName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control size="sm" type="text" name={"name"} placeholder="Product Name" value={productData.name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="" controlId="productDescription">
                    <Form.Label>Product Description</Form.Label>
                    <Form.Control as="textarea" name={"description"} rows={3} value={productData.description} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="" controlId="productDiscount">
                    <Form.Label>Discount (%)</Form.Label>
                    <Form.Control size="sm" type="Number" name={"discount"} placeholder="Discount %" value={productData.discount} onChange={handleChange} max={100} min={0} required />
                </Form.Group>
                <Form.Group className="" controlId="productMargin">
                    <Form.Label>Margin (%)</Form.Label>
                    <Form.Control size="sm" type="Number" name={"margin"} placeholder="Margin %" value={productData.margin} onChange={handleChange} required max={100} min={0} />
                </Form.Group>
                <Form.Group className="" controlId="productQuantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control size="sm" type="Number" name={"qty"} placeholder="Quantit" required value={productData.qty} onChange={handleChange} min={1} />
                </Form.Group>
                <Form.Group className="" controlId="productPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control size="sm" type="Number" name={"price"} placeholder="Price" required value={productData.price} onChange={handleChange} min={1} />
                </Form.Group>
                <Button variant="primary" size="sm" type="submit" className="w-100 mt-2">
                    Add Product
                </Button>
            </Form>
        </div>
    )
}

export default AddProduct
