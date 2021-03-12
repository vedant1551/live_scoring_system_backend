const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

//import routes
const authAdminRoute = require("./routes/auth");
const authRoute = require("./routes/authAdmin");
const scoringFootballRoute = require("./routes/scoringFootball");
const scoringVolleyballRoute = require("./routes/scoringVolleyball");
//connect DB
mongoose
  .connect(
    "mongodb+srv://sdp_users:Sd@123456@cluster0.xcct7.mongodb.net/SDP?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => console.log("DB connected!!"))
  .catch((err) => {
    console.log(Error, err.message);
  });

//middleware
app.use(cors());
app.use(express.json());

//route middleware

app.use("/api/scorer", authRoute);
app.use("/api/admin", authAdminRoute);
app.use("/api/scoring/football", scoringFootballRoute);
app.use("/api/scoring/volleyball",scoringVolleyballRoute);

app.listen(3000, () => console.log("server Up and running"));
