import TextField from './text-field';

class TextArea extends TextField {
    constructor(shell) {
        const box = document.createElement('textarea');
        if (!shell)
            shell = box;

        super('', box, shell);
        const self = this;
        shell.classList.add('p-scroll');
        shell.classList.add('p-vertical-scroll-filler');
        shell.classList.add('p-horizontal-scroll-filler');
    }
}

export default TextArea;
