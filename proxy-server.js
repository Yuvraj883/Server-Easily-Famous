const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3001; // You can change the port if needed

app.use(bodyParser.json());

const key = 'e4c8c15861780f3a9ad8288cd3e8f0a7';
const baseURL = 'https://indianprovider.com/api/v2';

// Middleware to handle CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Proxy POST requests
app.post('/api/v2', async (req, res) => {
  try {
    const { key, action, service, link, quantity } = req.body;

    const response = await axios.post(baseURL, {
      key,
      action,
      service,
      link,
      quantity,
    }, {
      headers: {
        'Content-Type': 'application/json',
        // You can include other headers if needed
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(error.response ? error.response.status : 500).json({ error: 'Internal Server Error' });
  }
});

// Proxy GET requests
app.get('/api/v2', async (req, res) => {
  try {
    const { key, action } = req.query;

    const response = await axios.get(`${baseURL}?key=${key}&action=${action}`, {
      headers: {
        'Content-Type': 'application/json',
        // You can include other headers if needed
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(error.response ? error.response.status : 500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
