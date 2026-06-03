//import packages needed for backend server
//express is backend framework for handling HTTP requests and responses
const express = require('express');
//Pool manages database connections and allows us to execute queries on the database
const { Pool } = require('pg');
//cors lets frontend and backend communicate with each other by allowing cross-origin requests
const cors = require('cors');
//loads env file 
require('dotenv').config();

//create express app which allows me to create routes
const app = express();
//allows frontend to make requests to backend server
app.use(cors());

//allows backend to understand JSON data sent from frontend
app.use(express.json());

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

//retrieves all posts from the database and sends them back to the frontend as a JSON response
app.get('/posts', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM post ORDER BY created_at ASC');
        res.json(result.rows);

        console.log('test');

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting posts' });
    }
});

//creates a new post in the database using the message and name sent from the frontend in the request body
app.post('/posts', async (req, res) => {
    const { message, name } = req.body;
    if (!message || !name) {
        return res.status(400).json({ error: 'Message and name are required' });
    }
    try {
        const result = await db.query('INSERT INTO post (message, name) VALUES ($1, $2) RETURNING *', [message, name]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating post' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
