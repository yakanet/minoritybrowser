
async function init() {
    const msg = new SpeechSynthesisUtterance('Bonjour à tous');
    msg.voice = speechSynthesis.getVoices().filter(function (voice) { return voice.name.indexOf('français') > -1 })[0];

    speechSynthesis.getVoices().forEach(function (voice) {
        console.log(voice.name, voice.default ? voice.default : '');
    });
    speechSynthesis.speak(msg);

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'fr';
    recognition.onresult = (event) => {
        console.log(event.results[0][0]);
    };
    recognition.start();
    console.log(recognition);
}

init();
