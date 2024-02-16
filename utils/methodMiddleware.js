const methodMiddleware = (req, res, next) => {
	const methodQuery = Object.keys(req.query);
	if (methodQuery.some((query) => query === '_method')) {
		req.method = req.query._method;
	}
	next();
};

export default methodMiddleware;
