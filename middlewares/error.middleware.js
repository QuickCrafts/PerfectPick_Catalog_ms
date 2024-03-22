module.exports = (
	err,
	req,
	res,
	next,
) => {
	res
		.status(err.code && (err.code >= 100 && err.code <600)  ? err.code : 500)
		.send(err.message || "Error desconocido.");
};
