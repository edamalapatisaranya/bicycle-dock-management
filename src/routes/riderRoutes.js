const express = require('express');
const router = express.Router();
const Rider = require('../models/Rider');

// Create
router.post('/', async (req, res) => {
  try {
    const rider = new Rider(req.body);
    const saved = await rider.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const riders = await Rider.find();
    res.json(riders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read by rider_id
router.get('/:rider_id', async (req, res) => {
  try {
    const rider = await Rider.findOne({ rider_id: req.params.rider_id });
    if (!rider) return res.status(404).json({ error: 'Rider not found' });
    res.json(rider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:rider_id', async (req, res) => {
  try {
    const rider = await Rider.findOneAndUpdate(
      { rider_id: req.params.rider_id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!rider) return res.status(404).json({ error: 'Rider not found' });
    res.json(rider);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:rider_id', async (req, res) => {
  try {
    const rider = await Rider.findOneAndDelete({ rider_id: req.params.rider_id });
    if (!rider) return res.status(404).json({ error: 'Rider not found' });
    res.json({ message: 'Rider deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
