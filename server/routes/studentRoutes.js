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

router.get('/courses', async (req, res) => {
	const token = req.headers['authorization'].split(' ')[1];  
	try {
		const decoded = jwt.verify(token, JWT_SECRET);
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM courses WHERE string_id NOT IN (SELECT string_id FROM register WHERE user_id = $1) ORDER BY string_id', [decoded.sub]);
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.get('/registered', async (req, res) => {
	const token = req.headers['authorization'].split(' ')[1];
	try {
			const decoded = jwt.verify(token, JWT_SECRET);
			const client = await pool.connect();
			const result = await client.query(
					'SELECT * FROM courses WHERE string_id IN (SELECT string_id FROM register WHERE user_id = $1)',
					[decoded.sub]
			);
			client.release();
			res.status(200).json(result.rows);
	} catch (error) {
			console.error('Error fetching registered courses:', error);
			res.status(500).json({ errorMessage: 'Failed to fetch registered courses' });
	}
});


router.put('/registered', async (req, res) => {
	const token = req.headers['authorization'].split(' ')[1];
  const { cartItems } = req.body;
  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const client = await pool.connect();
      try {
          await client.query('BEGIN');
          for (const item of cartItems) {
              const { rows } = await client.query(
                  'SELECT maximum_capacity FROM courses WHERE string_id = $1',
                  [item.string_id]
              );

              if (rows.length === 0 || rows[0].maximum_capacity <= 0) {
                  await client.query('ROLLBACK');
                  return res.status(400).json({ errorMessage: `Course ${item.string_id} is full` });
              }

              await client.query(
                  'INSERT INTO register (user_id, string_id) VALUES ($1, $2)',
                  [decoded.sub, item.string_id]
              );
              await client.query(
                  'UPDATE courses SET maximum_capacity = maximum_capacity - 1 WHERE string_id = $1 AND maximum_capacity > 0',
                  [item.string_id]
              );
              console.log(`${decoded.username} registered for course ${item.string_id}`);
          }
          await client.query('COMMIT');
          res.status(200).json({ message: 'Courses registered successfully' });
      } catch (error) {
          await client.query('ROLLBACK');
          throw error; 
      } finally {
          client.release();
      }
  } catch (error) {
      console.error('Error registering courses:', error);
      res.status(500).json({ errorMessage: 'Failed to register courses' });
  }
});

router.get('/courses/schedule', async (req, res) => {
	const token = req.headers['authorization']?.split(' ')[1];

	if (!token) {
			return res.status(401).json({ error: 'Unauthorized' });
}

	try {
			const decoded = jwt.verify(token, JWT_SECRET);
			const client = await pool.connect();
			const result = await client.query(
					'SELECT string_id, title, schedule FROM courses WHERE string_id IN (SELECT string_id FROM register WHERE user_id = $1)',
					[decoded.sub]
			); 
			client.release();
		res.status(200).json(result.rows);
	} catch (error) {
			console.error('Error fetching schedule:', error);
			res.status(500).json({ error: 'Failed to fetch schedule' });
}
});

router.delete('/remove/:courseId', async (req, res) => {
	const token = req.headers['authorization']?.split(' ')[1];
  const { courseId } = req.params;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const client = await pool.connect();
    await client.query('BEGIN');
    const checkCourse = await client.query(
      'SELECT * FROM register WHERE user_id = $1 AND string_id = $2',
      [decoded.sub, courseId]
    );
    if (checkCourse.rows.length === 0) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(404).json({ error: 'Course not found in user registration' });
    }
    await client.query(
      'DELETE FROM register WHERE user_id = $1 AND string_id = $2',
      [decoded.sub, courseId]
    );
    await client.query(
      'UPDATE courses SET maximum_capacity = maximum_capacity + 1 WHERE string_id = $1',
      [courseId]
    );
    await client.query('COMMIT');
    client.release();
    res.status(200).json({ message: 'Course removed successfully' });
  } catch (error) {
    console.error('Error removing course:', error);
    res.status(500).json({ error: 'Failed to remove course' });
  }
});

module.exports = router;
