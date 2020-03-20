const mongoose = require('mongoose');

const LobbyModel = mongoose.model(
    'Lobby',
    {
        name: {
            type: String
        },
        users: {
            type: Array,
            default: []
        },
        messages: {
            type: Array,
            default: []
        }
    }
)

module.exports = LobbyModel;