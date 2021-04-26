
const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const modalText = document.getElementById("modalText");
const span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modalText.innerText = "Thank you for using CoWorking Focus !\n\nThe next step is share this site URL or the room ID with whom you want to join.\n\nCoWorking Focus is a open-source app, you can see the source code ";
    const githubLink = document.createElement('a');
    const text = document.createTextNode("here");
    githubLink.appendChild(text);
    githubLink.href="https://github.com/wendervitor/work-together";
    modalText.appendChild(githubLink);
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 