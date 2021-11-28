import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import CreditCardForm from './CreditCardForm';
import './Element.css';
import './PaymentComponent.css';

const PaymentComponent = (props) => {
  let history = useHistory();
  return (
    <Card id="paymentWidgetContainerCard" className="mt-5">
      <Card.Header>
        <Row>
          <Col md="auto">
            <Button
              variant="danger"
              onClick={() => {
                history.push('/');
              }}
            >
              Back
            </Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {/* 
        loadStripe() is a function which return a stripe object or promise to Elements provider.
        Elements is Elements provider which pass the strip object to nested component 

          */}
        <CreditCardForm />
      </Card.Body>
    </Card>
  );
};

export default PaymentComponent;
