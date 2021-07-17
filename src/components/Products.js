import React from 'react'
import { Card, Table, Button } from 'react-bootstrap'
import { Scrollbars } from 'react-custom-scrollbars-2';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Products = ({ products, setShowAdd }) => {

    return (
        <Card className="w-100">
            <div className="d-flex justify-content-between">
                <h4>Product List</h4>
                <Button variant="primary" size="sm" onClick={() => setShowAdd(true)} >Add Product</Button>
            </div>
            <Scrollbars style={{ height: "85vh" }}>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Discount</th>
                            <th>Margin</th>
                            <th>Avl Qty</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td className="user-select-none">
                                    <CopyToClipboard text={product._id}>
                                        <span>{product.name}</span>
                                    </CopyToClipboard>
                                </td>
                                <td className="text-center">{product.discount}%</td>
                                <td className="text-center">{product.margin}%</td>
                                <td className="text-center">{product.qty}</td>
                                <td className="text-end">{product.price.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Scrollbars>
        </Card>
    )
}

export default Products
