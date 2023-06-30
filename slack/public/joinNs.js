const joinNs = (element, nsData) => {
    const nsEndpoint = element.getAttribute('ns');
    const clickedNs = nsData.find(row => row.endpoint === nsEndpoint);
    const rooms = clickedNs.rooms;
    const roomList = document.querySelector('.room-list');

    selectedNsId = clickedNs.id;

    let firstRoom;

    roomList.innerHTML = '';
    rooms.forEach((room, roomIndex) => {
        if(roomIndex === 0) {
            firstRoom = room;
        }

        roomList.innerHTML += (
            `<li class="room" ns-id="${room.namespaceId}" room-id="${room.id}">
                <i class="fa-solid fa-${room.private ? 'lock' : 'globe'}"></i>${room.title}
            </li>`
        );
    });

    joinRoom(firstRoom.id, firstRoom.namespaceId);

    const roomNodes = document.querySelectorAll('.room');
    Array.from(roomNodes).forEach(roomElem => {
        roomElem.addEventListener('click', function() {
            const roomId = this.getAttribute('room-id');
            const nsId = this.getAttribute('ns-id');
            joinRoom(roomId, nsId);
        });
    });

    localStorage.setItem('lastNs', nsEndpoint);
}