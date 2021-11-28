import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

(async () => {
  const { publish_key } = await fetch('/config').then((response) =>
    response.json(),
  );
  const stripePromise = loadStripe(publish_key);

  ReactDOM.render(
    <Elements stripe={stripePromise}>
      <App />
    </Elements>,
    document.getElementById('root'),
  );
})();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
