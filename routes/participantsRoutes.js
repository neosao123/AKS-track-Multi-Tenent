const router = require("express").Router();
const participantController = require("../controllers/ParticipantController");

router.use("/scannedparticipant", participantController.create_scanned_participants);
router.use("/eventparticipant", participantController.event_participants);
router.use("/count", participantController.eventParticipantCount);

module.exports = router;