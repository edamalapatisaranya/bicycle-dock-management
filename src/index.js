const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const connectDB = require('./db');

const dockRoutes = require('./routes/dockRoutes');
const riderRoutes = require('./routes/riderRoutes');
const dockRiderRoutes = require('./routes/dockRiderRoutes');
const apiContracts = require('../api-contracts.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiContracts));

// Routes
app.use('/api/docks', dockRoutes);
app.use('/api/riders', riderRoutes);
app.use('/api/dock-riders', dockRiderRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
