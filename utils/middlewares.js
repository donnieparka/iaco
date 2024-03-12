function asyncWrapper(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

const methodMiddleware = (req, res, next) => {
  const methodQuery = Object.keys(req.query);
  if (methodQuery.some((query) => query === "_method")) {
    req.method = req.query._method;
  }
  next();
};

const storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
export { asyncWrapper, methodMiddleware, storeReturnTo };
