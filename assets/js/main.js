// Load sound files
const kick = new Tone.Player("assets/sounds/kick.wav");
const snare = new Tone.Player("assets/sounds/snare.wav");
const hat = new Tone.Player("assets/sounds/hat.wav");
const cymbal = new Tone.Player("assets/sounds/crash.wav");

var isPlaying = false;

//low-pass filter
const filter = new Tone.Filter({
  frequency: 5000,
  type: "lowpass",
  rolloff: -24,
});

//bitcrusher effect
const bitcrusher = new Tone.BitCrusher({
  bits: 8,
  wet: 0.5,
});

// distortion effect
const distortion = new Tone.Distortion({
  distortion: 0.5, // Start with 50% distortion
  oversample: "2x",
});

// Chain the effects together and connect them to the destination
// bitcrusher.chain(distortion, filter, Tone.Destination);

//connect sound to filter
kick.chain(distortion, filter, Tone.Destination);
snare.chain(distortion, filter, Tone.Destination);
hat.chain(distortion, filter, Tone.Destination);
cymbal.chain(distortion, filter, Tone.Destination);

const startBtn = document.getElementById("start-btn");
const sequencer = document.getElementById("sequencer");
const mainContentContainer = document.getElementById("main-content");
const playBtn = document.getElementById("play-btn");
const stopBtn = document.getElementById("stop-btn");
const bpmInput = document.getElementById("bpm-input");

const kickTrack = document.getElementById("kick-track");
const snareTrack = document.getElementById("snare-track");
const hatTrack = document.getElementById("hat-track");
const cymbalTrack = document.getElementById("cymbal-track");

let isBpmFocused = false;

// Track steps configuration
const steps = {
  kick: Array(16).fill(false),
  snare: Array(16).fill(false),
  hat: Array(16).fill(false),
  cymbal: Array(16).fill(false),
};

const tracks = [
  { name: "Kick", sound: kick, trackDivName: "kick-track" },
  { name: "Snare", sound: snare, trackDivName: "snare-track" },
  { name: "Hat", sound: hat, trackDivName: "hat-track" },
  { name: "Cymbal", sound: cymbal, trackDivName: "cymbal-track" },
];

const kickKeyMap = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
  "!": 8,
  "@": 9,
  "#": 10,
  $: 11,
  "%": 12,
  "^": 13,
  "&": 14,
  "*": 15,
};

const kickReverseKeyMap = {
  0: "1",
  1: "2",
  2: "3",
  3: "4",
  4: "5",
  5: "6",
  6: "7",
  7: "8",
  8: "!",
  9: "@",
  10: "£",
  11: "%",
  12: "^",
  13: "&",
  14: "*",
  15: "(",
};

const snareKeyMap = {
  q: 0,
  w: 1,
  e: 2,
  r: 3,
  t: 4,
  y: 5,
  u: 6,
  i: 7,
  Q: 8,
  W: 9,
  E: 10,
  R: 11,
  T: 12,
  Y: 13,
  U: 14,
  I: 15,
};

const snareReverseKeyMap = {
  0: "q",
  1: "w",
  2: "e",
  3: "r",
  4: "t",
  5: "y",
  6: "u",
  7: "i",
  8: "Q",
  9: "W",
  10: "E",
  11: "R",
  12: "T",
  13: "Y",
  14: "U",
  15: "I",
};

const hatKeyMap = {
  a: 0,
  s: 1,
  d: 2,
  f: 3,
  g: 4,
  h: 5,
  j: 6,
  k: 7,
  A: 8,
  S: 9,
  D: 10,
  F: 11,
  G: 12,
  H: 13,
  J: 14,
  K: 15,
};

const hatReverseKeyMap = {
  0: "a",
  1: "s",
  2: "d",
  3: "f",
  4: "g",
  5: "h",
  6: "j",
  7: "k",
  8: "A",
  9: "S",
  10: "D",
  11: "F",
  12: "G",
  13: "H",
  14: "J",
  15: "K",
};

const cymbalKeyMap = {
  z: 0,
  x: 1,
  c: 2,
  v: 3,
  b: 4,
  n: 5,
  m: 6,
  ",": 7,
  Z: 8,
  X: 9,
  C: 10,
  V: 11,
  B: 12,
  N: 13,
  M: 14,
  "<": 15,
};

const cymbalReverseKeyMap = {
  0: "z",
  1: "x",
  2: "c",
  3: "v",
  4: "b",
  5: "n",
  6: "m",
  7: ",",
  8: "Z",
  9: "X",
  10: "C",
  11: "V",
  12: "B",
  13: "N",
  14: "M",
  15: "<",
};

function createTrack(name, soundName, trackDivName) {
  const trackDiv = document.getElementById(trackDivName);

  // Create steps container
  const stepsDiv = document.createElement("div");
  stepsDiv.className = "steps";

  // Add steps to the track
  for (let i = 0; i < 16; i++) {
    const step = document.createElement("div");
    step.className = "step";
    if (i > 7) {
      step.classList.add("alt");
    }
    step.dataset.sound = soundName;
    step.dataset.step = i;
    step.addEventListener("click", function () {
      const stepIndex = parseInt(this.dataset.step);
      //  steps[soundName][stepIndex] = !steps[soundName][stepIndex];
      //  this.classList.toggle('active');
      toggleStep(soundName, stepIndex);
    });
    stepsDiv.appendChild(step);

    const keyLabel = document.createElement("span");
    keyLabel.className = "key-label";
    if (soundName == "kick") {
      keyLabel.innerText = kickReverseKeyMap[i];
    } else if (soundName == "snare") {
      keyLabel.innerText = snareReverseKeyMap[i];
    } else if (soundName == "hat") {
      keyLabel.innerText = hatReverseKeyMap[i];
    } else if (soundName == "cymbal") {
      keyLabel.innerText = cymbalReverseKeyMap[i];
    }

    step.appendChild(keyLabel);

    stepsDiv.appendChild(step);
  }

  // Append steps to track container
  trackDiv.appendChild(stepsDiv);

  // Add the track to the sequencer
  sequencer.appendChild(trackDiv);
}

startBtn.addEventListener("click", async () => {
  await Tone.start();
  console.log("Audio context started");
  sequencer.style.display = "block";
  mainContentContainer.style.display = "block";
  // piano.style.display = "flex";
  startBtn.style.display = "none";
  tracks.forEach((track) =>
    createTrack(track.name, track.name.toLowerCase(), track.trackDivName)
  );
});

// Function to toggle a step
function toggleStep(trackName, stepIndex) {
  steps[trackName][stepIndex] = !steps[trackName][stepIndex];

  // Find the correct track label and toggle the step in that track
  const trackDivs = document.querySelectorAll(".track");
  trackDivs.forEach((trackDiv) => {
    const label = trackDiv.querySelector(".track-label");
    if (label.innerText.toLowerCase() === trackName) {
      const stepDiv = trackDiv.querySelector(
        `.steps .step:nth-child(${stepIndex + 1})`
      );
      if (stepDiv) {
        stepDiv.classList.toggle("active");
      }
    }
  });
}

// Sequence
const seq = new Tone.Sequence(
  (time, col) => {
    if (steps.kick[col]) kick.start(time);
    if (steps.snare[col]) snare.start(time);
    if (steps.hat[col]) hat.start(time);
    if (steps.cymbal[col]) cymbal.start(time);
  },
  [...Array(16).keys()],
  "16n"
);

// Play button
playBtn.addEventListener("click", () => {
  startPlayback();
});

// Stop button
stopBtn.addEventListener("click", () => {
  stopPlayback();
});

function startPlayback() {
  isPlaying = true;
  Tone.Transport.start();
  seq.start(0);
  playBtn.classList.add("active");
  stopBtn.classList.remove("active");
}

function stopPlayback() {
  isPlaying = false;
  Tone.Transport.stop();
  seq.stop();
  playBtn.classList.remove("active");
  stopBtn.classList.add("active");
}

// Low pass filter slider
document.getElementById("filterSlider").addEventListener("input", (event) => {
  const frequency = event.target.value;
  filter.frequency.value = frequency;
});

// Bitcrusher slider
// document
//   .getElementById("bitcrusherSlider")
//   .addEventListener("input", (event) => {
//     const bits = event.target.value;
//     bitcrusher.bits = bits;
//     // const wet = event.target.value/100;
//     // bitcrusher.wet = wet;
//   });

// Distortion slider
document
  .getElementById("distortionSlider")
  .addEventListener("input", (event) => {
    const distortionAmount = event.target.value;
    distortion.distortion = distortionAmount;
  });


// listen to bpm input changes
bpmInput.addEventListener("input", (event) => {
  const bpm = event.target.value;
  Tone.Transport.bpm.value = bpm;
});

// listen to bpm input onfocus 
bpmInput.addEventListener("focus", (event) => {
  isBpmFocused = true;
});

// listen to bpm input onblur
bpmInput.addEventListener("blur", (event) => {
  isBpmFocused = false;
});

// Keyboard listener
document.addEventListener("keydown", (event) => {
  if(isBpmFocused) {
    //if user htis enter key, blur the input
    if(event.code === 'Enter'){
      bpmInput.blur();
      isBpmFocused = false;
    }
    return;
  };
  if (event.code === 'Space') {
    if(isPlaying){
        stopPlayback();
    }else{
        startPlayback();
    }
  }

  const stepIndex = kickKeyMap[event.key];
  if (stepIndex !== undefined) {
    toggleStep("kick", stepIndex);
  }

  const snareStepIndex = snareKeyMap[event.key];
  if (snareStepIndex !== undefined) {
    toggleStep("snare", snareStepIndex);
  }

  const hatStepIndex = hatKeyMap[event.key];
  if (hatStepIndex !== undefined) {
    toggleStep("hat", hatStepIndex);
  }

  const cymbalStepIndex = cymbalKeyMap[event.key];
  if (cymbalStepIndex !== undefined) {
    toggleStep("cymbal", cymbalStepIndex);
  }
});
