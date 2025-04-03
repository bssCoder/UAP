const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add organization name'],
  },
  domains: [{
    _id: false,
    type: Map,
    of: String,
    required: true
  }],

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Organization', organizationSchema);