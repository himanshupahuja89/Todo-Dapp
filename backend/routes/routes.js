const express = require('express');
const router = express.Router();
const {
    createTask,
    updateTask,
    deleteTask,
    viewTask,
    allTasks
} = require('../controllers/controllers')

router.route('/create-task').post(createTask)
router.route('/update-task').post(updateTask)
router.route('/delete-task/:taskId').delete(deleteTask)
router.route('/view-task/:taskId').post(viewTask)
router.route('/view-all-task').post(allTasks)

module.exports = router;