const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getTweets, createTweet, addLike, deleteTweet, addRetweet, getTweetsByText } = require('../controllers/tweet')

const router = Router();


// Obtener Tweets
router.get('/', getTweets)

// Crear Tweet
router.post('/', validarJWT, createTweet)

// Eliminar Tweet
router.delete('/:id', validarJWT, deleteTweet)

// Likes
router.put('/like', validarJWT, addLike)

// Retweets
router.put('/retweet', validarJWT, addRetweet)

module.exports = router