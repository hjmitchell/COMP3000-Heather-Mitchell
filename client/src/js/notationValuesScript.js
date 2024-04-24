//Store expected note value
let expectedNoteValue;

//Array of note value functions
const functionsArray = [
    semibrave,
    minim,
    crotchet,
    quaver,
    semiquaver
];

//Track number of metronome clicks
let clickCount = 0;
//Track metronome playing status        
let metronomePlaying = false;

//Play metronome and continuous sound function
function startSound() {
    //Get metronome clicking sound from HTML audio
    var metronomeSound = document.getElementById('metronomeSound');
    //Set volume lower to hear sound clearer
    metronomeSound.volume = 0.4;

    //Randomly select a note value function from the array
    const randomIndex = Math.floor(Math.random() * functionsArray.length);
    const randomNoteValueFn = functionsArray[randomIndex];

    //Set expected note value
    expectedNoteValue = randomNoteValueFn.name;

    //Play metronome click function
    function playClick() {
        //Reset audio to beginning
        metronomeSound.currentTime = 0;
        //Play metronome click
        metronomeSound.play();
        //Increase click count (beats in bar)
        clickCount++;
        console.log(clickCount);

        //Check when 2nd bar begins after 4 beats/clicks
        if (clickCount >= 5 && clickCount <= 8) {
            //Execute randomly selected note value function
            randomNoteValueFn();
            console.log(randomNoteValueFn);
        }
        //Stop after 8 beats/clicks
        if (clickCount == 8) {
            clearInterval(metronomeInterval);
        }
    }

    //Set metronomePlaying to true when the metronome starts to allow user click
    metronomePlaying = true;

    //Set up interval to play metronome clicks every 600 milliseconds (tempo)
    const metronomeInterval = setInterval(playClick, 600);
    // Stop the metronome interval after 8 clicks
    setTimeout(() => {
        clearInterval(metronomeInterval);
    }, 8 * 600);
}


//Play sound for specified duration function - used in note value functions to produce sound
const playFreqSound = (duration) => {
    //Create AudioContext to create and execute audio
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    //Create gain node to create and control volume
    const gainNode = audioCtx.createGain();
    //Create oscillator to provide solid tone from audio context
    const oscillator = audioCtx.createOscillator();
    //Set oscillator type to 'sine' for a smooth sound
    oscillator.type = 'sine';
    //Connect oscillator and gain node
    oscillator.connect(gainNode);
    //Connect gain node to audio context to return a final audio destination node
    gainNode.connect(audioCtx.destination);
    //Start oscillator
    oscillator.start(0);
    //Set gain value to 0.5
    gainNode.gain.value = 0.5;
    //Stop playing sound after the defined duration in milliseconds
    setTimeout(() => {
        oscillator.stop();
        //Close the AudioContext to prevent memory leaks
        audioCtx.close();
    }, duration);
};

//Functions for note values...
/*Semibrave-     4 beats-     Plays on beat 5*/
function semibrave() {
    switch (clickCount) {
        case 5:
            playFreqSound(2400, 329.63);
            break;
        case 8:
            clickCount = 0;
            break;
    };
}
/*Minim-         2 beats-     Plays on beats 5 & 7*/
function minim() {
    switch (clickCount) {
        case 5:
        case 7:
            playFreqSound(750, 329.63);
            break;
        case 8:
            clickCount = 0;
            break;
    }
}
/*Crotchet-      1 beat-     Plays once per beat*/
function crotchet() {
    switch (clickCount) {
        case 5:
        case 6:
        case 7:
            playFreqSound(300, 329.63);
            break;
        case 8:
            clickCount = 0;
            playFreqSound(300, 329.63);
            break;
    }
}
/*Quaver-       1/2 beat-     Plays twice per beat*/
function quaver() {
    switch (clickCount) {
        case 5:
        case 6:
        case 7:
            playFreqSound(160, 329.63);
            setTimeout(() => {
                playFreqSound(160, 329.63);
            }, 250);
            break;
        case 8:
            clickCount = 0;
            playFreqSound(160, 329.63);
            setTimeout(() => {
                playFreqSound(160, 329.63);
            }, 250);
            break;
    }
}
/*Semiquaver-    1/4 beat-     Plays four times per beat*/
function semiquaver() {
    switch (clickCount) {
        case 5:
        case 6:
        case 7:
            playFreqSound(80, 329.63);
            setTimeout(() => {
                playFreqSound(80, 329.63);
            }, 130);
            setTimeout(() => {
                playFreqSound(80, 329.63);
            }, 260);
            setTimeout(() => {
                playFreqSound(80, 329.63);
            }, 390);
            break;
        case 8:
            clickCount = 0;
            playFreqSound(80, 329.63);
            setTimeout(() => {
                playFreqSound(80, 329.63);
            }, 130);
            setTimeout(() => {
                playFreqSound(80, 329.63);
            }, 260);
            setTimeout(() => {
                playFreqSound(80, 329.63);
            }, 390);
            break;
    }
}

//Store user score, initialised as 0
let score = 0;

//Check user answer function - executed when user clicks table items
const checkAnswer = (userAns) => {
    //Get elements to display feedback and update score
    const feedbackElement = document.getElementById("feedback");
    const scoreElement = document.getElementById("greenScore");
    
    //Check user input vs required value and if metronomePlaying is true, feedback appropriately
    if (userAns == expectedNoteValue && metronomePlaying) {
        feedbackElement.innerHTML = "Correct! Well done!";
        //Increment score if correct
        score += 1;
    } else {
        if (metronomePlaying) {
            feedbackElement.innerHTML = `Incorrect. You selected ${userAns}. <br> The answer was ${expectedNoteValue}.`;
        }
    }

    //Update scoreboard
    scoreElement.innerHTML = `${score}`;
    //Set metronomePlaying to false to allow only one answer
    metronomePlaying = false;
}