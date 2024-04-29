const playSound = (frequency, duration = 400) => {
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