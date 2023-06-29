// const username = prompt('What is your user name?');
// const password = prompt('What is your password?');

const username = 'n3pix';
const password = 'x';

const socket = io('http://localhost:9000');

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

        const thisNs = io(`http://localhost:9000${ns.endpoint}`);
        thisNs.on('nsChange', data => {
            console.log('Namespace changed!');
            console.log(data);
        });
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