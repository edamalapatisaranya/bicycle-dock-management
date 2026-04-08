const express = require('express');
const router = express.Router();
const Dock = require('../models/Dock');

// Create
router.post('/', async (req, res) => {
  try {
    const dock = new Dock(req.body);
    const saved = await dock.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const docks = await Dock.find();
    res.json(docks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read by dock_id
router.get('/:dock_id', async (req, res) => {
  try {
    const dock = await Dock.findOne({ dock_id: req.params.dock_id });
    if (!dock) return res.status(404).json({ error: 'Dock not found' });
    res.json(dock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put('/:dock_id', async (req, res) => {
  try {
    const dock = await Dock.findOneAndUpdate(
      { dock_id: req.params.dock_id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!dock) return res.status(404).json({ error: 'Dock not found' });
    res.json(dock);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:dock_id', async (req, res) => {
  try {
    const dock = await Dock.findOneAndDelete({ dock_id: req.params.dock_id });
    if (!dock) return res.status(404).json({ error: 'Dock not found' });
    res.json({ message: 'Dock deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
