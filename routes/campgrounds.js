import express from "express";
import { asyncWrapper } from "../utils/middlewares.js";
// models
import { Campground } from "../mongooseModels.js";
// joi checkers
import { checkCampground } from "../utils/joiValidation.js";
// campground controllers
import {
  addCampFromUserForm,
  campDetailsPage,
  deleteCampFromUserForm,
  editCampFromUserForm,
  renderEditCampForm,
  renderIndex,
  renderNewCampForm,
} from "../controllers/campControllers.js";
import { isLogged, isCampgoundOwner } from "../utils/authMiddleware.js";
const campgroundsRouter = express.Router();

// Route per visualizzare tutti i campeggi
campgroundsRouter.get("/", asyncWrapper(renderIndex));

// Route per mostrare il form per aggiungere un nuovo campeggio
campgroundsRouter.get("/new", isLogged, renderNewCampForm);

// Route per gestire l'aggiunta di un nuovo campeggio
campgroundsRouter.post(
  "/",
  isLogged,
  checkCampground,
  asyncWrapper(addCampFromUserForm)
);

// Route per visualizzare i dettagli di un campeggio specifico
campgroundsRouter.get("/:id", asyncWrapper(campDetailsPage));

// Route per visualizzare il form per modificare un campeggio esistente
campgroundsRouter.get(
  "/:id/edit",
  isLogged,
  isCampgoundOwner,
  asyncWrapper(renderEditCampForm)
);

// Route per gestire la modifica di un campeggio esistente
campgroundsRouter.put(
  "/:id",
  isLogged,
  isCampgoundOwner,
  checkCampground,
  asyncWrapper(editCampFromUserForm)
);

// Route per gestire l'eliminazione di un campeggio
campgroundsRouter.delete(
  "/:id",
  isLogged,
  isCampgoundOwner,
  asyncWrapper(deleteCampFromUserForm)
);

export default campgroundsRouter;
