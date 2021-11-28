import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Button, Col, Container, Jumbotron, Row } from 'react-bootstrap';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import PaymentComponent from './PaymentWidget/PaymentComponent';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/payments">
          <Container>
            <Row className="justify-content-md-center">
              <Col xs md="6">
                <PaymentComponent />
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
