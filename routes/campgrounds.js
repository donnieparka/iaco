import express from 'express';
import multer from 'multer';
import { asyncWrapper } from '../utils/middlewares.js';
// joi checkers
import { checkCampground } from '../utils/joiValidation.js';
// campground controllers
import {
	addCampFromUserForm,
	campDetailsPage,
	deleteCampFromUserForm,
	editCampFromUserForm,
	renderEditCampForm,
	renderIndex,
	renderNewCampForm,
} from '../controllers/campControllers.js';
import { isLogged, isCampgoundOwner } from '../utils/authMiddleware.js';
import { storage } from '../cloudinary/index.js';
const campgroundsRouter = express.Router();
const upload = multer({ storage });
// Route per visualizzare tutti i campeggi
campgroundsRouter
	.route('/')
	.get(asyncWrapper(renderIndex))
	// Route per gestire l'aggiunta di un nuovo campeggio
	.post(isLogged, upload.array('image'), checkCampground, asyncWrapper(addCampFromUserForm));

// Route per mostrare il form per aggiungere un nuovo campeggio
campgroundsRouter.route('/new').get(isLogged, renderNewCampForm);

// Route per visualizzare il form per modificare un campeggio esistente
campgroundsRouter.get('/:id/edit', isLogged, isCampgoundOwner, asyncWrapper(renderEditCampForm));
campgroundsRouter
	.route('/:id')
	// Route per visualizzare i dettagli di un campeggio specifico
	.get(asyncWrapper(campDetailsPage))
	// Route per gestire la modifica di un campeggio esistente
	.put(
		isLogged,
		isCampgoundOwner,
		upload.array('image'),
		checkCampground,
		asyncWrapper(editCampFromUserForm)
	)
	// Route per gestire l'eliminazione di un campeggio
	.delete(isLogged, isCampgoundOwner, asyncWrapper(deleteCampFromUserForm));

export default campgroundsRouter;
