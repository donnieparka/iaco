import express from "express";
import asyncWrapper from "../utils/asyncWrapper.js";
import authencication from "../utils/isLoggedMiddleware.js";
// models
import Campground from "../models/campground.js";
// joi checkers
import { checkCampground } from "../utils/checkSchema.js";
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
  authencication,
	(req, res) => {
		res.render('campgrounds/new'); // Renderizza il form per aggiungere un nuovo campeggio
	},
);

// Route per gestire l'aggiunta di un nuovo campeggio
campgroundsRouter.post(
  "/",
  authencication,
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
    if (!campground) {
      req.flash("error", "non esiste questo campground, idiota");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground }); // Renderizza la vista 'show' passando il campeggio trovato
  })
);

// Route per visualizzare il form per modificare un campeggio esistente
campgroundsRouter.get(
  "/:id/edit",
  authencication,
  asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash(
        "error",
        "questo campeggio esiste solo nella tua testa di merda"
      );
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground }); // Renderizza il form di modifica passando il campeggio trovato
  })
);

// Route per gestire la modifica di un campeggio esistente
campgroundsRouter.put(
  "/:id",
  authencication,
  checkCampground,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "campground modificato!!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Route per gestire l'eliminazione di un campeggio
campgroundsRouter.delete(
  "/:id",
  authencication,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "campground eliminato!!");
    res.redirect("/campgrounds");
  })
);

export default campgroundsRouter;
