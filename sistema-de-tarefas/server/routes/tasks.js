import { Router } from 'express';
import { pool } from '../db.js';
import auth from '../middleware/auth.js';

const router = Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM tasks
       WHERE user_id = $1
       ORDER BY position ASC, id DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Erro ao buscar tarefas'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      due_date
    } = req.body;

    if (!title) {
      return res.status(400).json({
        error: 'Título é obrigatório'
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks
       (title, description, status, due_date, user_id, position)
       VALUES ($1, $2, $3, $4, $5, 0)
       RETURNING *`,
      [
        title,
        description || '',
        status || 'todo',
        due_date || null,
        req.user.id
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Erro ao criar tarefa'
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      position,
      due_date
    } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1,
           description = $2,
           status = $3,
           position = $4,
           due_date = $5
       WHERE id = $6
       AND user_id = $7
       RETURNING *`,
      [
        title,
        description || '',
        status,
        position || 0,
        due_date || null,
        req.params.id,
        req.user.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Tarefa não encontrada'
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Erro ao atualizar tarefa'
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM tasks
       WHERE id = $1
       AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    res.json({
      ok: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Erro ao excluir tarefa'
    });
  }
});

export default router;