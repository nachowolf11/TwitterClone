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
        data: Buffer,
        contentType: String,
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
    }
});

//Renombrar _id
UsuarioTwitterSchema.method('toJSON', function () {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model( 'UsuarioTwitter', UsuarioTwitterSchema );