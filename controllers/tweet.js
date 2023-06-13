const express = require('express');
const Tweet = require('../models/Tweet');
const { generarJWT } = require('../helpers/jwt');

const getTweets = async ( req, res = express.response ) => {
    const options = { 
        limit: req.query.limit,
        page: req.query.page,
        populate: {path:'user', select:'name username profilePicture'}
    }


    try {
        Tweet.paginate({}, options, (err, tweets) => {
            res.status(200).json({
                ok: true,
                tweets
            });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const createTweet = async( req, res = express.response ) => {

    const tweet = new Tweet( req.body )

    try {
        tweet.user = req.uid // Mediante el la validacion del token se asigna el UID al req
        tweet.creationDate = Date.now();
        const tweetSaved = await tweet.save();

        res.status(201).json({
            ok: true,
            tweet: tweetSaved
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const deleteTweet = async( req, res = express.response ) => {
    const tweetID = req.body.tweetID

    try {
        const tweet = await Tweet.findById( tweetID );
        
        if( !tweet ){
            res.status(400).json({
                ok:false,
                msg:`Tweet (${ req.uid }) does not exist.`
            });
        }

        if( tweet.user !=  req.uid){
            res.status(403).json({
                ok:false,
                msg:`This Tweet does not belong to the user ${ req.uid }.`
            });
        }

        await Tweet.findByIdAndDelete( tweetID );

        res.status(200).json({
            ok: true,
            deletedTweet: tweet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const addLike = async( req, res = express.response ) => {
    const tweetID = req.body.tweetID
    const uid = req.uid

    try {
        const tweet = await Tweet.findById( tweetID );

        if( tweet.likes.find( user => user == uid ) ){
            tweet.likes = tweet.likes.filter( user => user != uid );
        }else{
            tweet.likes.push( uid );
        }
        await Tweet.findByIdAndUpdate( tweetID, tweet );

        res.status(201).json({
            ok: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const addRetweet = async( req, res = express.response ) => {
    const tweetID = req.body.tweetID
    const uid = req.uid

    try {
        const tweet = await Tweet.findById( tweetID );

        if( tweet.retweets.find( user => user == uid ) ){
            tweet.retweets = tweet.retweets.filter( user => user != uid );
        }else{
            tweet.retweets.push( uid );
        }
        await Tweet.findByIdAndUpdate( tweetID, tweet );

        res.status(201).json({
            ok: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

module.exports = {
    createTweet,
    getTweets,
    deleteTweet,
    addLike,
    addRetweet,
}
