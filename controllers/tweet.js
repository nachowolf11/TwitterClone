const express = require('express');
const Tweet = require('../models/Tweet');
const UsuarioTwitter = require('../models/UsuarioTwitter');
const moment = require('moment/moment');

const getTweets = async ( req, res = express.response ) => {
    const filter = req.query.filter;
    const user = req.query.user;

    const options = { 
        limit: req.query.limit,
        page: req.query.page,
        populate: [{path:'user', select:'_id name username profilePicture'}, {path:'retweets', select:'_id name username'}],
        sort:{creationDate: 'desc'}
    }

    try {
        if( user !== undefined  && filter === 'user'){
            const query = { $or:[{user: { _id:user }}, {retweets: user} ] }
            Tweet.paginate(query, options, (err, tweets) => {
                res.status(200).json({
                    ok: true,
                    tweets
                });
            })
            return;
        }
        if( filter === 'following'){
            const usuario = await UsuarioTwitter.findById(user).populate({path:'following',select:'_id'})
            const idList = usuario.following.map( user => user._id )
            const query = { $or: [{user:{$in:idList}}, {retweets:{$in:idList}}, {likes:{$in:idList}}] }
            Tweet.paginate(query, options, (err, tweets) => {
                res.status(200).json({
                    ok: true,
                    tweets
                });
            })
            return;
        }
        if( user !== undefined && filter === 'likes'){
            const query = {likes: user}
            Tweet.paginate(query, options, (err, tweets) => {
                res.status(200).json({
                    ok: true,
                    tweets
                });
            })
            return;
        }
        if( filter === 'text' ){
            const { text } = req.query
            if(text.length === 0){
                res.status(200).json({
                    ok: true,
                    tweets:{docs:[]}
                });
                return
            }
            const words = text.split(' ')
            const wordsRegex = words.join('|')
            const stringRegex = `\\b(?:${wordsRegex})\\b`
        
            const regex = new RegExp( stringRegex )
            
            Tweet.paginate({text: {$regex:regex, $options: 'i'}}, options, (err, tweets) => {
                res.status(200).json({
                    ok: true,
                    tweets
                });
            })
            return;
        }
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
        tweet.creationDate = moment.utc();
        const tweetSaved = await tweet.save()
        const tweetPopulate = await Tweet.findById(tweetSaved._id).populate({path:'user',select:'profilePicture _id name username'})

        res.status(201).json({
            ok: true,
            tweet: tweetPopulate
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
    const tweetID = req.params.id

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
