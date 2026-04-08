const mongoose = require('mongoose');

const dockSchema = new mongoose.Schema({
  dock_id: {
    type: Number,
    required: true,
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
    type: Number, // epoch milliseconds
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number, // epoch milliseconds
    default: () => Date.now(),
  },
}, { timestamps: false });

dockSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: Date.now() });
});

module.exports = mongoose.model('Dock', dockSchema);
