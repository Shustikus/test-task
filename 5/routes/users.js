const express = require('express');
const {getUsers, getUser} = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/:id', protect, getUser);

module.exports = router;
