import TextField from './text-field';

class UrlField extends TextField {
    constructor(shell) {
        const box = document.createElement('input');
        box.type = 'url';
        if (!shell)
            shell = box;

        super('', box, shell);
        const self = this;
    }
}

export default UrlField;
