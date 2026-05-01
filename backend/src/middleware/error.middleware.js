const errorMiddleware = (err, req, res, next) => {
  console.error('❌ Error:', err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validação falhou',
      details: err.errors,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token inválido',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expirado',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erro interno do servidor',
  });
};

module.exports = errorMiddleware;
