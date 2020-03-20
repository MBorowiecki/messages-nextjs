const next = require('next')
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http)
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const port = 3000;

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const LobbyModel = require('./schemas/lobby');

let msgs = []

app.use(bodyParser.json());

mongoose.connect('mongodb://testadmin:testadmin1@ds034198.mlab.com:34198/messages-nextjs', {useNewUrlParser: true, useUnifiedTopology: true})

nextApp.prepare().then(() => {

    io.on('connection', socket => {
        socket.emit('msgReceived', {msgs});
        socket.broadcast.emit('msgReceived', {msgs});

        socket.on('msgSend', msg => {
            LobbyModel.findOne({_id: msg.room}, (err, docs) => {
                if(err){
                    throw err;
                }

                let _msgs = docs.messages;

                _msgs.push(msg);
                LobbyModel.updateOne({_id: msg.room}, {$set: {messages: _msgs}} ,(err, res) => {
                    if(err){
                        throw err;
                    }

                    socket.broadcast.emit('msgReceived', {msgs: _msgs});
                    socket.emit('msgReceived', {msgs: _msgs});
                })
            })  
            //msgs.push(msg);
        })
    })

    app.post('/api/get-user-lobbies', (req, res) => {
        const { userId } = req.body;

        if(userId){
            LobbyModel.find({}, (err, lobbies) => {
                if(err){
                    res.status(500);
                    throw err;
                }

                let _lobbies = [];
                
                lobbies.map(lobby => {
                    lobby.users.map(_userId => {
                        if(_userId === userId){
                            _lobbies.push(lobby);
                        }
                    })
                })
    
                res.send(_lobbies).status(200);
            })
        }
    })

    app.post('/api/create-lobby', (req, res) => {
        const { name } = req.body;

        if(name){
            const newLobby = new LobbyModel({
                name: name,
                users: []
            })
    
            newLobby.save((err, docs) => {
                if(err){
                    res.status(500);
                    throw err;
                }
    
                res.send(docs).status(200);
            })
        }
    })

    app.post('/api/lobby/get-users', (req, res) => {
        const { lobbyId } = req.body;

        if(lobbyId){
            LobbyModel.findOne({_id: lobbyId}, (err, lobby) => {
                if(err){
                    res.status(500);
                    throw err;
                }

                res.send(lobby.users).status(200);
            })
        }
    })

    app.post('/api/lobby/add-user', (req, res) => {
        const { user, lobbyid } = req.body;

        if(user && lobbyid){
            LobbyModel.findOne({_id: lobbyid}, (err, docs) => {
                if(err){
                    res.status(500);
                    throw err;
                }

                let users = docs.users;

                users.push(user.id);
                LobbyModel.updateOne({_id: lobbyid}, {$set: {users: users}}, (err, docs) => {
                    if(err){
                        res.status(500);
                        throw err;
                    }

                    res.status(200).send(docs);
                })
            })
        }
    })

    app.post('/api/lobby/get-messages', (req, res) => {
        const { lobbyId } = req.body;

        if(lobbyId){
            LobbyModel.findOne({_id: lobbyId}, (err, lobby) => {
                if(err){
                    res.status(500);
                    throw err;
                }

                res.status(200).send(lobby.messages);
            })
        }
    })

    app.get('*', (req, res) => {
        return handle(req, res);
    })

    http.listen(port, err => {
        if(err){
                throw err;
        }else{
            console.log(`Server is running on ${port} port.`);
        }
    })
}).catch(ex => {
    console.log(ex.stack);
    process.exit(1);
})