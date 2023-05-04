const router = require("express").Router();
const auth = require("../middlewares/auth");
const PortManagementController = require("../controllers/PortMgt.controller");

// router.post("/create", auth, PortManagementController.create);
router.post("/availableport", PortManagementController.findAvailablePort);
 

module.exports = router;