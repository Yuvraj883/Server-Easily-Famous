const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3001;

app.use(bodyParser.json());

const key = '8ec7fffe5c6d104a15a0232b765a56f6';
const baseURL = 'https://indianprovider.com/api/v2';

// Middleware to handle CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Rate Limiter
const limiter = rateLimit({
  windowMs: 6 * 60 * 60 * 1000, // 6 hours
  max: 1, // Allow only 1 request per 6-hour window per IP
  message: 'You have already claimed within the last 6 hours.',
});

// Apply the rate limiter only to the specific route(s) you want
app.post('/api/v2', limiter, async (req, res) => {
  try {
    const action = 'add';
    const service = 2572;
    const quantity = 10;
    const { link } = req.body;

    const response = await axios.post(
      baseURL,
      { key, action, service, link, quantity },
      { headers: { 'Content-Type': 'application/json' } }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(error.response ? error.response.status : 500).json({ error: 'Internal Server Error' });
  }
});

// Proxy GET requests
app.get('/api/v2', limiter, async (req, res) => {
  try {
    const { key, action } = req.query;

    const response = await axios.get(`${baseURL}?key=${key}&action=${action}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(error.response ? error.response.status : 500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
