const express = require('express');
const bodyParser = require('body-parser');
const socket = require('socket.io')
const localStorage = require('localStorage')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
var port = 3001;



app.get('/', (req, res) => {
    res.render('index')
})

app.post('/room', (req, res) => {
    roomname = req.body.roomname;
    username = req.body.username;
    localStorage.setItem("username", username);
    localStorage.setItem("roomname", roomname);
    res.redirect(`/room?username=${username}&roomname=${roomname}`)
})

app.get('/room', (req, res) => {
    var username = localStorage.getItem("username");
    var roomname = localStorage.getItem("roomname");
    res.render('room', { username: username, roomname: roomname })
})


const server = app.listen(port, () => {
    console.log(`Server Running on port ${port}`)
})
const io = socket(server);
require('./utils/socket')(io);