const router = require("express").Router();
const Volleyball = require("../models/Volleyball");
const Scorer = require("../models/Scorer");

router.post("/initiate", async (req, res) => {
  const volleyball = new Volleyball();
  volleyball.title = req.body.title;
  volleyball.start_time = req.body.start_time;
  volleyball.scorer_id = req.body.scorer_id;
  volleyball.city = req.body.city;
  volleyball.venue = req.body.venue;
  volleyball.date = req.body.date;
  volleyball.team1 = req.body.team1;
  volleyball.team2 = req.body.team2;
  volleyball.status = "not_started";

  try {
    const savedvolleyball = await volleyball.save();
    res.json(savedvolleyball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/startgame", async (req, res) => {
  const volleyball = await Volleyball.findOne({ _id: req.body._id });
  volleyball.status = "live";
  const a = new Array();
  volleyball.score.score_sequence.push(a);

  volleyball.score.team1.points.push(0);
  volleyball.score.team2.points.push(0);
  volleyball.score.team1.set = 0;
  volleyball.score.team2.set = 0;

  const date_ob = new Date();
  volleyball.date = date_ob;

  try {
    const savedvolleyball = await volleyball.save();
    res.json(savedvolleyball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/addpoint", async (req, res) => {
  const volleyball = await Volleyball.findOne({ _id: req.body._id });
  if (req.body.teamname == volleyball.team1.name) {
    const last = volleyball.score.team1.points.length - 1;
    volleyball.score.team1.points[last] += 1;
  } else {
    const last = volleyball.score.team2.points.length - 1;
    volleyball.score.team2.points[last] += 1;
  }
  const last1 = volleyball.score.score_sequence.length - 1;

  volleyball.score.score_sequence[last1].push(req.body.teamname);

  try {
    const savedvolleyball = await volleyball.save();
    res.status(200).json(savedvolleyball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/undopoint", async (req, res) => {
  const volleyball = await Volleyball.findOne({ _id: req.body.id });
  const last = volleyball.score.team1.points.length() - 1;

  if (
    volleyball.score.team1.points[last] == 0 &&
    volleyball.score.team1.points[last] == 0
  ) {
    res.status(422).send("Both teams points are 0 as of now...!");
  }

  const last1 = volleyball.score.score_sequence.length() - 1;
  volleyball.score.score_sequence[last1].push(req.body.teamname);
  const teamname = volleyball.score.score_sequence.pop();

  if (teamname == volleyball.team1.name) {
    const last = volleyball.score.team1.points.length() - 1;
    volleyball.score.team1.points[last] -= 1;
  } else {
    const last = volleyball.score.team2.points.length() - 1;
    volleyball.score.team2.points[last] -= 1;
  }

  try {
    const savedvolleyball = await volleyball.save();
    res.json(savedvolleyball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/startnewset", async (req, res) => {
  const volleyball = await Volleyball.findOne({ _id: req.body._id });
  const a = new Array();
  volleyball.score.score_sequence.push(a);

  const teamname = req.body.teamname;

  if (teamname == volleyball.team1.name) {
    volleyball.score.team1.set += 1;
  } else {
    volleyball.score.team2.set += 1;
  }

  volleyball.score.team1.points.push(0);
  volleyball.score.team2.points.push(0);

  const date_ob = new Date();
  volleyball.date = date_ob;

  try {
    const savedvolleyball = await volleyball.save();
    res.json(savedvolleyball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/finish", async (req, res) => {
  const volleyball = await Volleyball.findOne({ _id: req.body._id });
  volleyball.status = "finished";
  const a = volleyball.score.team1.set;
  const b = volleyball.score.team2.set;
  if (a == b) volleyball.result = "Match tied";
  else if (a > b) volleyball.result = volleyball.team1.name + "Won";
  else volleyball.result = volleyball.team2.name + "Won";

  try {
    const savedvolleyball = await volleyball.save();
    res.json(savedvolleyball);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/getmatchesByscorer/:id", async (req, res) => {
  const volleyballmatch = await Volleyball.find({ scorer_id: req.params.id });
  try {
    res.json(volleyballmatch);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/getmatch/:id", async (req, res) => {
  try {
    const volleyballmatch = await Volleyball.findOne({ _id: req.params.id });
    res.status(200).send(volleyballmatch);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/deletematch/:id", async (req, res) => {
  try {
    await Volleyball.deleteOne({ _id: req.params.id });
    res.send("Deleted succesfully!!");
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
