require('dotenv').config();
const cors = require('cors');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const { authorizeRole, authenticate, loginRequired } = require("./src/middlewares/middleware")
const authRoutes = require('./src/routes/public/index');
const privateRoutes = require('./src/routes/private/index');
const responseMiddleware = require('./src/middlewares/response-middleware');

const app = express();

app.use(cors({
  origin: 'http://localhost:8080',
  // origin: 'http://localhost:8081',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization',],
  credentials: true,
}));
// Middleware
app.use(bodyParser.json());
app.use(express.static("views"));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  }
}));

app.use((req, res, next) => {
  console.log(`${req.method} - URL: ${req.url}`);
  next();
});

// Routes
app.get('/', function(request, response) {
  console.log('Received request at /');
  response.set('Cache-Control', 'no-store');
  response.status(200).json({
    status: "Success",
    message: "The API Server is running!"
  });
});

app.get('/test', function(request, response) {
  response.status(200).json({
    message: "This is a test route."
  });
});
app.get('/api/public/test', function(request, response) {
  response.status(200).json({
    message: "Hehe, On \" /api/public/test\""
  });
});

// Định nghĩa các route khác
app.use('/api/public', authRoutes);
app.use('/api/private', authenticate, privateRoutes);
// console.log(variableName);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

app.get('/api/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// định nghĩa thư mục chứa các file tĩnh
app.use(express.static('public'));

app.use(responseMiddleware.format);