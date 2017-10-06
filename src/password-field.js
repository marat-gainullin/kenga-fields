import TextField from './text-field';

class PasswordField extends TextField {
    constructor(shell) {
        const box = document.createElement('input');
        box.type = 'password';
        if (!shell)
            shell = box;

        super('', box, shell);
        const self = this;
    }
}

export default PasswordField;
