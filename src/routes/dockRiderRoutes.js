const express = require('express');
const router = express.Router();
const DockRider = require('../models/DockRider');

// Create
router.post('/', async (req, res) => {
  try {
    const dockRider = new DockRider(req.body);
    const saved = await dockRider.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const dockRiders = await DockRider.find();
    res.json(dockRiders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read by id
router.get('/:id', async (req, res) => {
  try {
    const dockRider = await DockRider.findOne({ id: req.params.id });
    if (!dockRider) return res.status(404).json({ error: 'DockRider not found' });
    res.json(dockRider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const dockRider = await DockRider.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!dockRider) return res.status(404).json({ error: 'DockRider not found' });
    res.json(dockRider);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const dockRider = await DockRider.findOneAndDelete({ id: req.params.id });
    if (!dockRider) return res.status(404).json({ error: 'DockRider not found' });
    res.json({ message: 'DockRider deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
