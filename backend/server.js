const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const stripe = require('stripe')(process.env.STRIPE_PUBLISH_KEY);

const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
