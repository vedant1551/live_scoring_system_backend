const mongoose = require('mongoose');
const adminschema = new mongoose.Schema({

    username: {

    type: String,
    required: true,
    max: 255,
    min: 3
    },

    password: {

    type: String,
    required: true,
    min: 6,
    max: 255

    }
});

module.exports = mongoose.model('admin',adminschema);