const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')


router.get('/', usersController.getAll)
router.post('/add', usersController.save)
router.get('/delete/:id', usersController.delete)
router.get('/edit/:id', usersController.edit)
router.post('/edit/:id', usersController.update)
router.post('/search', usersController.find)
module.exports = router