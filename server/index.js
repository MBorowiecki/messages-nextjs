const next = require('next')
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http)

const port = 3000;

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

let msgs = []

nextApp.prepare().then(() => {

    io.on('connection', socket =>{
        socket.emit('msgReceived', {msgs});

        socket.on('msgSend', msg => {
            msgs.push(msg);
            socket.emit('msgReceived', {msgs});
        })
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