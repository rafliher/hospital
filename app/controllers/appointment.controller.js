const db = require("../models");
const config = require("../config/auth.config");
const Appointment = db.appointment;
const User = db.user;


exports.home = (req, res) => {
  res.render('appointment.ejs');
};

exports.getlist = (req, res) => {
  const appointmentIDs = [];
  User.findOne({where: {id: req.session.userID}}).then(user => {
    user.getAppointments().then(appointments => {
      appointments.forEach((appointment, i) => {
        appointmentIDs.push(appointment.id);
      });
    }).then(app =>{
      Appointment.findAll().then(appointments => {
        res.status(200).send({appointments: appointments, appointmentIDs: appointmentIDs,
           user: {
             firstname: user.firstname,
             lastname: user.lastname,
             username: user.username,
           },
           isAdmin: req.session.isAdmin});
      });
    });
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });

};

exports.new = (req, res) => {
  Appointment.create({
    doctorname: req.body.doctorname,
    description: req.body.description,
  }).then(appointment => {
      // appointment.setUsers([]);
      res.send({ message: "Appointment was added successfully!", newData: appointment});
  }).catch(err => {
      res.status(500).send({ message: err.message });
  });
};

exports.update = (req, res) => {
  Appointment.update({
    doctorname: req.body.doctorname,
    description: req.body.description
  }, {
    where: {id: req.body.id}
  }).then(appointment => {
      res.send({ message: "Appointment was upated successfully!", newData: appointment});
  }).catch(err => {
      res.status(500).send({ message: err.message });
  });
};

exports.delete = (req,res) =>{
  Appointment.destroy({where: {id :req.body.id}}).then(success => {res.send({success: success});});
};


exports.getAppliances = (req,res) =>{
  db.sequelize.query(`SELECT users.id, users.firstname, users.lastname, users.username, users.email
        FROM user_appointments
        LEFT JOIN users
        ON user_appointments.userID = users.id
        WHERE user_appointments.appointmentID = ${req.body.appointmentID};`,
        { type: db.Sequelize.QueryTypes.SELECT }
  ).then(results => {
    res.send({applier: results});
  }).catch(err => {
      res.status(500).send({ message: err.message });
  });
};
