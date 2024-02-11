const asyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch((err) => {
    const code = err.statusCode;
    return res.status(code ? code : 400).json(err);
  });
};

export { asyncHandler };
