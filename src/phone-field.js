import TextField from './text-field';

class PhoneField extends TextField {
    constructor(shell) {
        const box = document.createElement('input');
        box.type = 'tel';
        if (!shell)
            shell = box;

        super('', box, shell);
        const self = this;
    }
}

export default PhoneField;
