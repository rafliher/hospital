const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Appointment = db.appointment;

exports.apply = (req, res) => {
  const userID = req.session.userID;
  const appointmentID = req.body.appointmentID;

  User.findOne({where: {id: userID}}).then(user => {
    user.addAppointments([appointmentID]).then(appointment => {
      res.send({message: "Appointment was applied successfully!"});
    });
  }).catch(err => {
      res.status(500).send({ message: err.message });
  });
};

exports.cancel = (req, res) => {
  const userID = req.session.userID;
  const appointmentID = req.body.appointmentID;


  User.findOne({where: {id: userID}}).then(user => {
    user.removeAppointments([appointmentID]).then(appointment => {
      res.send({message: "Appointment was cancelled successfully!"});
    });
  }).catch(err => {
      res.status(500).send({ message: err.message });
  });
};
