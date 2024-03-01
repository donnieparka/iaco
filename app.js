// Importa i moduli necessari
import express from "express";
import path from "path";
import mongoose from "mongoose";
import ejsMate from "ejs-mate";
import flash from "connect-flash";
import session from "express-session";
// utils
import ExpressError from "./utils/ExpressError.js";
import methodMiddleware from "./utils/methodMiddleware.js";
// import dei router
import campgroundsRouter from "./routes/campgrounds.js";
import reviewsRouter from "./routes/reviews.js";
// Connette al database MongoDB
mongoose.connect("mongodb://localhost:27017/yelp-camp-fake");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
const sessionSetup = {
  secret: "segreto di merda",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
};

// Configurazione dell'app Express
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodMiddleware);
app.use(express.static("public"));
app.use(session(sessionSetup));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// Route per la pagina iniziale
app.get("/", (req, res) => {
  res.render("home");
});

// router
app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/reviews", reviewsRouter);
app.all("*", (req, res, next) => {
  const err = new ExpressError("qua non c`è un cazzo", 404);
  next(err);
});

app.use((err, req, res, next) => {
  if (!err.message) err.message = "internal error";
  if (!err.status) err.status = 500;
  res.status(err.status).render("error", { err });
});

// Avvia il server Express sulla porta 3000
app.listen(3000, () => {
  console.log("Serving on port 3000");
});
