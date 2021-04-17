const roomInput = document.getElementById('room');

const generateKey = () => {
    const randomKey = Math.random().toString().substr(2, 6);
    roomInput.value = randomKey;
}
