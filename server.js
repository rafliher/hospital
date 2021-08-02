const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const cors = require("cors");
const Swal = require('sweetalert2')

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(
  session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // if (){}
  if (req.session.username === undefined) {
    res.locals.username = 'Guest';
    res.locals.isLoggedIn = false;
    res.locals.isAdmin = false;
  } else {
    res.locals.username = req.session.username;
    res.locals.isLoggedIn = true;
    res.locals.isAdmin = req.session.isAdmin;
  }
  next();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/appointment.routes')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./app/models");
const Role = db.role;
const User = db.user;

// var bcrypt = require("bcryptjs");
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   initial();
// });
//
// function initial() {
//   Role.create({
//     id: 1,
//     name: "user"
//   });
//
//   Role.create({
//     id: 2,
//     name: "admin"
//   });
//
//   User.create({
//     id: 1,
//     username: "admin",
//     firstname: "admin",
//     lastname: "admin",
//     birthdate: "1970-01-01",
//     email: "admin",
//     password: bcrypt.hashSync("admin", 8)
//   }).then(newAdmin => {
//     newAdmin.setRoles([1,2]);
//   });
//
//   User.create({
//     id: 2,
//     username: "user",
//     firstname: "user",
//     lastname: "user",
//     birthdate: "1970-01-01",
//     email: "user",
//     password: bcrypt.hashSync("user", 8)
//   }).then(newAdmin => {
//     newAdmin.setRoles([1]);
//   });
// }
