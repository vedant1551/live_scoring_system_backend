const router = require("express").Router();
const Football = require("../models/Football");
const Scorer = require("../models/Scorer");

router.post("/initiate", async (req, res) => {
  const football = new Football(req.body);

  football.status = "upcoming";

  try {
    const savedfootball = await football.save();
    res.json(savedfootball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/startgame", async (req, res) => {
  const football = await Football.findOne({ _id: req.body._id });
  football.status = "live";

  football.team1.playing11 = req.body.team1_playing11;
  football.team2.playing11 = req.body.team2_playing11;
  football.half = 1;

  football.team1.substitutes = req.body.team1_substitutes;
  football.team2.substitutes = req.body.team2_substitutes;

  football.score.team1.goal = 0;
  football.score.team2.goal = 0;

  const date_ob = new Date();
  football.date = date_ob;

  try {
    const savedfootball = await football.save();
    res.json(savedfootball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/addgoal", async (req, res) => {
  const football = await Football.findOne({ _id: req.body._id });
  if (req.body.teamname == football.team1.name) {
    football.score.team1.goal += 1;
    football.score.team1.scorer.push(req.body.scorer);
    football.score.team1.times.push(req.body.time);
  } else {
    football.score.team2.goal += 1;
    football.score.team2.scorer.push(req.body.scorer);
    football.score.team2.times.push(req.body.time);
  }
  football.score.score_sequence.push(req.body.teamname);

  try {
    const savedfootball = await football.save();
    res.status(200).json(savedfootball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/halftime", async (req, res) => {
  const football = await Football.findOne({ _id: req.body._id });
  football.half = 3;
  try {
    const savedfootball = await football.save();
    res.status(200).json(savedfootball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/startsecondhalf", async (req, res) => {
  const football = await Football.findOne({ _id: req.body._id });
  football.half = 2;
  const date_ob = new Date();
  football.date = date_ob;

  try {
    const savedfootball = await football.save();
    res.status(200).json(savedfootball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/undogoal", async (req, res) => {
  const football = await Football.findOne({ _id: req.body.id });
  if (football.score.team1.goal == 0 && football.score.team1.goal == 0) {
    res.status(422).send("Both teams goals are 0 as of now...!");
  }
  const teamname = football.score.score_sequence.pop();

  if (teamname == football.team1.name) {
    football.score.team1.goal = football.score.team1.goal - 1;
    football.score.team1.scorer.splice(-1, 1);
    football.score.team1.times.splice(-1, 1);
  } else {
    football.score.team2.goal = football.score.team2.goal - 1;
    football.score.team2.scorer.splice(-1, 1);
    football.score.team2.times.splice(-1, 1);
  }

  try {
    const savedfootball = await football.save();
    res.json(savedfootball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/addyellowcard", async (req, res) => {
  const football = await Football.findOne({ _id: req.body._id });
  if (req.body.teamname == football.team1.name) {
    football.yellow_card.team1.times.push(req.body.time);
    football.yellow_card.team1.player.push(req.body.player);
  } else {
    football.yellow_card.team2.times.push(req.body.time);
    football.yellow_card.team2.player.push(req.body.player);
  }

  try {
    const savedfootball = await football.save();
    res.json(savedfootball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/addredcard", async (req, res) => {
  const football = await Football.findOne({ _id: req.body._id });
  if (req.body.teamname == football.team1.name) {
    football.red_card.team1.times.push(req.body.time);
    football.red_card.team1.player.push(req.body.player);
  } else {
    football.red_card.team2.times.push(req.body.time);
    football.red_card.team2.player.push(req.body.player);
  }

  try {
    const savedfootball = await football.save();
    res.json(savedfootball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/substitute", async (req, res) => {
  const football = await Football.findOne({ _id: req.body._id });
  if (req.body.teamname == football.team1.name) {
    football.substitutions.team1.in.push(req.body.in);
    football.substitutions.team1.out.push(req.body.out);
    football.substitutions.team1.times.push(req.body.time);
  } else {
    football.substitutions.team2.in.push(req.body.in);
    football.substitutions.team2.out.push(req.body.out);
    football.substitutions.team2.times.push(req.body.time);
  }

  try {
    const savedfootball = await football.save();
    res.json(savedfootball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/finish", async (req, res) => {
  const football = await Football.findOne({ _id: req.body._id });
  football.status = "finished";
  const a = football.score.team1.goal;
  const b = football.score.team2.goal;
  if (a == b) football.result = "Match tied";
  else if (a > b) football.result = football.team1.name + "Won";
  else football.result = football.team2.name + "Won";

  try {
    const savedfootball = await football.save();
    res.json(savedfootball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/getmatchesByscorer/:id", async (req, res) => {
  const footballmatch = await Football.find({ scorer_id: req.params.id });
  try {
    res.json(footballmatch);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/getmatch/:id", async (req, res) => {
  try {
    const footballmatch = await Football.findOne({ _id: req.params.id });
    res.status(200).send(footballmatch);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/deletematch/:id", async (req, res) => {
  try {
    await Football.deleteOne({ _id: req.params.id });
    res.send("Deleted succesfully!!");
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/gettime", (req, res) => {
  const myDate = new Date();
  res.status(200).send(myDate);
});

router.get("/getallmatches", async (req, res) => {
  try {
    const footballmatches = await Football.find().sort({ _id: -1 });
    res.status(200).send(footballmatches);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
