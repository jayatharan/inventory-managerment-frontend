import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Table, Form, Modal } from 'react-bootstrap'
import { Scrollbars } from 'react-custom-scrollbars-2';
import Axios from 'axios'
import QrReader from 'react-qr-reader'

import EditProduct from './EditProduct';

const CheckOutCounter = ({ getProducts }) => {

    const [checkout, setCheckout] = useState([])
    const [product, setProduct] = useState({})
    const [qty, setQty] = useState(0)
    const [scan, setScan] = useState(false)
    const [productId, setProductId] = useState("")
    const [refresh, doRefresh] = useState(0)
    const [customerData, setCustomerData] = useState({})
    const [order, setOrder] = useState(null)
    const [cash, setCash] = useState(0)
    const [showEdit, setShowEdit] = useState(false)

    const getProduct = () => {
        Axios({
            method: "GET",
            url: `/product/${productId}`
        }).then((response) => {
            setProduct(response.data)
            setProductId("")
        })
    }

    const placeOrder = () => {
        if (checkout.length > 0) {
            const data = {
                ...customerData,
                "orderItems": checkout
            }
            console.log(data)
            Axios({
                method: "POST",
                url: '/order/place_order',
                data: data
            }).then((response) => {
                setOrder(response.data)
                setCustomerData({})
            }).catch((err) => {
                setOrder(null)
            })
        }
    }

    const completeOrder = () => {
        Axios({
            method: "GET",
            url: `/order/complete/${order._id}`
        }).then((response) => {
            setOrder(null)
            setCustomerData({})
            setCash(0)
            setCheckout([])
            getProduct()
        })
    }

    const addToCheckout = () => {
        var item = {
            "id": product._id,
            "qty": parseInt(qty),
            "name": product.name,
            "subTtl": (qty * (product.price * (100 - product.discount) / 100))
        }
        if (qty > 0) {
            setCheckout([...checkout, item])
            setQty(0)
        }
    }

    const handleChange = (e) => {
        var name = e.target.name
        var value = e.target.value
        setCustomerData({ ...customerData, [name]: value })
    }

    const handleScan = (data) => {
        if (data) {
            setScan(false)
            setProductId(data)
            doRefresh(prev => prev + 1)
        }
    }

    const handleError = (err) => {
        console.log(err)
    }

    const getTotal = () => {
        var total = 0
        checkout.map(item => {
            total += item.subTtl
        })
        return total
    }

    const getTotalQty = () => {
        var ttlQty = 0
        checkout.map(item => {
            ttlQty += item.qty
        })
        return ttlQty
    }

    const removeFromCheckout = (id) => {
        setCheckout(checkout.filter((item) => {
            return item.id != id
        }))
    }

    useEffect(() => {
        getProduct()
    }, [refresh])

    const changeQty = (e) => {
        var qty = e.target.value
        if (qty <= product.qty) {
            if (qty < 0) {
                qty = -1 * (qty)
            }
            setQty(qty)
        }
    }

    return (
        <Card>
            <Modal show={showEdit} onHide={() => setShowEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditProduct product={product} setProduct={setProduct} getProducts={getProducts} />
                </Modal.Body>
            </Modal>
            <Row>
                <Col lg={5} className="">
                    {scan ? (
                        <div style={{ position: "relative" }}>
                            <QrReader
                                delay={300}
                                style={{ width: '100%' }}
                                onError={handleError}
                                onScan={handleScan}
                            />
                            <button style={{ position: "absolute", top: 0, right: 0, zIndex: 99 }} onClick={() => setScan(false)}>X</button>
                        </div>
                    ) : (
                        <Card className="w-100 p-1">
                            <div>
                                <Button variant="success" size="sm" className="w-100" onClick={() => setScan(true)}>Open Scanner</Button>
                                <small>Product_Id : </small>
                                <small>
                                    <input className="w-100" type="Text" value={productId} onChange={(e) => setProductId(e.target.value)} />
                                </small>
                                <Button className="w-100 mt-1" size="sm" onClick={getProduct}>Get Item</Button>
                            </div>
                        </Card>
                    )}
                </Col>
                <Col lg={7}>
                    <Card className="w-100">
                        <Card.Body className="p-1">
                            <Card.Title className="mb-0" >
                                <div className="d-flex justify-content-between">
                                    <span>{product.name || "Non"}</span>
                                    <span className="user-select-none" onClick={() => setShowEdit(true)} ><small>Edit</small></span>
                                </div>
                            </Card.Title>
                            <div><small>Price : </small><small>{product.price && (product.price).toFixed(2)}</small></div>
                            <div><small>Discount : </small><small>{product.discount} %</small></div>
                            <div><small>Quantity : </small><small><input type="Number" value={qty} onChange={changeQty} /></small></div>
                            <hr className="my-1" />
                            <div><small>Total : </small><small>{(qty * (product.price * ((100 - product.discount) / 100))).toFixed(2)}</small></div>
                        </Card.Body>
                        {order ? "" : (
                            <div className="px-1 mb-1 mt-0">
                                <Button variant="primary" size="sm" className="w-100 py-0" onClick={addToCheckout} >Add to Checkout</Button>
                            </div>
                        )}
                    </Card>
                </Col>
                {order ? "" : (
                    <Col className="mt-1" lg={12}>
                        <Scrollbars style={{ height: "45vh" }}>
                            <Table striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Qty</th>
                                        <th>SubTotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checkout.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{item.name}</td>
                                            <td className="text-center">{item.qty}</td>
                                            <td className="text-end" >{item.subTtl.toFixed(2)}</td>
                                            <td className="text-center text-danger user-select-none" onClick={() => removeFromCheckout(item.id)}>X</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Scrollbars>
                    </Col>
                )}
                <Col lg={12}>
                    {order ? (
                        <Card className="w-100 px-1 pb-1">
                            <Scrollbars style={{ height: "45vh" }}>
                                <b>Order Details</b>
                                <div><small>Order_Id : </small><small>{order._id}</small></div>
                                <small>Order Items   (STWD - Sub Total with discount)</small>
                                <ul className="mb-0">
                                    <table>
                                        <thead>
                                            <tr>
                                                <td><small>Name</small></td>
                                                <td className="text-center"><small>Qty</small></td>
                                                <td className="text-end"><small>STWD</small></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.products.map((item) => (
                                                <tr>
                                                    <td><small>{item.name}</small></td>
                                                    <td className="text-center"><small>{item.qty}</small></td>
                                                    <td className="text-end"><small>{(item.qty * item.o_price).toFixed(2)}</small></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </ul>
                                <div><small>Total : </small><small>{order.total.toFixed(2)}</small></div>
                                <div><small>Total Discount : </small><small>{order.total_discount.toFixed(2)}</small></div>
                                <div><b>Total Sales : {order.total_with_discount.toFixed(2)}</b></div>
                                <div><small>Cash : </small><input type="Number" value={cash} onChange={(e) => setCash(e.target.value)} /></div>
                                <div><b>Change : {(cash - order.total_with_discount).toFixed(2)}</b></div>
                            </Scrollbars>
                            <div>
                                <Button className="w-50" size="sm" variant="success" onClick={completeOrder} >Complete Order</Button>
                                <Button className="w-50" size="sm" variant="danger">Cancel Order</Button>
                            </div>
                        </Card>
                    ) : (
                        <Card className="w-100">
                            <div className="d-flex justify-content-evenly" >
                                <span><b>No of Items: {checkout.length}</b></span>
                                <span><b>Total Qty: {getTotalQty()}</b></span>
                                <span><b>Total: {getTotal().toFixed(2)}</b></span>
                            </div>
                            <div className="px-1">
                                <div className="d-flex column mb-1">
                                    <Form.Control name="name" size="sm" type="text" value={customerData.name} onChange={handleChange} placeholder="Customer Name" />
                                    <Form.Control name="phoneNo" size="sm" type="Number" value={customerData.phoneNo} onChange={handleChange} placeholder="Customer PhoneNo" />
                                </div>
                                <Form.Control name="address" size="sm" type="text" value={customerData.address} onChange={handleChange} placeholder="Customer Address" />
                                <Button className="w-100 my-1" size="sm" onClick={placeOrder} >Place Order</Button>
                            </div>
                        </Card>
                    )}
                </Col>
            </Row>
        </Card>
    )
}

export default CheckOutCounter
