//Test suite for playSound function from frequencyPianoScripts
describe('Frequency Piano script playSound function', () => {
  
  //Test if Audio Context called
  it("should use AudioContext", () => {
    //Define parameters for function
    const frequency = 440; //A4 note frequency
    const duration = 700; //milliseconds
    //Spy on AudioContext to check if called
    spyOn(window, 'AudioContext').and.callThrough();
    //Call function
    playSound(frequency, duration);
    //Expectation
    expect(window.AudioContext).toHaveBeenCalled();
  });

  //Test default duration
  it('should use default duration if not provided', () => {
    //Spy on setTimeout
    spyOn(window, 'setTimeout').and.callThrough();
    //Call function without specifying duration
    playSound(440);
    //Expectation
    expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 700);
  });

  //Test specified duration
  it('should stop playing sound after specified duration', () => {
    //Spy on setTimeout
    spyOn(window, 'setTimeout').and.callThrough();
    //Call function with specific duration
    playSound(440, 1000);
    //Expectation
    expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 1000);
  });

  //Test specified frequency
  it('should use specified frequency', () => {
    //Spy on createOscillator
    spyOn(window.AudioContext.prototype, 'createOscillator').and.callThrough();
    //Call function with specified A5 frequency
    playSound(880);
    //Expectation: Has been called
    expect(window.AudioContext.prototype.createOscillator).toHaveBeenCalled();
    //Access returned OscillatorNode instance
    const oscillatorInstance = window.AudioContext.prototype.createOscillator.calls.mostRecent().returnValue;
    //Expectation: Frequency value matches expected frequency
    expect(oscillatorInstance.frequency.value).toEqual(880);
  });
});