const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const app = express();

const passport = require("passport");
const initializePassport = require("./utils/passport_config");

const authRoutes = require("./routes/authRoutes");

const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Connection failed:", err));

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser()); // Enabling cookie parser
app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 },
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port 8080");
});
