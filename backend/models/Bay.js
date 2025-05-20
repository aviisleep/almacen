const mongoose = require('mongoose');

const baySchema = new mongoose.Schema({
  name: { type: String, required: true },
  vehicles: [
    {
      name: String,
      products: [
        {
          productName: String,
          cantidad: Number,
        },
      ],
    },
  ],
});

module.exports = mongoose.model('Bay', baySchema);