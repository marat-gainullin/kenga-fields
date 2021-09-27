import BoxField from 'kenga/box-field';

class FormattedField extends BoxField {
    constructor(shell) {
        const box = document.createElement('input');
        box.type = 'text';
        if (!shell)
            shell = box;

        super(box, shell);
        const self = this;
        let value = null;

        function textChanged() {
            const oldValue = value;
            if (box.value !== '') {
                if (self.checkValidity) {
                    if (self.checkValidity()) {
                        value = self.parse ? self.parse(box.value) : box.value;
                    }// else leave value as is
                } else {
                    value = box.value
                }
            } else {
                value = null;
            }
            if (value !== oldValue) {
                self.fireValueChanged(oldValue);
            }
        }

        Object.defineProperty(this, 'textChanged', {
            enumerable: false,
            get: function () {
                return textChanged;
            }
        });

        Object.defineProperty(this, 'text', {
            get: function () {
                return box.value;
            },
            set: function (aValue) {
                if (box.value !== aValue) {
                    box.value = aValue;
                    textChanged();
                }
            }
        });

        Object.defineProperty(this, 'value', {
            get: function () {
                return value;
            },
            set: function (aValue) {
                if (value !== aValue) {
                    const oldValue = value;
                    value = aValue;
                    box.value = self.format ? self.format(value) : `${value}`;
                    self.fireValueChanged(oldValue);
                }
            }
        });
    }
}

export default FormattedField;
