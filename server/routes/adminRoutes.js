const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
});
const JWT_SECRET = process.env.JWT_SECRET;

router.use(express.json());

router.put('/edit/user', async (req, res) => {
	const { user_id, first_name, last_name, email, phone } = req.body;
	const token = req.headers['authorization'].split(' ')[1];
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		if (!decoded.isAdmin) {
			return res.status(403).json({ errorMessage: 'Unauthorized' });
		}
		const client = await pool.connect();
		await client.query('UPDATE users SET first_name = $1, last_name = $2, user_email = $3, user_phone = $4 WHERE user_id = $5', [first_name, last_name, email, phone, user_id]);
		client.release();
		res.status(200).json({ message: 'User updated successfully' });
		console.log(`${decoded.username} updated user ${user_id}`);
	} catch (error) {
		console.error('Error updating user:', error);
		res.status(500).json({ errorMessage: 'Failed to update user' });
	}
});

router.delete('/delete/user', async (req, res) => {
	const { user_id } = req.body;
	const token = req.headers['authorization'].split(' ')[1];
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		if (!decoded.isAdmin) {
			return res.status(403).json({ errorMessage: 'Unauthorized' });
		}
		const client = await pool.connect();
		await client.query('DELETE FROM users WHERE user_id = $1', [user_id]);
		client.release();
		res.status(200).json({ message: 'User deleted successfully' });
		console.log(`${decoded.username} deleted user ${user_id}`);
	} catch (error) {
		console.error('Error deleting user:', error);
		res.status(500).json({ errorMessage: 'Failed to delete user' });
	}
});

router.get('/courses', async (req, res) => {
	const token = req.headers['authorization'].split(' ')[1];  
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
    const client = await pool.connect();
    if (decoded.isAdmin) {
      const result = await client.query('SELECT * FROM courses ORDER BY string_id');
      client.release();
      res.status(200).json(result.rows);
    } else {
      res.status(403).json({ errorMessage: 'Unauthorized' });
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.delete('/students/courses', async (req, res) => {
	const token = req.headers['authorization']?.split(' ')[1];
  const { user_id, string_id } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ errorMessage: 'Unauthorized' });
    }
    const client = await pool.connect();
    await client.query('BEGIN');
    await client.query('DELETE FROM register WHERE user_id = $1 AND string_id = $2', [user_id, string_id]);
    await client.query('UPDATE courses SET maximum_capacity = maximum_capacity + 1 WHERE string_id = $1', [string_id]);
    await client.query('COMMIT');
    client.release();
    res.status(200).json({ message: 'Course removed successfully' });
  } catch (error) {
    console.error('Error removing course:', error);
    res.status(500).json({ error: 'Failed to remove course' });
  }
});

router.post('/courses', async (req, res) => {
	const { title, stringId, description, schedule, classroomNumber, maxCapacity, credits, cost } = req.body;
  const token = req.headers['authorization'].split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ errorMessage: 'Unauthorized' });
    }
    const client = await pool.connect();
    await client.query('INSERT INTO courses (title, string_id, description, schedule, classroom_number, maximum_capacity, credit_hours, tuition_cost) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [title, stringId, description, schedule, classroomNumber, maxCapacity, credits, cost]);
    client.release();
    console.log('Course created:', { title, description, schedule, classroomNumber, maxCapacity, credits, cost });
    res.status(201).json({ message: 'Course created' });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ errorMessage: 'Failed to create course ' + error });
  }
});

router.put('/edit/course', async (req, res) => {
	const { string_id, title, description, schedule, classroom_number, maximum_capacity, credit_hours, tuition_cost } = req.body;
  const token = req.headers['authorization'].split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ errorMessage: 'Unauthorized' });
    }
    const client = await pool.connect();
    await client.query('UPDATE courses SET title = $1, description = $2, schedule = $3, classroom_number = $4, maximum_capacity = $5, credit_hours = $6, tuition_cost = $7 WHERE string_id = $8', [title, description, schedule, classroom_number, maximum_capacity, credit_hours, tuition_cost, string_id]);
    client.release();
    res.status(200).json({ message: 'Course updated successfully' });
    console.log(`${decoded.username} updated course ${string_id}`);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ errorMessage: 'Failed to update course' });
  }
});

router.delete('/delete/course', async (req, res) => {
	const { string_id } = req.body;
  const token = req.headers['authorization'].split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ errorMessage: 'Unauthorized' });
    }
    const client = await pool.connect();
    await client.query('DELETE FROM courses WHERE string_id = $1', [string_id]);
    client.release();
    res.status(200).json({ message: 'Course deleted successfully' });
    console.log(`${decoded.username} deleted course ${string_id}`);
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ errorMessage: 'Failed to delete course' });
  }
});

router.post('/registered/students', async (req, res) => {
	const token = req.headers['authorization'].split(' ')[1];
	const { string_id } = req.body;
	try {
			const decoded = jwt.verify(token, JWT_SECRET);
			if (!decoded.isAdmin) {
					return res.status(403).json({ errorMessage: 'Unauthorized' });
			}
			const client = await pool.connect();
			const result = await client.query(
					'SELECT * FROM users WHERE user_id IN (SELECT user_id FROM register WHERE string_id = $1)',
					[string_id]
			);
			client.release();
			res.status(200).json(result.rows);
	} catch (error) {
			console.error('Error fetching registered students:', error);
			res.status(500).json({ errorMessage: 'Failed to fetch registered students' });
	}
});

router.get('/students', async (req, res) => {
	const token = req.headers['authorization']?.split(' ')[1];
	if (!token) {
			return res.status(403).json({ errorMessage: 'Unauthorized' });
	}
	try {
			const decoded = jwt.verify(token, JWT_SECRET);
			const client = await pool.connect();
			let result;
			if (decoded.masterAdmin) {
					result = await client.query('SELECT * FROM users WHERE user_id != $1 ORDER BY user_id', [decoded.sub]);
			} else {
					result = await client.query('SELECT * FROM users WHERE user_id != $1 AND user_admin = false ORDER BY user_id', [decoded.sub]);
			}
			client.release();
			res.status(200).json(result.rows);
	} catch (error) {
			console.error('Error fetching students:', error);
			res.status(500).json({ errorMessage: 'Failed to fetch students' });
	}
});

module.exports = router;
