const express = require('express');
const taskController = require('../controller/task');

const router = express.Router();
router.get('/', taskController.list);
router.get('/:id', taskController.get);
router.post('/', taskController.add);
router.put('/:id', taskController.editTask);
router.delete('/:id', taskController.delete);
module.exports = router;