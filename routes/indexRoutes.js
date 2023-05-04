const router = require("express").Router();
const userRoutes = require("./userRoutes");
const databaseRoutes = require("./databaseRoutes");
const portMgtRoutes = require("./PortManagementRoute");
const ParticipantRouter = require("./participantsRoutes");
const RoomRoutes = require("./RoomRoutes");
router.use("/api/users", userRoutes);
router.use("/api/database", databaseRoutes);
router.use("/api/portmanagement", portMgtRoutes);
router.use("/api/participants", ParticipantRouter);
router.use("/api/room", RoomRoutes);

module.exports = router;