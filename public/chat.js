const output = document.getElementById('output');
const message = document.getElementById('message');
const send = document.getElementById('send');
const feedback = document.getElementById('feedback');
const roomMessage = document.querySelector('.room-message');
const users = document.querySelector('.users');

const socket = io.connect('http://localhost:3001');

//Fetch URL Params from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username');
const roomname = urlParams.get('roomname');
console.log(username, roomname);

//Emitting username and roomname of newly joined user to server
socket.emit('joined-user', {
    username: username,
    roomname: roomname
})

//Sending data when user clicks send
send.addEventListener('click', () => {
    socket.emit('chat', {
        username: username,
        message: message.value,
        roomname: roomname
    })
    message.value = '';
})

//Sending username if the user is typing
message.addEventListener('keypress', () => {
    socket.emit('typing', { username: username, roomname: roomname })
})
message.addEventListener("keyup", () => {
    socket.emit("stopTyping", { username: username, roomname: roomname });
});

//Displaying if new user has joined the room
socket.on('joined-user', (data) => {
    if (username == data.username) {
        output.innerHTML += '<p class="center"><strong><em>' + "You" + ' </strong>Joined the Room</em></p><br>';
    } else {
        output.innerHTML += '<p class="center"><strong><em>' + data.username + ' </strong>has Joined the Room</em></p><br>';
    }
})

//Displaying the message sent from user
socket.on('chat', (data) => {
    if (username == data.username) {
        output.innerHTML += '<div class="right-text"><p><strong>' + "You" + '</strong> ' + moment(new Date().getTime()).format('h:mm a') + '</p>' + '<p>' + data.message + '</p></div><br>';
    } else {
        output.innerHTML += '<div><p><strong>' + data.username + '</strong> ' + moment(new Date().getTime()).format('h:mm a') + '</p>' + '<p>' + data.message + '</p></div><br>';
    }
    feedback.innerHTML = '';
    document.querySelector('.chat-message').scrollTop = document.querySelector('.chat-message').scrollHeight
})

//Displaying if a user is typing
socket.on('typing', (user) => {
    feedback.innerHTML = '<p><em>' + user + ' is typing...</em></p>';
})
socket.on("stopTyping", (user) => {
    feedback.innerText = "";
});

//Displaying online users
socket.on('online-users', (data) => {
    users.innerHTML = ''
    data.forEach(user => {
        users.innerHTML += `<p>${user}</p>`
    });
})