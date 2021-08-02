const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  //Firstname
  if(!req.body.firstname || req.body.firstname === ''){
    res.status(400).send({
      message: "Failed! Empty Firstname!"
    });
    return;
  }

  //Lastname
  if(!req.body.lastname || req.body.lastname === ''){
    res.status(400).send({
      message: "Failed! Empty Lastname!"
    });
    return;
  }

  //Username
  if(!req.body.username || req.body.username === ''){
    res.status(400).send({
      message: "Failed! Empty Username!"
    });
    return;
  }

  //Birthdate
  if(!req.body.birthdate || req.body.birthdate === ''){
    res.status(400).send({
      message: "Failed! Empty Birthdate!"
    });
    return;
  }

  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
