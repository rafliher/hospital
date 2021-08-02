const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    '/api/user/apply',
    [authJwt.verifyToken],
    controller.apply
  );

  app.post(
    '/api/user/cancel',
    [authJwt.verifyToken],
    controller.cancel
  );
};
