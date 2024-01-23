const asyncHandler = (requestHandler) => (req, res, next) => {
  Promise.resolve(requestHandler(req, res, next)).catch((err) => {
    console.log(err);
    return next(err);
  });
};

export { asyncHandler };
