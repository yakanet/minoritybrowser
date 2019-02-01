export class PhotoBook {
    private wrapper: Element;
    private _selectedPhoto: number;


    constructor(private photoUrl: string[]) {

    }

    get selectedPhotoIndex() {
        return this._selectedPhoto;
    }

    public initLayout(wrapper: Element) {
        this.wrapper = wrapper;
        const margin = 100;
        const perRow = Math.floor((innerWidth - margin * 2) / 300);

        wrapper.innerHTML = '';
        this.photoUrl.forEach((photo, index) => {
            const image: HTMLDivElement = document.createElement('div');
            image.classList.add('photo');
            image.style.backgroundImage = `url(${photo})`;
            image.style.transform = 'rotate(' + (Math.random() * 90 - 45) + 'deg)';
            image.style.left = (margin + (index % perRow) * 300) + 'px';
            image.style.top = Math.floor(index / perRow) * 300 + 'px';
            image.style.width = '300px';
            image.style.height = '300px';

            wrapper.appendChild(image);
        });
    }

    public selectPhoto(index: number) {
        if (this.wrapper.childElementCount > index && index >= 0) {
            this._selectedPhoto = index;
            this.cancel();
            (<HTMLDivElement>this.wrapper.childNodes[index]).classList.add('selected');
        }
    }

    public cancel() {
        this.wrapper.querySelectorAll('.selected').forEach(e => {
            e.classList.remove('selected', 'zoom', 'done');
        });
    }

    public zoom(index: number) {
        this.cancel();
        if (this.wrapper.childElementCount > index && index >= 0) {
            const element = <HTMLDivElement>this.wrapper.childNodes[index];
            this.selectPhoto(index);
            element.classList.add('zoom');
            setTimeout(() => element.classList.add('done'), 1000);
        }
    }
}