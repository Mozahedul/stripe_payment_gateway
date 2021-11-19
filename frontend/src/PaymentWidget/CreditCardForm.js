import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Field from './Field';

const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, segoe UI, sans-serif',
      fontSize: '18px',
      color: '#424770',
      fontSmoothing: 'antialiased',
      ':webkit-autofill': {
        color: '#cccccc',
      },
      '::placeholder': {
        color: '#888',
      },
    },

    invalid: {
      iconColor: 'red',
      color: 'red',
    },
  },
};

const CardField = ({ onChange }) => (
  <div className="FormRow">
    <CardElement options={CARD_OPTIONS} onChange={onChange} />
  </div>
);

const SubmitButton = ({ processing, error, children, disabled }) => (
  <button type="submit" disabled={processing || disabled}>
    {processing ? 'processing...' : children}
  </button>
);

const CreditCardForm = (props) => {
  const history = useHistory();

  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [price, setPrice] = useState();
  const [billingDetails, setBillingDetails] = useState({
    email: '',
    name: '',
    address: {
      line1: '',
      line2: '',
    },
  });

  const reset = () => {
    setError(null);
    setProcessing(false);
    setPrice();
    setSuccess(false);
    setCardComplete(false);
    setBillingDetails({
      email: '',
      name: '',
      address: {
        line1: '',
        line2: '',
      },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    if (error) {
      console.log(error);
      elements.getElement('card').focus();
      return;
    }

    if (price === 0) {
      return;
    }

    if (cardComplete) {
      setProcessing(true);
      setSuccess(true);
    } else {
      return;
    }

    const payload = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: billingDetails,
    });

    if (payload.error) {
      setError(payload.error);
      return;
    }

    const intentData = await axios
      .post('/stripe', { price: price })
      .then((response) => {
        return {
          secret: response.data.client_secret,
          id: response.data.intent_id,
        };
      })
      .catch((err) => {
        setError(err);
        return err;
      });

    const result = await stripe.confirmCardPayment(intentData.secret, {
      payment_method: payload.paymentMethod.id,
    });

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.paymentIntent.status === 'succeeded') {
      const confirmedPayment = await axios
        .post('/confirm-payment', {
          payment_id: intentData.id,
          payment_type: 'stripe',
        })
        .then((response) => {
          return response.data.success;
        })
        .catch((error) => {
          console.log(error);
          setError(error);
          return error;
        });

      if (confirmedPayment) {
        reset();
        setSuccess(true);
      }
    }
  };
  return (
    <Form className="Form" onSubmit={handleSubmit}>
      <Modal show={error != null}>
        <Modal.Header>
          <Modal.Title style={{ color: 'red' }}>
            Error! - Insert Correct Card Number{' '}
            <i class="fas fa-exclamation-triangle"></i>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <span
              style={{
                backgroundColor: 'red',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '30px',
                fontWeight: 'bold',
                fontSize: '15px',
              }}
            >
              {error}{' '}
            </span>{' '}
            <br />
            <hr /> If you do not have any payment account yet. Create an account
            and then try to complete the transaction here.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={(event) => setError(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={success}>
        <Modal.Header>
          <Modal.Title style={{ color: 'green' }}>
            Payment Succeeded <i class="far fa-check-circle"></i>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Your cart payment has been confirmed</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => history.push('/')}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Field
        label="Product Price"
        id="bet"
        type="number"
        placeholder="0"
        required
        autoComplete="tel"
        min="1"
        onChange={(event) => {
          if (event.target.value > 0) {
            setPrice(event.target.value);
          }
        }}
      />

      <fieldset className="FormGroup">
        <Field
          label="Name"
          id="name"
          type="text"
          placeholder="John Doe"
          required
          autoComplete="name"
          value={billingDetails.name}
          onChange={(event) => {
            setBillingDetails({ ...billingDetails, name: event.target.value });
          }}
        />
        <Field
          label="Email"
          id="email"
          type="email"
          placeholder="example@gmail.com"
          required
          autoComplete="email"
          value={billingDetails.email}
          onChange={(event) =>
            setBillingDetails({ ...billingDetails, email: event.target.value })
          }
        />

        <Field
          label="Billing Address"
          id="line1"
          type="address-line1"
          placeholder="1234 your street"
          required
          autoComplete="address-line1"
          value={billingDetails.address.line1}
          onChange={(event) => {
            setBillingDetails({
              ...billingDetails,
              address: {
                line1: event.target.value,
                line2: billingDetails.address.line2,
              },
            });
          }}
        />

        <Field
          label=""
          id="line2"
          type="address-line2"
          placeholder="building/suite number"
          autoComplete="address-line2"
          value={billingDetails.address.line2}
          onChange={(event) => {
            setBillingDetails({
              ...billingDetails,
              address: {
                line1: billingDetails.address.line1,
                line2: event.target.value,
              },
            });
          }}
        />
      </fieldset>

      <fieldset className="FormGroup">
        <CardField
          onChange={(event) => {
            console.log(event);
            setError(event.error && event.error.message);
            setCardComplete(event.complete);
          }}
        />
      </fieldset>

      <SubmitButton processing={processing} error={error} disabled={!stripe}>
        Make Payment
      </SubmitButton>
    </Form>
  );
};

export default CreditCardForm;
