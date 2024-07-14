//npm init -y
//npm install express mongoose body-parser multer bcrypt jsonwebtoken ejs nodemon dotenv express-session cookie-parser uuid web3
//node app.js
//npm start
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const connectDB = require('./db');
require('dotenv').config();



app.use(express.json());

const { PORT, SESSION_SECRET } = process.env;

// Connect to MongoDB
connectDB();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true }));


// Use the routes defined in routes.js
app.use('/socgen', routes);

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next()
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}\nhttp://localhost:5000/socgen/evault`);
});
