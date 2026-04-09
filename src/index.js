const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const connectDB = require('./db');

const mongoose = require('mongoose');
const dockRoutes = require('./routes/dockRoutes');
const riderRoutes = require('./routes/riderRoutes');
const dockRiderRoutes = require('./routes/dockRiderRoutes');
const apiContracts = require('../api-contracts.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiContracts));

// Routes
app.use('/api/docks', dockRoutes);
app.use('/api/riders', riderRoutes);
app.use('/api/dock-riders', dockRiderRoutes);

// Clear all data
app.delete('/api/clear-data', async (_req, res) => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    res.json({ message: 'All data cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
