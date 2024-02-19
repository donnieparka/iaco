import express from 'express';
import asyncWrapper from '../utils/asyncWrapper.js';
import Campground from '../models/campground.js';
import { checkCampground, checkReview } from '../utils/checkSchema.js';
const campgroundsRouter = express.Router();

// Route per visualizzare tutti i campeggi
campgroundsRouter.get(
	'/',
	asyncWrapper(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	}),
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
	'/',
	checkCampground,
	asyncWrapper(async (req, res) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	}),
);

// Route per visualizzare i dettagli di un campeggio specifico
app.get(
	'/:id',
	asyncWrapper(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id).populate('reviews');
		res.render('campgrounds/show', { campground }); // Renderizza la vista 'show' passando il campeggio trovato
	}),
);

// Route per visualizzare il form per modificare un campeggio esistente
app.get(
	'/:id/edit',
	asyncWrapper(async (req, res) => {
		const campground = await Campground.findById(req.params.id); // Trova il campeggio con l'ID specificato
		res.render('campgrounds/edit', { campground }); // Renderizza il form di modifica passando il campeggio trovato
	}),
);

// Route per gestire la modifica di un campeggio esistente
app.put(
	'/:id',
	checkCampground,
	asyncWrapper(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findByIdAndUpdate(id, {
			...req.body.campground,
		});
		res.redirect(`/campgrounds/${campground._id}`);
	}),
);

// Route per gestire l'eliminazione di un campeggio
app.delete(
	'/:id',
	asyncWrapper(async (req, res) => {
		const { id } = req.params;
		const deletedCamp = await Campground.findByIdAndDelete(id);
		res.redirect('/campgrounds');
	}),
);

// aggiunta review al campeggio
app.post(
	'/:id/reviews',
	checkReview,
	asyncWrapper(async (req, res) => {
		const camp = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		camp.reviews.push(review);
		await camp.save();
		await review.save();
		res.redirect(`/campgrounds/${req.params.id}`);
	}),
);

// eliminazione review
app.delete(
	'/:id/reviews/:revid',
	asyncWrapper(async (req, res) => {
		await Campground.findByIdAndUpdate(req.params.id, {
			$pull: { reviews: req.params.revid },
		});
		await Review.findByIdAndDelete(req.params.revid);
		res.redirect(`/campgrounds/${req.params.id}`);
	}),
);

export default campgroundsRouter;
