const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const dockSchema = new mongoose.Schema({
  dock_id: {
    type: String,
    default: () => `dock:${uuidv4()}`,
    unique: true,
  },
  dock_location: {
    type: String,
    required: true,
  },
  parking_capacity: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now(),
  },
}, { timestamps: false });

dockSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: Date.now() });
});

module.exports = mongoose.model('Dock', dockSchema);
