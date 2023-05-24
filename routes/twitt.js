const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getTwitts, createTwitt, addLike, addRetwitt, deleteTwitt } = require('../controllers/twitt')

const router = Router();


// Obtener Twitts
router.get('/', getTwitts)

// Crear Twitt
router.post('/', validarJWT, createTwitt)

// Eliminar Twitt
router.delete('/', validarJWT, deleteTwitt)

// Likes
router.put('/like', validarJWT, addLike)

// Retwitts
router.put('/retwitt', validarJWT, addRetwitt)

module.exports = router