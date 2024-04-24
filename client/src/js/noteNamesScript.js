//Function to play sound with specified frequency and duration
const playNoteSound = (frequency, duration = 700) => {
    //Create AudioContext to create and execute audio
    const audioCtx = new AudioContext();
    //Create gain node to create and control volume
    const gainNode = audioCtx.createGain();
    //Create oscillator to provide solid tone from audio context
    const oscillator = audioCtx.createOscillator();
    //Set oscillator to required hertz frequency
    oscillator.frequency.value = frequency;
    //Connect oscillator and gain node
    oscillator.connect(gainNode);
    //Connect gain node to audio context to return a final audio destination node
    gainNode.connect(audioCtx.destination);
    //Begin playing sound immediately
    oscillator.start(0);
    //Stop playing sound after defined duration of milliseconds
    setTimeout(() => oscillator.stop(), duration);
};

//Array of notes with frequencies and note names
const notes = [
    { frequency: 261.63, name: "C" },
    { frequency: 277.18, name: "C#" },
    { frequency: 293.66, name: "D" },
    { frequency: 311.13, name: "D#" },
    { frequency: 329.63, name: "E" },
    { frequency: 349.23, name: "F" },
    { frequency: 369.99, name: "F#" },
    { frequency: 392, name: "G" },
    { frequency: 412.3, name: "G#" },
    { frequency: 440, name: "A" },
    { frequency: 466.16, name: "A#" },
    { frequency: 493.88, name: "B" },
    { frequency: 523.25, name: "C" },
];

//Store current randomly generated note variable
let currentRandomNote = null;

//Function to get random note from note array  
const getRandomNote = () => {
    return notes[Math.floor(Math.random() * notes.length)];
};

//Track whether "Play This Note!" button is enabled, initialised true
let isButtonEnabled = true;

//Store user score, initialised as 0
let noteScore = 0;

//Get random note function
const playThisNoteBtn = () => {
    //Check button status
    if (!isButtonEnabled) {
        return; //Do nothing if button is disabled
    }
    //Get button by ID
    const getNoteBtn = document.getElementById("clickRandNote");
    //Disable button
    getNoteBtn.disabled = true;
    isButtonEnabled = false;

    //Generate random note
    currentRandomNote = getRandomNote();
    //Display note on screen
    document.getElementById("note").innerHTML = `${currentRandomNote.name}`;
    //Play required note for 0.5 seconds
    playNoteSound(currentRandomNote.frequency, 500);

    //Clear feedback element for next note, leaving empty space
    document.getElementById("feedback").innerHTML = `<br>`;
};

//Check note played by user function
const checkNote = (pressedKey) => {
    //Get elements to display feedback and update score
    const feedbackElement = document.getElementById("feedback");
    const scoreElement = document.getElementById("greenScore");

    //Check user input vs required note, feedback appropriately
    if (pressedKey == currentRandomNote.name) {
        feedbackElement.innerHTML = "Correct! Well done!";
        //Increment score if correct
        noteScore += 1;
    } else {
        feedbackElement.innerHTML = `Incorrect. You played ${pressedKey}`;
    }

    //Update scoreboard
    scoreElement.innerHTML = `${noteScore}`;
    //Enable button after checking note
    document.getElementById("clickRandNote").disabled = false;
    isButtonEnabled = true;
    //Reset current note after checking
    currentRandomNote = null;
};