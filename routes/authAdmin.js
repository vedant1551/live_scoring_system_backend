const router = require("express").Router();
const Scorer = require("../models/Admin");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  res.send("hello");
});

router.post("/register", async (req, res) => {
  const admin1 = await Scorer.findOne({ email: req.body.email });
  if (admin1) return res.status(404).send("User already exist!");

  const admin = new Scorer(req.body);

  try {
    const savedAdmin = await admin.save();
    res.send(savedAdmin);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const admin = await Scorer.findOne({ email: req.body.email });
  if (!admin) return res.status(404).json("User does not exist!");

  if (req.body.password != admin.password)
    return res.status(422).json("Password is not correct!");

  
  //creat and assign jwt
  const token = jwt.sign({ _id: admin._id }, "unvunv");
  const demo_obj = {
    "auth-token": token,
    admin: admin,
  };
  res.json(demo_obj);
});

router.post("/forgotpassword", async (req, res) => {
  const admin = await Scorer.findOne({ email: req.body.email });
  if (!admin) return res.status(404).send("Admin does not exist!");

  var digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  var message1 = "Hello Admin, Your otp for Scoring system is " + otp;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shreejitiffinservice2@gmail.com",
      pass: "@Shreeji123",
    },
  });

  var mailOptions = {
    from: "shreejitiffinservice2@gmail.com",
    to: req.body.email,
    subject: "Forgot password,- Live Scoring system",
    text: message1,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.send(error);
    } else {
      return res.send(otp);
    }
  });
});

router.put("/changepassword", async (req, res) => {
  const admin = await Scorer.findOne({ username: req.body.username });
  if (!admin) return res.status(404).send("Admin does not exist!");

  admin.password = req.body.password;
  //res.header("otp", otp).send();

  try {
    const savedAdmin = await admin.save();
    res.send(savedAdmin);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;