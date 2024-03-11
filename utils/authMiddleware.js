import { Campground, Review } from "../mongooseModels.js";

const isLogged = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "loggati maiale o non combini una minchia");
    return res.redirect("/user/login");
  }
  next();
};

const isCampgoundOwner = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author._id.equals(req.user._id)) {
    req.flash(
      "error",
      "ciao questa non è casa tua, mongolo idiota, trovatene una o muori per strada"
    );
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

const isReviewOwner = async (req, res, next) => {
  const { id, revid } = req.params;
  const review = await Review.findById(revid);
  if (!review.author._id.equals(req.user._id)) {
    req.flash(
      "error",
      "hey ciao abbiamo notato che sei ritardato perché vuoi eliminare una recensione non tua, servono medicine?"
    );
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

const loginMiddleware = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/user/login");
  }
  next();
};

export { isLogged, isCampgoundOwner, isReviewOwner, loginMiddleware };
