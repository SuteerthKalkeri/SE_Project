const express = require('express');
const fileUpload = require('express-fileupload');
const plagiarismChecker = require('./plagiarismChecker'); // This will be your custom module
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());


const connection = mysql.createConnection({
    host: 'localhost', // Change to your MySQL host
    user: 'root', // Change to your MySQL username
    password: 'your_password', // Change to your MySQL password
    database: 'plag', // Change to your database name
  });
  
  // Check the connection to the database
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });

  app.get('/loginPage', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/loginPage.html'));
});


app.use(fileUpload());
app.use(express.static('public')); // Your frontend files will be in 'public' directory






app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Middleware to check if the user is logged in
function checkAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/loginPage');
}

// Routes
app.get('/plagiarism', checkAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/plagiarismChecker.html');
});

app.get('/loginPage', (req, res) => {
  res.sendFile(__dirname + '/loginPage.html');
});

app.post('/loginPage', (req, res) => {
  const { username, password } = req.body;
  // Validate username and password against the database
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(sql, [username, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      req.session.isAuthenticated = true;
      res.redirect('/plagiarism');
    } else {
      res.redirect('/loginPage');
    }
  });
});










































app.post('/check-plagiarism', (req, res) => {
  if (!req.files || Object.keys(req.files).length !== 2) {
    return res.status(400).send('Two files are required.');
  }

  let file1 = req.files.file1.data.toString();
  let file2 = req.files.file2.data.toString();

  let plagiarismPercentage = plagiarismChecker.checkPlagiarism(file1, file2);

  const file1_name = req.files.file1.name; // Get the original file name for file1
  const file2_name = req.files.file2.name; // Get the original file name for file2

    res.json({ plagiarismPercentage });
  });

  app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Insert the user data into the 'users' table
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const values = [username, email, password];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            return res.status(500).send('Internal Server Error');
        }

        console.log('User data inserted into the database');
        res.status(200).send('User registered successfully');
    });
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
