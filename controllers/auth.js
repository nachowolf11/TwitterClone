const express = require('express');
const bcrypt = require('bcryptjs');
const UsuarioTwitter = require('../models/UsuarioTwitter');
const { generarJWT } = require('../helpers/jwt');
const moment = require('moment/moment');

const crearUsuario = async(req, res = express.response) => {

    const { email, password } = req.body

    try {
        let usuario = await UsuarioTwitter.findOne({ email })

        if ( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con este correo'
            })
        }

        usuario = new UsuarioTwitter(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync( password, salt );

        // Agrego imagen genérica
        usuario.profilePicture = 'https://res.cloudinary.com/dypapdpir/image/upload/v1687455878/perfilgenerica_uxqymt.png'
        
        usuario.creationDate = moment.utc();
    
        usuario = await usuario.save();

        
        //Generar JWT
        const token = await generarJWT( usuario._id, usuario.name, usuario.username );
        
        let userData = usuario.toObject()
        delete userData.password

        res.status(201).json({
            ok: true,
            userData,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        })
    }
}

const loginUsuario = async(req, res = express.response) => {
    
    const { principal, password } = req.body

    try {
        let usuario = await UsuarioTwitter.findOne({ email: principal })

        if( !usuario ){
            usuario = await UsuarioTwitter.findOne({ username: principal })
        }
        
        if( !usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'User does not exist.'
            });
        }

        const validPassword = bcrypt.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password error'
            });
        }

        //Generar JWT
        const token = await generarJWT( usuario._id, usuario.name, usuario.username );

        usuario = await UsuarioTwitter.findById(usuario._id)

        let userData = usuario.toObject()
        delete userData.password
        
        res.status(200).json({
            ok: true,
            userData,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const revalidarToken = async(req, res = express.response) => {

    const { uid, name, username } = req

    const token = await generarJWT( uid, name, username );

    const usuario = await UsuarioTwitter.findById(uid)
    let userData = usuario.toObject()
    delete userData.password

    res.json({
        ok: true,
        userData,
        token
    })
}

module.exports = {
    crearUsuario,
    revalidarToken,
    loginUsuario,
}