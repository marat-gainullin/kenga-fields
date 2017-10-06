import TextField from './text-field';

class EMailField extends TextField {
    constructor(shell) {
        const box = document.createElement('input');
        box.type = 'email';
        if (!shell)
            shell = box;

        super('', box, shell);
        const self = this;
    }
}

export default EMailField;
