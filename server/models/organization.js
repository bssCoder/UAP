const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add organization name'],
  },
  domains: {
    type: Map,
    of: String,
    required: true,
    default: new Map()
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Organization', organizationSchema);