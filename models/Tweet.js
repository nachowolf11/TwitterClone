const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const TweetSchema = Schema({

    text: {
        type: String,
        required: true
    },
    file: {
        data: Buffer,
        contentType: String,
    },
    creationDate: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'UsuarioTwitter',
        required: true
    },
    likes:[
        {
            type: Schema.Types.ObjectId,
            ref: 'UsuarioTwitter'
        }
    ],
    retweets: [
        {
            type: Schema.Types.ObjectId,
            ref: 'UsuarioTwitter'
        }
    ],
    comments: [
        {
            text:{ type: String, required: true },
            user:{ type: Schema.Types.ObjectId, ref: 'UsuarioTwitter', required: true }
        }
    ],
});

TweetSchema.plugin(mongoosePaginate);


module.exports = model( 'Tweet', TweetSchema );