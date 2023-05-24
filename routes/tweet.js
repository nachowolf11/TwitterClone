const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getTweets, createTweet, addLike, deleteTweet, addRetweet } = require('../controllers/tweet')

const router = Router();


// Obtener Tweets
router.get('/', getTweets)

// Crear Tweet
router.post('/', validarJWT, createTweet)

// Eliminar Tweet
router.delete('/', validarJWT, deleteTweet)

// Likes
router.put('/like', validarJWT, addLike)

// Retweets
router.put('/retweet', validarJWT, addRetweet)

module.exports = router