const joinRoom = async (roomId, nsId) => {
    const roomNameElem = document.querySelector('.curr-room-text');
    const numUsersElem = document.querySelector('.curr-room-num-users');

    const ackResp = await namespaceSockets[nsId].emitWithAck('joinRoom', roomId);
    roomNameElem.innerText = ackResp.roomTitle;
    numUsersElem.innerHTML = `${ackResp.numUsers} Users <span class="fa-solid fa-user"></span>`;

    // namespaceSockets[nsId].emit('joinRoom', roomId, ackResp => {
    //     roomNameElem.innerText = ackResp.roomTitle;
    //     numUsersElem.innerHTML = `${ackResp.numUsers} Users <span class="fa-solid fa-user"></span>`;
    // });
};