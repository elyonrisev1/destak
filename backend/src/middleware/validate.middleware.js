const validateMiddleware = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    error.name = 'ZodError';
    error.errors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw error;
  }
};

module.exports = validateMiddleware;
