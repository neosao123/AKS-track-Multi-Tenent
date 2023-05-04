const router = require("express").Router();
const RoomController = require("../controllers/RoomController");

router.post("/create", RoomController.newRoom);
router.post("/fetchroom", RoomController.fetchRoom);

module.exports = router;