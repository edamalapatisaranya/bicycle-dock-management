const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const dockRiderSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  dock_id: {
    type: String,
    required: true,
  },
  rider_id: {
    type: String,
    required: true,
  },
  rental_duration: {
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

dockRiderSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: Date.now() });
});

module.exports = mongoose.model('DockRider', dockRiderSchema);
