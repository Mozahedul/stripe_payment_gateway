import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Button, Col, Container, Jumbotron, Row } from 'react-bootstrap';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import PaymentComponent from './PaymentWidget/PaymentComponent';

const stripe_key =
  // eslint-disable-next-line no-undef
  'pk_test_51HrpB1A3RwZlQsxbFQeHBjXsTwtX3YqONyZRAIYzFzsI2ZcvsEufbX1rxQyErncr5WhIfshm321iZn7mnejr54jd008TWAX7Qm';
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/payments">
          <Container>
            <Row className="justify-content-md-center">
              <Col xs md="6">
                <PaymentComponent keys={{ stripe: stripe_key }} />
              </Col>
            </Row>
          </Container>
        </Route>

        <Route path="/">
          <Container>
            <Jumbotron className="mt-5">
              <h1>Stripe Payment Gateway</h1>
              <h4>
                Online payment processing for internet businesses. Stripe is a
                suite of payment APIs that powers commerce for online businesses
                of all sizes
              </h4>
              <Link to="/payments" type="button" className="mt-3">
                <Button variant="success">Make a payment</Button>
              </Link>
            </Jumbotron>
          </Container>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
