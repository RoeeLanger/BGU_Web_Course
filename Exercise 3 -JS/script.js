// The animals shown on the page. Each has a key (1-8) and a sound file
// (from the Sounds/ folder) that we play when the animal is triggered.
const animals = [
    { name: "Monkey",   img: "monkey.svg",   key: "1", sound: "8_bit_monkey_#1-1783498544546.mp3" },
    { name: "Lion",     img: "lion.svg",     key: "2", sound: "8_bit_lion_roar_#1-1783498507999.mp3" },
    { name: "Elephant", img: "elephant.svg", key: "3", sound: "8_bit_elephant_#4-1783498559010.mp3" },
    { name: "Snake",    img: "snake.svg",    key: "4", sound: "8_bit_snake_#3-1783498577753.mp3" },
    { name: "Frog",     img: "frog.svg",     key: "5", sound: "8_bit_frog_#2-1783498596045.mp3" },
    { name: "Parrot",   img: "parrot.svg",   key: "6", sound: "8_bit_parrot_#1-1783498619145.mp3" },
    { name: "Tiger",    img: "tiger.svg",    key: "7", sound: "8_bit_tiger_#4-1783498644085.mp3" },
    { name: "Toucan",   img: "toucan.svg",   key: "8", sound: "8_bit_toucan_#1-1783498659084.mp3" }
];

// Make an <audio> for each animal up front so it is ready to play on click
for (const animal of animals) {
    animal.audio = new Audio(`Sounds/${encodeURIComponent(animal.sound)}`);
}

// Play an animal's sound, restarting it if it is already playing.
function playSound(animal) {
    animal.audio.currentTime = 0;
    animal.audio.play();
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
    playSound(animal);
    card.classList.remove("playing");
    void card.offsetWidth; // restart the CSS animation
    card.classList.add("playing");
    setTimeout(() => card.classList.remove("playing"), 1000);
}

// Number keys 1-8 play the matching animal.
document.addEventListener("keydown", (e) => {
    const animal = animals.find(a => a.key === e.key);
    if (animal) trigger(animal, animal.card);
});
