const wrapperElement = document.querySelector<HTMLDivElement>('.wrapper')!;


class PhotoBook {
    private wrapper: HTMLElement;

    constructor(private photoUrl: string[]) {

    }

    public initLayout(wrapper: HTMLElement) {
        this.wrapper = wrapper;
        const perRow = Math.floor(innerWidth / 300);

        wrapper.innerHTML = '';
        this.photoUrl.forEach((photo, index) => {
            const image: HTMLDivElement = document.createElement('div');
            image.classList.add('photo');
            image.style.backgroundImage = `url(${photo})`;
            image.style.transform = 'rotate(' + (Math.random() * 90 - 45) + 'deg)';
            image.style.left = (index % perRow) * 300 + 'px';
            image.style.top = Math.floor(index / perRow) * 300 + 'px';
            image.style.width = '300px';
            image.style.height = '300px';

            wrapper.appendChild(image);
        });
    }

    public selectPhoto(index: number) {
        if (this.wrapper.childElementCount > index) {
            this.cancel();
            (<HTMLDivElement>wrapperElement.childNodes[index]).classList.add('selected');
        }
    }

    public cancel() {
        this.wrapper.querySelectorAll('.selected').forEach(e => {
            e.classList.remove('selected', 'zoom', 'done');
        });
    }

    zoom(index: number) {
        this.cancel();
        if (this.wrapper.childElementCount > index) {
            this.cancel();
            const element = <HTMLDivElement>wrapperElement.childNodes[index];
            element.classList.add('selected');
            element.classList.add('zoom');
            setTimeout(() => element.classList.add('done'), 1000);
        }
    }
}


function init() {
    //
    photoBook.initLayout(wrapperElement);

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'fr';

    recognition.onresult = (event => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
            let reg;
            if (reg = result[0].transcript.match(/sélectionner .* ([0-9]+)/i)) {
                console.log('action = select ' + reg[1]);
                photoBook.selectPhoto(reg[1] - 1);
            }
            if (reg = result[0].transcript.match(/(a?grandir|zoomer|zoom) .* ([0-9]+)/i)) {
                console.log('action = zoom ' + reg[2]);
                photoBook.zoom(reg[2] - 1);
            }
            else if (reg = result[0].transcript.match(/annuler/i)) {
                console.log('action = cancel');
                photoBook.cancel();
            }
            console.log(result[0].transcript)
        }
    });
    console.log(recognition.continuous);
    recognition.start();
}

const photoBook = new PhotoBook([
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/300',
]);

init();