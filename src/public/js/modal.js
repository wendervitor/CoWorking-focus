const spans = document.getElementsByClassName("close");

const modalObject = [
  {
    "type": document.getElementById("infoModal"),
    "button": document.getElementById("infoBtn"),
    "close": spans[0]
  },
  {
    "type": document.getElementById("settingsModal"),
    "button": document.getElementById("settingsBtn"),
    "close": spans[1]
  },
]

const closeModal = (modal) =>{
  modal.type.style.display = "none";
}

modalObject.map(modal=>{
  modal.button.onclick = function() {
    modal.type.style.display = "block";
  };
  modal.close.onclick = function() {
    modal.type.style.display = "none";
  }
})

window.onclick = function(event) {
  if (event.target == modalObject[0].type) closeModal(modalObject[0]);
  
  if (event.target == modalObject[1].type) closeModal(modalObject[1]);
}

const applySettings = () =>{
  const isAutoStarted = document.getElementById("isAutoStarted").checked;
  const settingsTimer = document.getElementsByClassName("settingsTimer")
  const settings = {
    isAutoStarted,
    "pomodoroMin": settingsTimer[0].value > 0 ? settingsTimer[0].value : 1,
    "shortBreakMin":settingsTimer[1].value > 0 ? settingsTimer[1].value : 1,
    "longBreakMin":settingsTimer[2].value > 0 ? settingsTimer[2].value : 1,
  }
  
  socket.emit('timer:settings',settings);
  closeModal(modalObject[1]);
}