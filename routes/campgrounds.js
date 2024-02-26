import express from "express";
import asyncWrapper from "../utils/asyncWrapper.js";
// models
import Campground from "../models/campground.js";
// joi checkers
import { checkCampground, checkReview } from "../utils/checkSchema.js";
const campgroundsRouter = express.Router();

// Route per visualizzare tutti i campeggi
campgroundsRouter.get(
  "/",
  asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// Route per mostrare il form per aggiungere un nuovo campeggio
// prettier-ignore
campgroundsRouter.get(
	'/new',
	(req, res) => {
		res.render('campgrounds/new'); // Renderizza il form per aggiungere un nuovo campeggio
	},
);

// Route per gestire l'aggiunta di un nuovo campeggio
campgroundsRouter.post(
  "/",
  checkCampground,
  asyncWrapper(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "campgroud Added!!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Route per visualizzare i dettagli di un campeggio specifico
campgroundsRouter.get(
  "/:id",
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { campground });
  })
);

// Route per visualizzare il form per modificare un campeggio esistente
campgroundsRouter.get(
  "/:id/edit",
  asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id); // Trova il campeggio con l'ID specificato
    res.render("campgrounds/edit", { campground }); // Renderizza il form di modifica passando il campeggio trovato
  })
);

// Route per gestire la modifica di un campeggio esistente
campgroundsRouter.put(
  "/:id",
  checkCampground,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "campgroud Edited!!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Route per gestire l'eliminazione di un campeggio
campgroundsRouter.delete(
  "/:id",
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const deletedCamp = await Campground.findByIdAndDelete(id);
    req.flash("success", "campgroud Deleted!!");
    res.redirect("/campgrounds");
  })
);

export default campgroundsRouter;
