const router = require("express").Router();
const auth = require('../middlewares/auth');
const databasecontroller = require("../controllers/databaseController");

router.post('/createdb',  databasecontroller.createDB);
router.get('/truncatedb', databasecontroller.truncateDB);

module.exports = router;
