import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Card, Row, Button, Col } from 'react-bootstrap';
import CreditCardForm from './CreditCardForm';
import './PaymentComponent.css';
import './Element.css';
import { useHistory } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

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
        <Elements stripe={loadStripe(props.keys.stripe)}>
          <CreditCardForm />
        </Elements>
      </Card.Body>
    </Card>
  );
};

export default PaymentComponent;
