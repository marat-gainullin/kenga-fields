import BoxField from 'kenga/box-field';
import i18n from './i18n';

class TimeField extends BoxField {
    constructor(shell) {
        const box = document.createElement('input');
        box.type = 'time';
        if (!shell)
            shell = box;

        super(box, shell);
        const self = this;
        let value = null;

        this.formatError = () => {
            const message = i18n['not.a.time'];
            return box.value != '' && message ? `${message}(${box.value})` : box.validationMessage;
        };

        this.checkValidity = () => {
            return box.value == '' || !isNaN(box.valueAsNumber);
        };

        function textChanged() {
            const oldValue = value;
            if (box.value !== '') {
                value = box.valueAsNumber;
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
                    if (value != null) {
                        box.valueAsNumber = value;
                    } else {
                        box.value = '';
                    }
                    self.fireValueChanged(oldValue);
                }
            }
        });
    }
}

export default TimeField;
