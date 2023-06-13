const express = require('express');
const bcrypt = require('bcryptjs');
const UsuarioTwitter = require('../models/UsuarioTwitter');
const { generarJWT } = require('../helpers/jwt');

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
    
        await usuario.save();

        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name, usuario.username );
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            username: usuario.username,
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
        const token = await generarJWT( usuario.id, usuario.name, usuario.username );

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            username: usuario.username,
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

    res.json({
        ok: true,
        uid, name, username,
        token
    })
}

module.exports = {
    crearUsuario,
    revalidarToken,
    loginUsuario,
}