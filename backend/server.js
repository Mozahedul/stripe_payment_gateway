const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-with, Content-Type, Accept',
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/config', (req, res) => {
  res.json({
    publish_key: process.env.STRIPE_PUBLISH_KEY,
  });
});

app.use('/stripe', async (req, res) => {
  const userPrice = parseInt(req.body.price) * 100;
  const intent = await stripe.paymentIntents.create({
    amount: userPrice,
    currency: 'usd',
  });
  res.json({ client_secret: intent.client_secret, intent_id: intent.id });
});

// Handle payment confirmation
app.post('/confirm-payment', async (req, res) => {
  const paymentType = String(req.body.payment_type);
  if (paymentType == 'stripe') {
    const clientid = String(req.body.payment_id);
    stripe.paymentIntents.retrieve(clientid, function (err, paymentIntent) {
      if (err) {
        console.log(err);
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('confirmed stripe payment: ' + clientid);
      } else {
        res.json({ success: false });
      }
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join('./', '/frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
