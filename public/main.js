const socket = io();
let roomId;
roomId = window.location.pathname.split('/').pop();
const hostForm = document.getElementById('hostForm');
const joinForm = document.getElementById('joinForm');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatArea = document.getElementById("chatArea");
const title = document.getElementById("title");
const roomIdlist = document.getElementById("roomIdlist");
// Hide chat input and send button by default
chatInput.style.display = 'none';
sendButton.style.display = 'none';
title.style.display = 'none';
// window.onload = function () {
//     // Make a GET request to the /roomIdList API endpoint
//     fetch('/roomIdList')
//         .then(response => response.json())
//         .then(data => {
//             roomIdlist.innerHTML += "Organization"
//             console.log(data)
//             if (data.err === 200) {
//                 // Update the roomIdlist element with the room IDs
//                 const roomIds = data.data.map(room => `<li class="list-group-item">Organization Room - <b>${room.roomId}</b></li>`);
//                 roomIdlist.innerHTML = roomIds.join('<br/> ');
//             } else {
//                 console.error(data.message);
//             }
//         })
//         .catch(error => console.error(error));
// };

hostForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    roomId = hostForm.roomId.value;
    // Make HTTP request to API endpoint
    // const response = await fetch('/addrommId', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         roomId: roomId
    //     })
    // });
    // Check if the response was successful
    // if (response.ok) {

    // Display chat input and send button
    chatInput.style.display = 'block';
    sendButton.style.display = 'block';
    title.style.display = 'block';
    hostForm.style.display = 'none';
    joinForm.style.display = 'none';
    roomIdlist.style.display = 'none';
    socket.emit('hostRoom', roomId);
    // } else {
    //     console.error('Error adding room ID');
    // }
});



joinForm.addEventListener('submit', (event) => {
    event.preventDefault();
    roomId = joinForm.roomId.value;
    socket.emit('joinRoom', roomId);

    chatInput.style.display = 'block';
    sendButton.style.display = 'block';
    hostForm.style.display = 'none';
    joinForm.style.display = 'none';
    roomIdlist.style.display = 'none';
});


window.onload = () => {
    roomId = window.location.pathname.split('/').pop();
    socket.emit('joinRoom', roomId);
};
sendButton.addEventListener('click', (e) => {
    e.preventDefault()
    const message = chatInput.value;
    chatInput.value = '';
    socket.emit('sm', roomId, message);
});

const chatMessages = document.querySelector('tbody');

socket.on('roomCreated', (roomId) => {
    console.log(`Room created with ID: ${roomId}`);
    // window.location.href = `/room/${roomId}`;
    // Display chat input and send button
    chatInput.style.display = 'block';
    sendButton.style.display = 'block';
    title.style.display = 'block';
    title.innerHTML = `Send Broadcasting messages to ${roomId}`
});

socket.on('roomNotFound', () => {
    console.log('Room not found');
});

socket.on('userJoined', (roomId) => {
    console.log(`User joined room with ID: ${roomId}`);
    // window.location.href = `/room/${roomId}`;

    // Hide chat input and send button
    // chatInput.style.display = 'none';
    // sendButton.style.display = 'none';
    // const messageElement = document.createElement('div');
    // messageElement.innerHTML = `<p><strong>New user joined the room ${roomId}.</strong></p>`;
    // chatMessages.appendChild(messageElement);
});

// Handle chat messages
socket.on('allMessages', (messages) => {
    for (const message of messages) {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<p><strong>Message:</strong> ${message}</p>`;
        chatMessages.appendChild(messageElement);
    }
});

socket.on('rm', (message) => {
    let Message = JSON.parse(message)
    const messageElement = document.createElement('tr');
    messageElement.innerHTML = `
    <tr>
              <td>${Message.participantName}</td>
              <td>${Message.raceName}</td>
              <td>${Message.bibNo}</td>
              <td>${Message.age}</td>
              <td>${Message.city.substr(0, 10)}</td> 
              <td>${Message.gender}</td>
              <td>${Message.teamName}</td>
              <td><progress max=${100} value=${Message.percent}>${Message.percent}</progress></td>
            </tr>    
    `;
    chatMessages.appendChild(messageElement);
});