const { Schema, model } = require('mongoose');

const UsuarioTwitterSchema = Schema({

    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    website: {
        type: String,
    },
    birthday: {
        type: Date,
        required: true
    },
    profilePicture: {
        type: String,
    },
    following:[
        {
            type: Schema.Types.ObjectId,
            ref: 'UsuarioTwitter',
        }
    ],
    followers:[
        {
            type: Schema.Types.ObjectId,
            ref: 'UsuarioTwitter',
        }
    ],
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
});

module.exports = model( 'UsuarioTwitter', UsuarioTwitterSchema );