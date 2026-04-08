const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  rider_id: {
    type: Number,
    required: true,
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
