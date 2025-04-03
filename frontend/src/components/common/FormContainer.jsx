import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // Add Row and Col to the imports

const FormContainer = ({ children }) => {
  return (
    <Container className="py-3">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;