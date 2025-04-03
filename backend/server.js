const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const socketIo = require('socket.io');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const connectWithRetry = async () => {
  const maxRetries = 10;
  const retryInterval = 5000; 
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@database:5432/uppound'
  });
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} to connect to database...`);
      await pool.query('SELECT NOW()');
      console.log('Database connected successfully!');
      return pool;
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err);
      
      if (attempt === maxRetries) {
        console.error('Max retries reached. Could not connect to database.');
        throw err;
      }
      
      console.log(`Retrying in ${retryInterval/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
  }
};

// Global pool that will be initialized before handling any requests
let pool;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In server.js
const imagesPath = path.join(__dirname, 'images');
console.log('Images directory path:', imagesPath);
console.log('Files in images directory:', fs.readdirSync(imagesPath));
try {
  if (!fs.existsSync(imagesPath)) {
    console.log('Images directory does not exist, creating it');
    fs.mkdirSync(imagesPath, { recursive: true });
  } else {
    console.log('Images directory exists');
    const files = fs.readdirSync(imagesPath);
    console.log('Files in images directory:', files);
  }
} catch (err) {
  console.error('Error with images directory:', err);
}

app.use('/api/images', express.static(imagesPath));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
// Add this route to your server.js for debugging
app.get('/debug-pets', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, image_url FROM pets');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const upload = multer({ storage: storage });

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});


app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/api/pets', async (req, res) => {
  try {
    console.log('Fetching all pets from database');
    const result = await pool.query('SELECT * FROM pets');
    console.log(`Found ${result.rows.length} pets`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying pets:', err);
    res.status(500).json({ error: 'Failed to fetch pets' });
  }
});

app.get('/api/pets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching pet with ID: ${id}`);
    const result = await pool.query('SELECT * FROM pets WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      console.log(`Pet with ID ${id} not found`);
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    console.log(`Found pet: ${result.rows[0].name}`);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching pet with ID ${req.params.id}:`, err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/pets', upload.single('image'), async (req, res) => {
  try {
    const { name, species, breed, age, description } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const result = await pool.query(
      'INSERT INTO pets (name, species, breed, age, description, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, species, breed, age, description, image_url]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating pet:', err);
    res.status(500).json({ error: 'Failed to create pet' });
  }
});

app.post('/api/adoptions', async (req, res) => {
  try {
    const { pet_id, applicant_name, email, phone, message } = req.body;
    
    const petCheck = await pool.query('SELECT id FROM pets WHERE id = $1', [pet_id]);
    if (petCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    const result = await pool.query(
      'INSERT INTO adoptions (pet_id, applicant_name, email, phone, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [pet_id, applicant_name, email, phone, message]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating adoption application:', err);
    res.status(500).json({ error: 'Failed to submit adoption application' });
  }
});

app.get('/api/adoptions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, p.name as pet_name, p.species, p.breed
      FROM adoptions a
      JOIN pets p ON a.pet_id = p.id
      ORDER BY a.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching adoptions:', err);
    res.status(500).json({ error: 'Failed to fetch adoption applications' });
  }
});

app.get('/api/pets/search', async (req, res) => {
  try {
    const { query, species } = req.query;
    
    let sqlQuery = 'SELECT * FROM pets WHERE 1=1';
    const params = [];
    
    if (query) {
      params.push(`%${query}%`);
      sqlQuery += ` AND (name ILIKE $${params.length} OR breed ILIKE $${params.length})`;
    }
    
    if (species) {
      params.push(species);
      sqlQuery += ` AND species = $${params.length}`;
    }
    
    const result = await pool.query(sqlQuery, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error searching pets:', err);
    res.status(500).json({ error: 'Failed to search pets' });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const startServer = async () => {
  try {
    pool = await connectWithRetry();
    
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
      console.log(`API available at http://localhost:${port}/api/pets`);
    });
    
    const io = socketIo(server, {
      cors: {
        origin: "*", 
        methods: ["GET", "POST"]
      }
    });
    
    io.on('connection', (socket) => {
      console.log('New client connected');
      
      socket.on('new_adoption', (data) => {
        io.emit('adoption_update', data);
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
    
    process.on('SIGINT', () => {
      console.log('Shutting down server...');
      server.close(() => {
        console.log('Server shut down');
        process.exit(0);
      });
    });
    
    return { app, server };
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = { app };
