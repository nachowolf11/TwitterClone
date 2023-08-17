const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { addFollow, getUser, searchUsers, updateUser } = require('../controllers/user');

const router = Router();


//Add Followed
router.put('/follow', validarJWT, addFollow)

//Get User
router.get('/:username', getUser)

//Search User
router.get('/', searchUsers)

//Update User
router.put('/', validarJWT, updateUser)

module.exports = router
