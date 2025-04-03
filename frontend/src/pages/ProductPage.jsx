import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Rating from '../components/product/Rating';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { listProductDetails } from '../redux/actions/productActions';

const ProductPage = () => {
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access productDetails state from Redux store
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  // Fetch product details when the component mounts or product ID changes
  useEffect(() => {
    if (id) {
      dispatch(listProductDetails(id)); // Dispatch action to fetch product details
    }
  }, [dispatch, id]);

  const addToCartHandler = () => {
    // Navigate to the cart page with the selected quantity
    navigate(`/cart/${id}?qty=${qty}`);
  };

  // Early return patterns for readability and error handling
  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!product) return <Message variant="info">Product not found</Message>;

  // Handle missing or malformed image URL
  const imageUrl = product.image ? product.image : '/images/placeholder.png';

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      
      <Row>
        <Col md={6}>
          {/* Handle case where image might be missing */}
          <Image src={imageUrl} alt={product.name} fluid />
        </Col>
        
        <Col md={3}>
          <ListGroup variant="flush">
            {/* Product Name */}
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            
            {/* Rating and number of reviews */}
            <ListGroup.Item>
              <Rating
                value={product.rating || 0} // Handle missing rating
                text={`${product.numReviews || 0} reviews`} // Handle missing number of reviews
              />
            </ListGroup.Item>
            
            {/* Product Price */}
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            
            {/* Product Description */}
            <ListGroup.Item>
              Description: {product.description || 'No description available.'}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              {/* Product Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              {/* Product Stock Status */}
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                  </Col>
                </Row>
              </ListGroup.Item>

              {/* Quantity selector if in stock */}
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              {/* Add to Cart Button */}
              <ListGroup.Item>
                <Button
                  onClick={addToCartHandler}
                  className="btn-block"
                  type="button"
                  disabled={product.countInStock === 0}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductPage;
