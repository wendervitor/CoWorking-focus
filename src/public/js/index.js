const roomInput = document.getElementById('room');

/**
 * Generate a random room ID
 */
const generateKey = () => {
    const randomKey = Math.random().toString().substr(2, 6);
    roomInput.value = randomKey;
}
