// const username = prompt('What is your user name?');
// const password = prompt('What is your password?');

const username = 'n3pix';
const password = 'x';

const socket = io('http://localhost:9001');
const namespaceSockets = [];
const listeners = {
    nsChange: [],
    messageToRoom: []
};
let selectedNsId = 0;

document.getElementById('message-form').addEventListener('submit', event => {
    event.preventDefault();
    
    const newMessage = event.target['user-message'].value;

    namespaceSockets[selectedNsId].emit('newMessageToRoom', {
        newMessage,
        username,
        avatar: 'https://via.placeholder.com/30'
    });
});

const addListeners = nsId => {
    if(!listeners.nsChange[nsId]) {
        namespaceSockets[nsId].on('nsChange', data => {
            console.log('Namespace changed!');
            const roomListElement = document.querySelector('.room-list');
            roomListElement.innerHTML = '';
            data.rooms.forEach(room => {
                roomListElement.innerHTML += (
                    `<li class="room" ns-id="${room.namespaceId}" room-id="${room.id}">
                        <i class="fa-solid fa-${room.private ? 'lock' : 'globe'}"></i>${room.title}
                    </li>`
                );
            });
        });
        listeners.nsChange[nsId] = true;
    }
    if(!listeners.messageToRoom[nsId]) {
        namespaceSockets[nsId].on('messageToRoom', messageObj => {
            console.log(messageObj);
            document.getElementById('messages').innerHTML += ;
        });
        listeners.messageToRoom[nsId] = true;
    }
};

socket.on('connect', () => {
    console.log('Connected!');
    socket.emit('clientConnect');
});

socket.on('welcome', data => {
    console.log(data);
});

// Listen for nsList event from the server which gives us the namespaces
socket.on('nsList', nsData => {
    const lastNs = localStorage.getItem('lastNs');
    
    const namespacesDiv = document.querySelector('.namespaces');
    
    namespacesDiv.innerHTML = '';
    nsData.forEach(ns => {
        namespacesDiv.innerHTML += (
            `<div class="namespace" ns="${ns.endpoint}">
                <img src="${ns.image}" alt="${ns.name}" />
            </div>`
        );

        if(!namespaceSockets[ns.id]) {
            namespaceSockets[ns.id] = io(`http://localhost:9001${ns.endpoint}`);
        }
        addListeners(ns.id);
    });

    const namespaceElements = document.getElementsByClassName('namespace');
    Array.from(namespaceElements).forEach(element => {
        if(element.getAttribute('ns') === lastNs) {
            joinNs(element, nsData);
        }

        element.addEventListener('click', function() {
            joinNs(element, nsData);
        });
    });
});

const buildMessageHtml = messageObj => (
    `<li>
        <div class="user-image">
            <img src="${messageObj.avatar}" alt="${messageObj.username}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${messageObj.username} <span>${messageObj.date}</span></div>
            <div class="message-text">${messageObj.newMessage}</div>
        </div>
    </li>`
);