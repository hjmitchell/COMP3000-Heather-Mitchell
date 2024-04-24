//Test suite for notationValuesScript
describe('Notation values game', () => {

    //Test specified duration
    it('should play sound for specified duration', () => {
        //Spy on setTimeout
        spyOn(window, 'setTimeout').and.callThrough();
        //Call function with specific duration
        playFreqSound(1000);
        //Expectation
        expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 1000);
    });

    //Test semibrave functionality
    it('should play semibrave correctly', (done) => {
        //Set clickCount to 5 before calling function (beat 1)
        clickCount = 5;
        //Spy on createOscillator method
        spyOn(window.AudioContext.prototype, 'createOscillator').and.callThrough();
        //Call function
        semibrave();
        //Expectation with delay to simulate timing
        setTimeout(() => {
            expect(window.AudioContext.prototype.createOscillator).toHaveBeenCalled();
            done();
        }, 100);
    });
    //Minim
    it('should play minim correctly', () => {
        //Beat 2 - should NOT play on this beat
        clickCount = 6;
        spyOn(window.AudioContext.prototype, 'createOscillator').and.callThrough();
        minim();
        expect(window.AudioContext.prototype.createOscillator).not.toHaveBeenCalled();

        //Beat 3 - SHOULD play on this beat
        clickCount = 7;
        minim();
        expect(window.AudioContext.prototype.createOscillator).toHaveBeenCalled();
    });
});

//Answer checking suite
describe('Notation values game: Check answer function', () => {
    //Create mock feedback and score elements...
    let feedbackElement, scoreElement;
    beforeEach(() => {
        //Create feedback div on test page, set ID, hide div
        feedbackElement = document.createElement('div');
        feedbackElement.id = 'feedback';
        feedbackElement.style = 'display: none';
        //Create score div on test page, set ID, hide div
        scoreElement = document.createElement('div');
        scoreElement.id = 'greenScore';
        scoreElement.style = 'display: none';
        //Append game feedback and score to test page div
        document.body.appendChild(feedbackElement);
        document.body.appendChild(scoreElement);
    });

    //Test score, feedback, and stops playing on correct answer
    it('should give correct score/feedback on correct answer and stop playing', () => {
        //Set metronome true to allow 'user' answer
        metronomePlaying = true;
        //Set answer
        expectedNoteValue = 'semiquaver';
        //Call function with correct answer
        checkAnswer(expectedNoteValue);
        //Expectations
        expect(score).toBe(1);
        expect(document.getElementById('feedback').innerHTML).toBe('Correct! Well done!');
        expect(metronomePlaying).toBe(false);
    });

    //Test score, feedback, and stops playing on incorrect answer
    it('should give correct score/feedback on incorrect answer and stop playing', () => {
        //Reset score
        score = 0;
        metronomePlaying = true;
        expectedNoteValue = 'semibrave';
        //Call function with incorrect answer
        checkAnswer('minim');
        //Expectations
        expect(score).toBe(0);
        expect(document.getElementById('feedback').innerHTML).toContain('Incorrect');
        expect(metronomePlaying).toBe(false);
    });
});