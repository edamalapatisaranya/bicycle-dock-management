const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const riderSchema = new mongoose.Schema({
  rider_id: {
    type: String,
    default: () => `rider:${uuidv4()}`,
    unique: true,
  },
  rider_name: {
    type: String,
    required: true,
  },
  cycle_model: {
    type: String,
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

riderSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: Date.now() });
});

module.exports = mongoose.model('Rider', riderSchema);
