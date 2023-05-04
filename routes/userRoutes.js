const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/test', (req, res) => {
  res.json("Hello");
});

module.exports = router;
