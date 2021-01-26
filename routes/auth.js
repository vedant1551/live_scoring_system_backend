const router = require("express").Router();
const Scorer = require("../models/Scorer");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  res.send("hello");
});

router.post("/register", async (req, res) => {
  const scorer = new Scorer(req.body);

  try {
    const savedScorer = await scorer.save();
    res.send(savedScorer);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const scorer = await Scorer.findOne({ email: req.body.email });
  if (!scorer) return res.status(404).send("User does not exist!");

  if (req.body.password != scorer.password)
    return res.status(422).send("Password is not correct!");

  //creat and assign jwt
  const token = jwt.sign({ _id: scorer._id }, "unvunv");
  res.header("auth-token", token).send(token);
});

router.post("/forgotpassword", async (req, res) => {
  const scorer = await Scorer.findOne({ email: req.body.email });
  if (!scorer) return res.status(404).send("User does not exist!");
  
  var digits = '0123456789'; 
  let otp = ''; 
  for (let i = 0; i < 6; i++ ) { 
      otp += digits[Math.floor(Math.random() * 10)]; 
  }
  var message1 = "Your otp for Scoring system is " + otp

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'emailidbanavvupadse',
      pass: 'emailidbanavvupadse'
    }
  });

  var mailOptions = {
    from: 'vedantrajyaguru.333@gmail.com',
    to: req.body.email,
    subject: 'Forgot password,- Live Scoring system',
    text: message1
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      res.send(error);
    } else {
      res.header("otp", otp).send();
    }
  });

  res.header("otp", otp).send();
});

router.put("/changepassword", async (req, res) => {
  const scorer = await Scorer.findOne({ email: req.body.email });
  if (!scorer) return res.status(404).send("User does not exist!");

  scorer.body.password = req.password;
  res.send();
  
  try {
    const savedScorer = await scorer.save();
    res.send(savedScorer);
  } catch (err) {
    res.status(400).send(err);
  }

});




module.exports = router;
