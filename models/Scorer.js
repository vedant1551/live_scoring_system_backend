const mongoose = require('mongoose');
const scorerschema = new mongoose.Schema({


    username: {

    type: String,
    required: true,
    max: 255,
    min: 3

    },


    email: {

    type: String,
    required: true,
    max: 255,
    min: 6

    },

    password: {

    type: String,
    required: true,
    min: 6,
    max: 255

    },
    mobileno: {

        type: String,
        required: true,
        max: 10,
        min:10
    
        },
    
    football_match:[{

                type: String
    }]    

    


});

module.exports = mongoose.model('scorer',scorerschema);