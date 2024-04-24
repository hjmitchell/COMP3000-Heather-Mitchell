//Test suite for noteNamesScript
describe('Note names game: Sound functions', () => {

    //Test playNoteSound function
    it('should play note with specified frequency and duration', (done) => {
        //Spy on AudioContext and setTimeout
        spyOn(window.AudioContext.prototype, 'createOscillator').and.callThrough();
        spyOn(window, 'setTimeout').and.callThrough();
        //Set frequency (C4) and duration (milliseconds)
        const frequency = 261;
        const duration = 500;
        //Call function
        playNoteSound(frequency, duration);
        //Expectations with delay
        setTimeout(() => {
            //AudioCtx Oscillator was called
            expect(window.AudioContext.prototype.createOscillator).toHaveBeenCalled();
            //Access returned OscillatorNode instance
            const oscillatorInstance = window.AudioContext.prototype.createOscillator.calls.mostRecent().returnValue;
            //Frequency value matches expected frequency
            expect(oscillatorInstance.frequency.value).toEqual(261);

            //setTimeout ended at 500 ms
            expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 500);
            done();
        }, 100); //Delay
    });

    //Test getRandomNote function
    it('should return a random note from the notes array', () => {
        const randomNote = getRandomNote();
        expect(notes.some(note => note === randomNote)).toBe(true);
    });
});