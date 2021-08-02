module.exports = {
  HOST: "ec2-18-235-109-97.compute-1.amazonaws.com:5432",
  USER: "pjutebxgtqoacn",
  PASSWORD: "a96074bba3ad6f4d151290c834b5523e548050ff159716f1d6d11a30b5a1ec30",
  DB: "d2umv9q3jpr9th",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
