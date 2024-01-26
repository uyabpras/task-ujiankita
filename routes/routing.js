const express = require('express');
const taskController = require('../controller/task');

const router = express.Router();
router.get('/', taskController.list);
router.get('/:id', taskController.get);
router.get('/health', taskController.getHealth);
router.post('/create', taskController.add);
//router.post('/api/add-task', taskController.addTask);
router.put('/:id', taskController.editTask);
router.put('/status', taskController.editStatusBulk);
router.delete('/:id', taskController.delete);
// router.post('/api/add-task', async (req, res) => {
//     const payload = req.body;
  
//     try {
//       const result = await taskController.addTask(payload);
//       res.status(result.success ? 200 : 400).json(result);
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
//   });
module.exports = router;