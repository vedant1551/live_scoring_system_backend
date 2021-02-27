const mongoose = require("mongoose");
const volleyballschema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 255,
    min: 3,
  },

  start_time: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  result: {
    type: String,
  },
  scorer_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },

  city: {
    type: String,
    required: true,
    min: 3,
    max: 25,
  },

  venue: {
    type: String,
    required: true,
    min: 3,
    max: 55,
  },
  status: {
    type: String,
    required: true,
    min: 3,
    max: 15,
  },

  team1: {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 15,
    },

    squad: [
      {
        type: String,
      },
    ],

    headcoach: {
      type: String,
      min: 3,
      max: 15,
    },
  },

  team2: {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 15,
    },

    squad: [
      {
        type: String,
      },
    ],

    headcoach: {
      type: String,
      min: 3,
      max: 15,
    },
  },

  score: {
    team1: {
      set: {
        type: Number,
      },
      points: [
        {
          type: Number,
        },
      ],
    },

    team2: {
      set: {
        type: Number,
      },
      points: [
        {
          type: Number,
        },
      ],
    },

    score_sequence: [
      [
        {
          type: String,
        },
      ],
    ],
  },
});

module.exports = mongoose.model("Volleyball", volleyballschema);
