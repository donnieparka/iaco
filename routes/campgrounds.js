import express from "express";
import asyncWrapper from "../utils/asyncWrapper.js";
// models
import { Campground } from "../mongooseModels.js";
// joi checkers
import { checkCampground } from "../utils/joiValidation.js";
import { isLogged, isCampgoundOwner } from "../utils/authMiddleware.js";
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
  isLogged,
	(req, res) => {
		res.render('campgrounds/new'); // Renderizza il form per aggiungere un nuovo campeggio
	},
);

// Route per gestire l'aggiunta di un nuovo campeggio
campgroundsRouter.post(
  "/",
  isLogged,
  checkCampground,
  asyncWrapper(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
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
    const campground = await Campground.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
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
  isLogged,
  isCampgoundOwner,
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
  isLogged,
  isCampgoundOwner,
  checkCampground,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const editCamp = await Campground.findById(id);
    await Campground.findByIdAndUpdate(id, {
      ...req.body,
    });
    req.flash("success", "campground modificato!!");
    res.redirect(`/campgrounds/${editCamp._id}`);
  })
);

// Route per gestire l'eliminazione di un campeggio
campgroundsRouter.delete(
  "/:id",
  isLogged,
  isCampgoundOwner,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "campground eliminato!!");
    res.redirect("/campgrounds");
  })
);

export default campgroundsRouter;
