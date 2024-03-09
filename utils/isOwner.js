import Campground from "../models/campground.js";

const authorization = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author._id.equals(id)) {
    req.flash(
      "error",
      "ciao questa non è casa tua, mongolo idiota, trovatene una o muori per strada"
    );
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

export default authorization;
