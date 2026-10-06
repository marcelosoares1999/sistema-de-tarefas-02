import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = Router();

function createToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || 'secret123',
    { expiresIn: '7d' }
  );
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Nome, email e senha são obrigatórios'
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hash]
    );

    const user = result.rows[0];

    res.status(201).json({
      user,
      token: createToken(user)
    });

  } catch (error) {
    console.error(error);

    if (error.code === '23505') {
      return res.status(400).json({
        error: 'Este email já está cadastrado'
      });
    }

    res.status(500).json({
      error: 'Erro ao criar usuário'
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Email ou senha inválidos'
      });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(
      password,
      user.password
    );

    if (!valid) {
      return res.status(401).json({
        error: 'Email ou senha inválidos'
      });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.json({
      user: safeUser,
      token: createToken(safeUser)
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Erro ao fazer login'
    });
  }
});

export default router;