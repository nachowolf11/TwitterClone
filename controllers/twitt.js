const express = require('express');
const Twitt = require('../models/Twitt');
const { generarJWT } = require('../helpers/jwt');

const getTwitts = async ( req, res = express.response ) => {
    const options = { limit: req.query.limit, page: req.query.page }
    console.log(options);

    try {
        Twitt.paginate({}, options, (err, twitts) => {
            res.status(200).json({
                ok: true,
                twitts
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

const createTwitt = async( req, res = express.response ) => {

    const twitt = new Twitt( req.body )

    try {
        twitt.user = req.uid // Mediante el la validacion del token se asigna el UID al req
        twitt.creationDate = Date.now();
        const twittSaved = await twitt.save();

        res.status(201).json({
            ok: true,
            twitt: twittSaved
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const deleteTwitt = async( req, res = express.response ) => {
    const twittID = req.body.twittID

    try {
        const twitt = await Twitt.findById( twittID );
        
        if( !twitt ){
            res.status(400).json({
                ok:false,
                msg:`Twitt (${ req.uid }) does not exist.`
            });
        }

        if( twitt.user !=  req.uid){
            res.status(403).json({
                ok:false,
                msg:`This Twitt does not belong to the user ${ req.uid }.`
            });
        }

        await Twitt.findByIdAndDelete( twittID );

        res.status(200).json({
            ok: true,
            deletedTwitt: twitt
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
    const twittID = req.body.twittID
    const uid = req.uid

    try {
        const twitt = await Twitt.findById( twittID );

        if( twitt.likes.find( user => user == uid ) ){
            twitt.likes = twitt.likes.filter( user => user != uid );
        }else{
            twitt.likes.push( uid );
        }
        await Twitt.findByIdAndUpdate( twittID, twitt );

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

const addRetwitt = async( req, res = express.response ) => {
    const twittID = req.body.twittID
    const uid = req.uid

    try {
        const twitt = await Twitt.findById( twittID );

        if( twitt.retwitts.find( user => user == uid ) ){
            twitt.retwitts = twitt.retwitts.filter( user => user != uid );
        }else{
            twitt.retwitts.push( uid );
        }
        await Twitt.findByIdAndUpdate( twittID, twitt );

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
    createTwitt,
    getTwitts,
    deleteTwitt,
    addLike,
    addRetwitt,
}
