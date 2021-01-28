const mongoose = require('mongoose');
const footballschema = new mongoose.Schema({


    title: {

    type: String,
    required: true,
    max: 255,
    min: 3

    },


    start_time: {

    type: String,
    required: true,
    max: 255,
    min: 6

    },

    game_time: {

    type: Number,
    required: true,
    min: 20,
    max: 90

    },
    result:{

          type: String 

    },
    
    scorer_id:{

        type: String,
        required: true 

  },
    date: {

        type: Date,
        required: true,
        
    
    },
    
    city: {

        type: String,
        required: true,
        min: 3,
        max: 25

    },

    
    venue: {

        type: String,
        required: true,
        min: 3,
        max: 55

    },
    status: {

        type: String,
        required: true,
        min: 3,
        max: 15

    },
    no_of_substitutes:{

            type: Number,
            required: true,
            min:1
            

    },

    team1:{

        name: {

            type: String,
            required: true,
            min: 3,
            max: 15
    
        },

        squad: [{

               type: String


        }],
        
        playing11: [{

            type: String


        }],
        substitutes: [{

            type: String


        }],

        headcoach: {

            type: String,
            min: 3,
            max: 15
    
        }



    },

    team2:{

        name: {

            type: String,
            required: true,
            min: 3,
            max: 15
    
        },

        squad: [{

               type: String


        }],
        
        playing11: [{

            type: String


        }],
        substitutes: [{

            type: String


        }],

        headcoach: {

            type: String,
            min: 3,
            max: 15
    
        }



    },

    score:{

        
        team1:{

            goal:{
                    type: Number
            },

            times:[{
                type: Number

            }],
            scorer:[{

                type: String,
                min:3,
                max:15    
            }]
        },

        team2:{

            
            goal:{
                type: Number
             },

            times:[{
                type: Number

            }],
            scorer:[{

                type: String,
                min:3,
                max:15    
            }]
        },

        score_sequence:[{
            type:String
        }]

    },

    substitutions:{

         
        team1:{

            times:[{
                type: Number

            }],

            in:[{

                type: String,
                min:3,
                max:15    
            }],

            out:[{

                type: String,
                min:3,
                max:15    
            }]
        },

        team2:{

            times:[{
                type: Number

            }],
            
            in:[{

                type: String,
                min:3,
                max:15    
            }],

            out:[{

                type: String,
                min:3,
                max:15    
            }]
        }       

    },

    yellow_card:{

        team1:{

            times:[{
                type: Number

            }],
            player:[{

                type: String,
                min:3,
                max:15    
            }]
        },

        team2:{

            times:[{
                type: Number

            }],
            player:[{

                type: String,
                min:3,
                max:15    
            }]
        }

    },

    red_card:{

        team1:{

            times:[{
                type: Number

            }],
            player:[{

                type: String,
                min:3,
                max:15    
            }]
        },

        team2:{

            times:[{
                type: Number

            }],
            player:[{

                type: String,
                min:3,
                max:15    
            }]
        }

    }





    


});

module.exports = mongoose.model('Football',footballschema);