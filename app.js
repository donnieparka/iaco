// Importa i moduli necessari
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import ejsMate from 'ejs-mate';
import Campground from './models/campground.js';
import asyncWrapper from './utils/asyncWrapper.js';
import ExpressError from './utils/ExpressError.js';
import checkSchema from './utils/checkSchema.js';
import methodMiddleware from './utils/methodMiddleware.js';

// Connette al database MongoDB
mongoose.connect('mongodb://localhost:27017/yelp-camp-fake');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const app = express();

// Configurazione dell'app Express
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));

// Route per la pagina iniziale
app.get('/', (req, res) => {
	res.render('home');
});

// Route per visualizzare tutti i campeggi
app.get(
	'/campgrounds',
	asyncWrapper(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
	}),
);

// Route per mostrare il form per aggiungere un nuovo campeggio
app.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new'); // Renderizza il form per aggiungere un nuovo campeggio
});

// Route per gestire l'aggiunta di un nuovo campeggio
app.post(
	'/campgrounds',
	checkSchema,
	asyncWrapper(async (req, res) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	}),
);

// Route per visualizzare i dettagli di un campeggio specifico
app.get(
	'/campgrounds/:id',
	asyncWrapper(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		res.render('campgrounds/show', { campground }); // Renderizza la vista 'show' passando il campeggio trovato
	}),
);

// Route per visualizzare il form per modificare un campeggio esistente
app.get(
	'/campgrounds/:id/edit',
	asyncWrapper(async (req, res) => {
		const campground = await Campground.findById(req.params.id); // Trova il campeggio con l'ID specificato
		res.render('campgrounds/edit', { campground }); // Renderizza il form di modifica passando il campeggio trovato
	}),
);

// Route per gestire la modifica di un campeggio esistente
app.put(
	'/campgrounds/:id',
	checkSchema,
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
	'/campgrounds/:id',
	asyncWrapper(async (req, res) => {
		const { id } = req.params;
		const deletedCamp = await Campground.findByIdAndDelete(id);
		res.redirect('/campgrounds');
	}),
);

app.all('*', (req, res, next) => {
	const err = new ExpressError('qua non c`è un cazzo', 404);
	next(err);
});

app.use((err, req, res, next) => {
	if (!err.message) err.message = 'internal error';
	if (!err.status) err.status = 500;
	res.status(err.status).render('error', { err });
});

// Avvia il server Express sulla porta 3000
app.listen(3000, () => {
	console.log('Serving on port 3000');
});
