// Select the message overlay container
const messageOverlay = document.createElement('div');
messageOverlay.classList.add('message-overlay');
messageOverlay.innerHTML = `<p class="message-text">Please move the images to explore!</p>`;
document.body.appendChild(messageOverlay);

// Function to hide the message after 4 seconds
setTimeout(() => {
  messageOverlay.classList.add('hidden');
  setTimeout(() => {
    messageOverlay.remove(); // Completely remove the message element from the DOM
  }, 1000); // Wait for the fade-out animation to finish
}, 4000);

// Dragging logic
const pictures = document.querySelectorAll('.Picture');
var previousTouch = undefined;
const videoIframe = document.querySelector('#video iframe'); // Select the video iframe

// Flag to prevent multiple autoplay triggers
let autoplayTriggered = false;

// Function to update the position of the dragged element
function updateElementPosition(element, event) {
  var movementX, movementY;

  if (event.type === 'touchmove') {
    const touch = event.touches[0];
    movementX = previousTouch ? touch.clientX - previousTouch.clientX : 0;
    movementY = previousTouch ? touch.clientY - previousTouch.clientY : 0;
    previousTouch = touch;
  } else {
    movementX = event.movementX;
    movementY = event.movementY;
  }

  const elementY = parseInt(element.style.top || 0) + movementY;
  const elementX = parseInt(element.style.left || 0) + movementX;

  element.style.top = elementY + "px";
  element.style.left = elementX + "px";

  if (element === pictures[0] && !autoplayTriggered) { 
    console.log("16th image moved, triggering autoplay!");
    triggerAutoplay();
  }
}

function startDrag(element, event) {
  const updateFunction = (event) => updateElementPosition(element, event);
  const stopFunction = () => stopDrag({ update: updateFunction, stop: stopFunction });
  document.addEventListener("mousemove", updateFunction);
  document.addEventListener("touchmove", updateFunction);
  document.addEventListener("mouseup", stopFunction);
  document.addEventListener("touchend", stopFunction);
}

function stopDrag(functions) {
  previousTouch = undefined;
  document.removeEventListener("mousemove", functions.update);
  document.removeEventListener("touchmove", functions.update);
  document.removeEventListener("mouseup", functions.stop);
  document.removeEventListener("touchend", functions.stop);
}

function triggerAutoplay() {
  const currentSrc = videoIframe.src;
  console.log("Current video iframe src:", currentSrc);

  if (!currentSrc.includes('autoplay=1')) {
    videoIframe.src = currentSrc + '?autoplay=1&muted=1';
    console.log("Autoplay triggered: Updated iframe src:", videoIframe.src);
  }
  autoplayTriggered = true; // Ensure autoplay is triggered only once
}

pictures.forEach(picture => {
  const range = 100;
  const randomX = Math.random() * (range * 2) - range;
  const randomY = Math.random() * (range * 2) - range;
  const randomRotate = Math.random() * (range / 2) - range / 4;
  const startFunction = (event) => startDrag(picture, event);
  picture.style.top = `${randomY}px`;
  picture.style.left = `${randomX}px`;
  picture.style.transform = `translate(-50%, -50%) rotate(${randomRotate}deg)`;
  picture.addEventListener("mousedown", startFunction);
  picture.addEventListener("touchstart", startFunction);
});
