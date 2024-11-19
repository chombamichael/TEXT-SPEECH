// script.js

// DOM elements
const speakButton = document.getElementById("speak-btn");
const textInput = document.getElementById("text-input");
const statusText = document.getElementById("status");
const generateImageButton = document.getElementById("generate-image-btn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d"); // Get the 2D context to draw on the canvas
const fileInput = document.getElementById("image-upload");

// Function to convert text to speech
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        // Set properties of the speech
        utterance.rate = 1; // Speed of the speech (1 is normal)
        utterance.pitch = 1; // Pitch of the speech (1 is normal)
        utterance.volume = 1; // Volume (1 is maximum)

        // Optionally, you can set the voice (system voices)
        const voices = window.speechSynthesis.getVoices();
        utterance.voice = voices.find(voice => voice.lang === 'en-US'); // Set default English voice

        // Speak the text
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Sorry, your browser does not support text-to-speech.");
    }
}

// Event listener for the Speak button
speakButton.addEventListener("click", () => {
    const text = textInput.value.trim();
    if (text !== "") {
        speakText(text);
        statusText.textContent = "Speaking...";
    } else {
        statusText.textContent = "Please enter some text to speak.";
    }
});

// Handle speech end event to update status
window.speechSynthesis.onend = () => {
    statusText.textContent = "Speech finished.";
};

// Function to handle image upload and drawing
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];  // Get the selected file
    if (!file) {
        statusText.textContent = "No file selected.";
        return;
    }

    const img = new Image();
    const reader = new FileReader();

    // Read the selected image as a data URL
    reader.onload = function(e) {
        img.src = e.target.result;  // Set the image source to the data URL

        img.onload = function() {
            // Once the image is loaded, clear the canvas and draw the image
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear previous content
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);  // Draw the image
            statusText.textContent = "Image loaded successfully!";
        };

        img.onerror = function() {
            console.error("Image failed to load.");
            statusText.textContent = "Failed to load image.";
        };
    };

    // Handle any error in reading the file
    reader.onerror = function() {
        console.error("Failed to read file.");
        statusText.textContent = "Error reading file.";
    };

    reader.readAsDataURL(file);  // Start reading the file
});
