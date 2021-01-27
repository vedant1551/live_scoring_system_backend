const router = require("express").Router();
const Football = require("../models/Football");
const Scorer = require("../models/Scorer");

router.post("/initiate", async (req, res) => {
    const football = new Football(req.body);
    const scorer = await Scorer.findOne({ _id: req.body.id });
    
    football.status = "not_started";
    try {
      const savedfootball = await football.save();
      scorer.football_match.push(savedfootball._id);
      const savedscorer = await scorer.save();
      res.send(savedfootball);
    } catch (err) {
    
      res.status(400).send(err);
    }
  });
  

router.post("/startgame", async (req, res) => {
    const football = await Football.findOne({ _id: req.body._id });
    football.status = "live";
    football.team1.playing11 = req.body.team2_playing11;
    football.team2.playing11 = req.body.team1_playing11;
    football.team1.substitutes = req.body.team2_substitutes;
    football.team2.substitutes = req.body.team1_substitutes;
    football.score.team1.goal=0;
    football.score.team2.goal=0;
    const date_ob = new Date();
    football.Date = date_ob;
    try {
      const savedfootball = await football.save();
      res.send(savedfootball);
    } catch (err) {
      res.status(400).send(err);
    }
  });


router.post("/addgoal", async (req, res) => {
    const football = await Football.findOne({ _id: req.body._id });
    if(req.body.teamname == football.team1.name)
    {
        
        football.score.team1.goal += 1;
        football.score.team1.scorer.push(req.body.scorer);
        football.score.team1.times.push(req.body.time);

    }
    else
    {

        football.score.team2.goal += 1;
        football.score.team2.scorer.push(req.body.scorer);
        football.score.team2.times.push(req.body.time);  
    }
    football.score.score_sequence.push(req.body.teamname);

    try {
      const savedfootball = await football.save();
      res.send(savedfootball);
    } catch (err) {
      res.status(400).send(err);
    }
  });

router.post("/undogoal", async (req, res) => {
    const football = await Football.findOne({ _id: req.body._id });
    if( (football.score.team1.goal == 0) && (football.score.team1.goal == 0) )
    {

        res.status(422).send("Both teams goals are 0 as of now...!");

    }
    const teamname =  football.score.score_sequence.pop();

    if(teamname == football.team1.name)
    {
        football.score.team1.goal = football.score.team1.goal - 1;
        football.score.team1.scorer.splice(-1,1);
        football.score.team1.times.splice(-1,1);

    }
    else
    {

        football.score.team2.goal = football.score.team2.goal - 1;
        football.score.team2.scorer.splice(-1,1);
        football.score.team2.times.splice(-1,1);
    }
  
    try {
      const savedfootball = await football.save();
      res.send(savedfootball);
    } catch (err) {
      res.status(400).send(err);
    }
  });

router.post("/addyellowcard", async (req, res) => {
    const football = await Football.findOne({ _id: req.body._id });
    if(req.body.teamname == football.team1.name)
    {
        football.yellow_card.team1.times.push = req.body.time;
        football.yellow_card.team1.player.push = req.body.player;
        
    }
    else
    {

        football.yellow_card.team2.times.push = req.body.time;
        football.yellow_card.team2.player.push = req.body.player;
    }
    
    try {
      const savedfootball = await football.save();
      res.send(savedfootball);
    } catch (err) {
      res.status(400).send(err);
    }
  });


router.post("/addredcard", async (req, res) => {
    const football = await Football.findOne({ _id: req.body._id });
    if(req.body.teamname == football.team1.name)
    {
        football.red_card.team1.times.push = req.body.time;
        football.red_card.team1.player.push = req.body.player;
        
    }
    else
    {

        football.red_card.team2.times.push = req.body.time;
        football.red_card.team2.player.push = req.body.player;
    }
    
    try {
      const savedfootball = await football.save();
      res.send(savedfootball);
    } catch (err) {
      res.status(400).send(err);
    }
  });

router.post("/substitute", async (req, res) => {
    const football = await Football.findOne({ _id: req.body._id });
    if(req.body.teamname == football.team1.name)
    {
        football.substitutions.team1.in.push(req.body.in);
        football.substitutions.team1.out.push(req.body.out);
        football.substitutions.team1.times.push(req.body.time);
        
    }
    else
    {

        football.substitutions.team2.in.push(req.body.in);
        football.substitutions.team2.out.push(req.body.out);
        football.substitutions.team2.times.push(req.body.time);
    }
    
    try {
      const savedfootball = await football.save();
      res.send(savedfootball);
    } catch (err) {
      res.status(400).send(err);
    }
  });

  router.post("/finish", async (req, res) => {
    const football = await Football.findOne({ _id: req.body._id });
    football.status = "finished";
    const a = football.score.team1.goal;
    const b = football.score.team2.goal;
    if(a == b)
         football.result = "Match tied"
    else if(a > b)
         football.result = football.team1.name + "Won";
    else
         football.result = football.team2.name + "Won";
      
         try {
            const savedfootball = await football.save();
            res.send(savedfootball);
          } catch (err) {
            res.status(400).send(err);
          }
        

});

router.get("/getmatchesByscorer", async(req, res) => {
  
  
  const scorer = await Scorer.findOne({ _id: req.body.id });
  if (!scorer) return res.status(404).send("User does not exist!");
  const id1 = scorer.football_match.slice();
  let footballmatch = new Array();
  let tmp;
  
 
  try{
    
  //console.log(id1[0]);
     id1.forEach( async(element,index) => {

      const temp = await Football.findOne({ _id: element });
      footballmatch.push(temp);
      if(index == id1.length-1)
        res.send(footballmatch);
    });
    console.log(footballmatch);
  }
  catch (err) {
    res.status(400).send(err);
} 
    
  
});




module.exports = router;
