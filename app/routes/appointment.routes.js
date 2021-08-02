const { authJwt } = require("../middleware");
const controller = require("../controllers/appointment.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/appointment", controller.home);

  app.get(
    "/api/appointment/all",
    [authJwt.verifyToken],
    controller.getlist
  );

  app.post(
    "/api/appointment/new",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.new
  );

  app.post(
    "/api/appointment/update",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );

  app.post(
    "/api/appointment/delete",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );

  app.post(
    "/api/appointment/appliances",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAppliances
  );

};
