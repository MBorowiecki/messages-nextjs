const mongoose = require('mongoose');

const MessageModel = mongoose.model(
    'Message', 
    {
        message: {
            type: String,
            required: true
        },
        lobby: {
            type: String,
            required: true
        },
        sender: {
            type: String,
            required: true
        }
    }
)

module.exports = MessageModel;