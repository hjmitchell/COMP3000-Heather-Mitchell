//Declare variables for audio processing
let audioCtx;
let analyser;
let microphone;
//Variable for frequency to note conversion
let noteFrequencyData;
//Track mic. state
let isMicActive = false;

//Get HTML references
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const frequencyValue = document.getElementById('frequencyValue');
const noteValue = document.getElementById('noteValue');

//Start btn clicked...
startBtn.addEventListener('click', async () => {
    //Execute if mic status is false (off)
    if (!isMicActive) {
        try {
            //Create AudioContext (creates and executes audio for playback, recording, analysis, etc.)
            //Checks if AudioContext or webkitAudioContext is available in browser
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();

            //AudioContext method to create analyser node for real-time freq. analysis
            analyser = audioCtx.createAnalyser();

            //Access microphone
            //Pause execution until browser JS environment getUserMedia returns user permission to access audio (mic.)
            //Hold stream in microphone var
            microphone = await navigator.mediaDevices.getUserMedia({ audio: true });

            //Create audio source node from microphone stream
            const micSrc = audioCtx.createMediaStreamSource(microphone);
            //Connect audio src node to analyser for audio data pipeline and real-time analysis
            micSrc.connect(analyser);

            //Set FFT size for freq. analysis
            analyser.fftSize = 16384; //Highest possible value for accurate detection
            const bufferLength = analyser.frequencyBinCount; //Half of fftSize, 8192
            const dataArray = new Uint8Array(bufferLength); //Create array of data

            //Continuously detect and display dominant frequency
            const detectFreq = () => {
                analyser.getByteFrequencyData(dataArray); //Copies current frequency into array

                //Find maximum freq. value
                let maxFreqValue = 0;
                let maxFreqIndex = 0;
                //Loops through arr to find highest (donimant) value in dataArray
                //Compares each dataArray element to current MaxFreqValue
                for (let i = 0; i < dataArray.length; i++) {
                    if (dataArray[i] > maxFreqValue) {
                        //Update value to new highest and index to current place
                        maxFreqValue = dataArray[i];
                        maxFreqIndex = i;
                    }
                }

                //Calculate the frequency in Hz
                //Multiply index by ratio of sample rate (no. of audio samples/second) and FFT size
                const frequencyHz = maxFreqIndex * (audioCtx.sampleRate / analyser.fftSize);

                //Update HTML with 2 decimal place string
                frequencyValue.textContent = frequencyHz.toFixed(2) + " Hz";

                //Fetch and parse JSON data for note conversion
                fetch('/public/assets/frequencyDetectorData.json') //Network request
                    .then((response) => response.json()) //Extracts data and parses response body as JSON
                    .then((data) => { //Assign parsed JSON to var
                        noteFrequencyData = data;
                    })
                    .catch((error) => {
                        console.error('Error fetching JSON data:', error);
                    });

                //Checks if note freq. data available, calculates note with function and updates HTML
                if (noteFrequencyData) {
                    const matchedNote = matchFrequencyToNote(frequencyHz);
                    noteValue.textContent = matchedNote || "--";
                }

                //Continuously call self (detectFreq) for realtime animation effect
                requestAnimationFrame(detectFreq);
            };

            //Start freq. detection loop
            detectFreq();

            //Update states
            startBtn.style.display = "none";
            stopBtn.style.display = "inline";
            isMicActive = true;

        } catch (error) {
            console.error('Cannot access microphone:', error);
        }
    }
});

//Function to match frequencies to musical notes, takes Hz freq. as arg.
function matchFrequencyToNote(detectedFrequency) {
    //Freq. should be within 2 hertz of known note
    const tolerance = 2;
    //Define var to store matched note, initialised as null
    let matchedNote = null;
    //Loops through JSON notes and frequencies data
    for (const note in noteFrequencyData) {
        //Stores each note in frequency
        const frequency = noteFrequencyData[note];
        //Calculates absolute difference between detected and known freq's
        //If less than or equal to tolerance value, considered a match
        if (Math.abs(detectedFrequency - frequency) <= tolerance) {
            //Stores match and breaks loop
            matchedNote = note;
            break;
        }
    }
    //Returns note if found, null if not
    return matchedNote;
};

//Stop btn clicked...
stopBtn.addEventListener('click', () => {
    //Checks if mic. is true (on)
    if (isMicActive) {
        //Checks if microphone stream is defined and so if stream has been acquired
        if (microphone) {
            //Stops each track associated with mic. stream, stopping mic. input
            microphone.getTracks().forEach((track) => track.stop());
        }
        //Checks if AudioContext object is defined (active)
        if (audioCtx) {
            //Stops audio processing
            audioCtx.close();
        }

        //Update states
        startBtn.style.display = "inline";
        stopBtn.style.display = "none";
        isMicActive = false;
    }
});