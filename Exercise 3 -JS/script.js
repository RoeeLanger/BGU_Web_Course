// The animals shown on the page. Each has a key (1-8) and a "voice":
// a short list of tones we play one after another to fake its sound.
const animals = [
    { name: "Monkey",   img: "monkey.svg",   key: "1", voice: [["square",700,900,0.08],["square",500,650,0.08],["square",760,980,0.09]] },
    { name: "Lion",     img: "lion.svg",     key: "2", voice: [["sawtooth",150,90,0.5],["sawtooth",110,70,0.4]] },
    { name: "Elephant", img: "elephant.svg", key: "3", voice: [["sawtooth",180,420,0.35],["sawtooth",420,160,0.4]] },
    { name: "Snake",    img: "snake.svg",    key: "4", voice: [["sawtooth",1400,1400,0.7]] },
    { name: "Frog",     img: "frog.svg",     key: "5", voice: [["square",220,180,0.1],["square",220,180,0.1],["square",220,180,0.1]] },
    { name: "Parrot",   img: "parrot.svg",   key: "6", voice: [["sawtooth",900,1500,0.12],["sawtooth",1500,800,0.12]] },
    { name: "Tiger",    img: "tiger.svg",    key: "7", voice: [["sawtooth",120,70,0.6],["sawtooth",90,60,0.5]] },
    { name: "Toucan",   img: "toucan.svg",   key: "8", voice: [["triangle",600,600,0.09],["triangle",520,520,0.09],["triangle",680,680,0.1]] }
];

// The Web Audio API (AudioContext) is something we didn't cover in class.
// Instead of loading sound files, it lets us build sounds in code: we create
// oscillators, set their pitch, and shape the volume over time. We use it for
// every animal call and for the background music below.
const audio = new (window.AudioContext || window.webkitAudioContext)();

// Play one tone: a wave that slides from one pitch to another and fades out.
function playTone(type, from, to, duration, startAt) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, startAt);
    osc.frequency.linearRampToValueAtTime(to, startAt + duration);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(0.25, startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    osc.connect(gain).connect(audio.destination);
    osc.start(startAt);
    osc.stop(startAt + duration);
}

// Play a whole animal voice by chaining its tones back to back.
function playVoice(voice) {
    if (audio.state === "suspended") audio.resume();
    let t = audio.currentTime;
    for (const [type, from, to, duration] of voice) {
        playTone(type, from, to, duration, t);
        t += duration;
    }
}

// Build the cards from the animals list instead of writing them by hand.
const jungle = document.getElementById("jungle");
for (const animal of animals) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML =
        `<img src="images/${animal.img}" alt="${animal.name}">
         <h3>${animal.name}</h3>
         <span class="key">key ${animal.key}</span>`;
    card.addEventListener("click", () => trigger(animal, card));
    animal.card = card; // keep a reference so the keyboard can find it
    jungle.appendChild(card);
}

// One place to play a sound and flash the card, used by both click and keyboard.
function trigger(animal, card) {
    playVoice(animal.voice);
    card.classList.remove("playing");
    void card.offsetWidth; // restart the CSS animation
    card.classList.add("playing");
}

// Number keys 1-8 play the matching animal.
document.addEventListener("keydown", (e) => {
    const animal = animals.find(a => a.key === e.key);
    if (animal) trigger(animal, animal.card);
});
