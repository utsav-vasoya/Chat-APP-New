const output = document.getElementById('output');
const message = document.getElementById('message');
const send = document.getElementById('send');
const form = document.getElementById('form');
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
form.addEventListener('submit', (e) => {
    e.preventDefault()
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
        output.innerHTML += '<p class="center"><strong><em>' + "You" + ' </strong>Joined the Room</em></p>';
    } else {
        output.innerHTML += '<p class="center"><strong><em>' + data.username + ' </strong>has Joined the Room</em></p>';
    }
})

//Displaying the message sent from user
socket.on('chat', (data) => {
    debugger
    if (username == data.username) {
        output.innerHTML += '<li class="d-flex justify-content-end mb-4"><div class="card w-50"><div class="card-header d-flex justify-content-between p-3"><p class="fw-bold mb-0"><strong>' + "You" + '</strong></p><p class="text-muted small mb-0"><i class="far fa-clock"></i> ' + moment(new Date().getTime()).format('h:mm a') + ' </p></div><div class="card-body"><p class="mb-0">' + data.message + '</p></div></div><img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="avatar" class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="40" /></li>'
    } else {
        output.innerHTML += '<li class="d-flex justify-content-start mb-4"><img src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" alt="avatar" class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="40" /><div class="card mx-1 w-50"><div class="card-header d-flex justify-content-between p-3"><p class="fw-bold mb-0"><strong>' + data.username + '</strong></p><p class="text-muted small mb-0"><i class="far fa-clock"></i>' + moment(new Date().getTime()).format('h:mm a') + ' </p></div><div class="card-body"><p class="mb-0">' + data.message + '</p></div></div></li>'
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
        if (username == user) {
            users.innerHTML += `<ul class="list-unstyled mb-0">
            <li class="p-2 border-bottom">
            
                    <div class="d-flex flex-row">
                        <div class="pt-1">
                            <p class="fw-bold mb-0"><i class="fa fa-user" aria-hidden="true"></i> ${user}</p>
                        </div>
                    </div>
                
            </li>
        </ul>`
        } else {
            users.innerHTML += `<ul class="list-unstyled mb-0">
            <li class="p-2 border-bottom">
               
                    <div class="d-flex flex-row">
                        <div class="pt-1">
                            <p class="fw-bold mb-0">${user}</p>
                        </div>
                    </div>
                
            </li>
        </ul>`
        }
    });
})