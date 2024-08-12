// Load sound files
const kick = new Tone.Player("assets/sounds/kick.wav");
const snare = new Tone.Player("assets/sounds/snare.wav");
const hat = new Tone.Player("assets/sounds/hat.wav");
const cymbal = new Tone.Player("assets/sounds/crash.wav");

//low-pass filter
const filter = new Tone.Filter({
    frequency: 5000,
    type: 'lowpass',
    rolloff: -24,
});

//bitcrusher effect
const bitcrusher = new Tone.BitCrusher({
    bits: 8,
    // wet: 0.5, 
});

// distortion effect
const distortion = new Tone.Distortion({
    distortion: 0.5, // Start with 50% distortion
    oversample: '2x'
});

// Chain the effects together and connect them to the destination
bitcrusher.chain(distortion, filter, Tone.Destination);

//connect sound to filter
kick.connect(bitcrusher);
snare.connect(bitcrusher);
hat.connect(bitcrusher);
cymbal.connect(bitcrusher);


const startBtn = document.getElementById('start-btn');
const sequencer = document.getElementById('sequencer');
const mainContentContainer = document.getElementById('main-content');

const kickTrack = document.getElementById("kick-track");
const snareTrack = document.getElementById("snare-track");
const hatTrack = document.getElementById("hat-track");
const cymbalTrack = document.getElementById("cymbal-track");

// Track steps configuration
const steps = {
    kick: Array(16).fill(false),
    snare: Array(16).fill(false),
    hat: Array(16).fill(false),
    cymbal: Array(16).fill(false),
};

const tracks = [
    { name: 'Kick', sound: kick, trackDivName: "kick-track" },
    { name: 'Snare', sound: snare, trackDivName: "snare-track" },
    { name: 'Hat', sound: hat, trackDivName: "hat-track" },
    { name: 'Cymbal', sound: cymbal, trackDivName: "cymbal-track" }
];

const keyMap = {
    '1': 0, '2': 1, '3': 2, '4': 3, 
    '5': 4, '6': 5, '7': 6, '8': 7, 
    '!': 8, '@': 9, '#': 10, '$': 11, 
    '%': 12, '^': 13, '&': 14, '*': 15
};

function createTrack(name, soundName, trackDivName){
     const trackDiv = document.getElementById(trackDivName);
 
     // Create steps container
     const stepsDiv = document.createElement('div');
     stepsDiv.className = 'steps';
     
     // Add steps to the track
     for (let i = 0; i < 16; i++) {
         const step = document.createElement('div');
         step.className = 'step';
         step.dataset.sound = soundName;
         step.dataset.step = i;
         step.addEventListener('click', function() {
             const stepIndex = parseInt(this.dataset.step);
            //  steps[soundName][stepIndex] = !steps[soundName][stepIndex];
            //  this.classList.toggle('active');
            toggleStep(soundName, stepIndex);
         });
         stepsDiv.appendChild(step);
     }
 
     // Append steps to track container
     trackDiv.appendChild(stepsDiv);
     
     // Add the track to the sequencer
     sequencer.appendChild(trackDiv);
}

startBtn.addEventListener('click', async () => {
    await Tone.start();
    console.log('Audio context started');
    sequencer.style.display = "block";
    mainContentContainer.style.display = "block";
    // piano.style.display = "flex";
    startBtn.style.display = "none";
    tracks.forEach(track => createTrack(track.name, track.name.toLowerCase(), track.trackDivName));
});

// // Handle step click
// document.querySelectorAll('.step').forEach(step => {
//     step.addEventListener('click', function() {
//         toggleStep(soundName, step.dataset.step);
//     });
// });

// Function to toggle a step
function toggleStep(trackName, stepIndex) {
    steps[trackName][stepIndex] = !steps[trackName][stepIndex];

    // Find the correct track label and toggle the step in that track
    const trackDivs = document.querySelectorAll('.track');
    trackDivs.forEach(trackDiv => {
        const label = trackDiv.querySelector('.track-label');
        if (label.innerText.toLowerCase() === trackName) {
            const stepDiv = trackDiv.querySelector(`.steps .step:nth-child(${stepIndex + 1})`);
            if (stepDiv) {
                stepDiv.classList.toggle('active');
            }
        }
    });
}

// Sequence
const seq = new Tone.Sequence((time, col) => {
    if (steps.kick[col]) kick.start(time);
    if (steps.snare[col]) snare.start(time);
    if (steps.hat[col]) hat.start(time);
    if (steps.cymbal[col]) cymbal.start(time);
}, [...Array(16).keys()], "16n");

// Play button
document.getElementById('play-btn').addEventListener('click', () => {
    console.log(seq.steps);
    Tone.Transport.start();
    seq.start(0);
});

// Stop button
document.getElementById('stop-btn').addEventListener('click', () => {
    Tone.Transport.stop();
    seq.stop();
});


// Low pass filter slider
document.getElementById('filterSlider').addEventListener('input', (event) => {
    const frequency = event.target.value;
    filter.frequency.value = frequency;
});

// Bitcrusher slider
document.getElementById('bitcrusherSlider').addEventListener('input', (event) => {
    const bits = event.target.value;
    bitcrusher.bits = bits;
    // const wet = event.target.value/100;
    // bitcrusher.wet = wet;
});

// Distortion slider
document.getElementById('distortionSlider').addEventListener('input', (event) => {
    const distortionAmount = event.target.value;
    distortion.distortion = distortionAmount;
});

// Keyboard listener
document.addEventListener('keydown', (event) => {
    const stepIndex = keyMap[event.key];
    if (stepIndex !== undefined) {
        toggleStep('kick', stepIndex);
    }
});