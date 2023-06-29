const joinNs = (element, nsData) => {
    const nsEndpoint = element.getAttribute('ns');
    const clickedNs = nsData.find(row => row.endpoint === nsEndpoint);
    const rooms = clickedNs.rooms;
    const roomList = document.querySelector('.room-list');

    roomList.innerHTML = '';
    rooms.forEach(room => {
        roomList.innerHTML += (
            `<li>
                ${room.title}
            </li>`
        );
    });

    localStorage.setItem('lastNs', nsEndpoint);
}