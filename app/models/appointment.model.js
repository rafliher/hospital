module.exports = (sequelize, Sequelize) => {
  const Appointment = sequelize.define("appointments", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    doctorname: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING(1234)
    }
  });

  return Appointment;
};
