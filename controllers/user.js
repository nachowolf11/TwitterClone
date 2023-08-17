const express = require('express');
const UsuarioTwitter = require('../models/UsuarioTwitter');

const addFollow = async( req, res = express.response ) => {
    const { uid } = req
    const { id:followedID } = req.body

    try {
        const user = await UsuarioTwitter.findById( uid ).populate({path:'following', select: '_id'});
        const followed = await UsuarioTwitter.findById( followedID );

        if( uid === followedID ){
            res.status(400).json({
                ok: false,
                msg: 'User ID and Followed ID are the same.'
            })
        }else if( !user ){
            res.status(400).json({
                ok: false,
                msg: 'User does not exist.'
            })
        }else if( !followed ){
            res.status(400).json({
                ok: false,
                msg: 'Followed does not exist.'
            })
        }else if( user.following.find( user => user._id.equals(followedID) ) ){
            user.following = user.following.filter( user => !user._id.equals(followedID) )
            followed.followers = followed.followers.filter( user => !user._id.equals(uid) )
            await user.save();
            await followed.save();
            res.status(201).json({
                ok: true,
                msg: 'Unfollowed'
            })
        }else{
            user.following.push( followedID );
            followed.followers.push( uid );
            await user.save();
            await followed.save();
            res.status(201).json({
                ok:true,
                msg:'Followed'
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const getUser = async( req, res = express.response ) => {
    const username = req.params.username

    try {
        const users = await UsuarioTwitter.find({username})
        if( users.length === 0 ){
            res.status(400).json({
                ok:false,
                msg:'It does not exist an user with that username.'
            })
        }else{
            let userData = users[0].toObject();
            delete userData.password
            res.status(200).json({
                ok:true,
                userData
            })   
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const searchUsers = async( req, res = express.response ) => {
    
    let { search } = req.query
    search = search.replace(/\s/g,'')

    try {
        if( search.length === 0 ){
            return
        }
        const results = await UsuarioTwitter.find({'username':{$regex:search, $options: 'i'}}).select('username profilePicture name').limit(10)
        res.status(200).json({
            ok:true,
            results
        })   
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const updateUser = async( req, res = express.response ) => {
    const { name, location, profilePicture, url } = req.body
    const { uid } = req
    try {
        let user = await UsuarioTwitter.findById(uid)
        user.name = name
        user.location = location
        if(url.length > 0 )user.profilePicture = url

        await user.save();

        res.status(201).json({
            ok:true,
            user
        })   
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

module.exports = {
    addFollow,
    getUser,
    searchUsers,
    updateUser,
}