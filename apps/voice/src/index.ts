const speakElement = document.querySelector('#speak');

async function init() {
    speakElement.addEventListener('click', () => {
        speak(document.querySelector('textarea').value);
    });

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'fr';
    recognition.continuous = true;
    recognition.onresult = (event) => {
        console.log(event.results[0][0]);
    };
    recognition.start();
    console.log(recognition);
}

function speak(message) {
    speechSynthesis.getVoices().forEach(voice => console.log(voice.name, voice.default ? voice.default : ''));
    const msg = new SpeechSynthesisUtterance(message);
    //msg.voice = speechSynthesis.getVoices().filter(voice => voice.name.indexOf('français') > -1)[0];
    console.log({voice:  msg.voice});

    speechSynthesis.speak(msg);
}

init();
