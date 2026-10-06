import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Sem token'
    });
  }

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret123'
    );

    next();
  } catch {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }
}