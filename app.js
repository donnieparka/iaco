// Importa i moduli necessari
import 'dotenv/config.js';
import helmet from 'helmet';
import seedDB from './seeds/index.js';
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import ejsMate from 'ejs-mate';
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;
// utils
import ExpressError from './utils/ExpressError.js';
import { asyncWrapper, methodMiddleware } from './utils/middlewares.js';
// import dei router
import usersRouter from './routes/user.js';
import campgroundsRouter from './routes/campgrounds.js';
import reviewsRouter from './routes/reviewsRouter.js';
/* modelli mongoose */
import { User } from './mongooseModels.js';
import { name } from 'ejs';
// Connette al database MongoDB
// const dbUrl = ;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp-fake';
mongoose.connect(dbUrl);
// mongoose.connect(dbUrl);

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
app.use(methodMiddleware);

app.use(express.static('public'));
const secret = process.env.SECRET;

const store = MongoStore.create({
	mongoUrl: dbUrl,
	secret,
	touchAfter: 24 * 60 * 60,
});
store.on('error', function (e) {
	console.log('ERRORE DI SALVATAGGIO SESSIONE', e);
});

const sessionSetup = {
	store,
	name: 'session',
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionSetup));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(helmet());

const scriptSrcUrls = [
	'https://stackpath.bootstrapcdn.com/',
	'https://api.tiles.mapbox.com/',
	'https://api.mapbox.com/',
	'https://kit.fontawesome.com/',
	'https://cdnjs.cloudflare.com/',
	'https://cdn.jsdelivr.net',
	'https://cdn.jsdelivr.net',
];
const styleSrcUrls = [
	'https://kit-free.fontawesome.com/',
	'https://stackpath.bootstrapcdn.com/',
	'https://api.mapbox.com/',
	'https://api.tiles.mapbox.com/',
	'https://fonts.googleapis.com/',
	'https://use.fontawesome.com/',
	'https://cdn.jsdelivr.net',
];
const connectSrcUrls = [
	'https://api.mapbox.com/',
	'https://a.tiles.mapbox.com/',
	'https://b.tiles.mapbox.com/',
	'https://events.mapbox.com/',
];
const fontSrcUrls = [];
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", 'blob:'],
			objectSrc: [],
			imgSrc: [
				"'self'",
				'blob:',
				'data:',
				'https://res.cloudinary.com/dsntv0w1a/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
				'https://images.unsplash.com/',
			],
			fontSrc: ["'self'", ...fontSrcUrls],
		},
	})
);

app.use(flash());
app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.user = req.user;
	next();
});
// Route per la pagina iniziale
app.get('/', (req, res) => {
	res.render('home');
});

// router
app.use('/user', usersRouter);
app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds/:id/reviews', reviewsRouter);

app.get(
	'/seed',
	asyncWrapper(async (req, res) => {
		await seedDB();
		res.redirect('/campgrounds');
	})
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
