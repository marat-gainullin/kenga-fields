import i18n from './i18n';
import BoxField from 'kenga/box-field';

class DateTimeField extends BoxField {
    constructor(shell) {
        const box = document.createElement('input');
        box.type = 'datetime-local';
        if (!shell)
            shell = box;

        super(box, shell);
        const self = this;
        let value = null;

        this.formatError = () => {
            const message = i18n['not.a.datetime'];
            return message ? `${message}(${box.value})` : box.validationMessage;
        };

        this.checkValidity = () => {
            return true;
        };

        function textChanged() {
            const oldValue = value;
            if (box.value !== '') {
                /* Browsers have very strange behaviour here. They treat timezone explicitly. And the value after the .valueAsNumber = assignment gets distorted */
                const offset = -(new Date()).getTimezoneOffset() * 60_000
                value = box.valueAsNumber != null ? new Date(box.valueAsNumber - offset) : null;
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
                return value
            },
            set: function (aValue) {
                if (value !== aValue) {
                    const oldValue = value;
                    value = aValue
                    if (aValue != null) {
                        /* Browsers have very strange behaviour here. They treat timezone explicitly. And the value after the .valueAsDate = assignment gets distorted */
                        const offset = -(new Date()).getTimezoneOffset() * 60_000
                        box.valueAsNumber = aValue != null ? aValue.getTime() + offset : null;
                    } else {
                        box.value = ''
                    }
                    self.fireValueChanged(oldValue);
                }
            }
        });
    }
}

export default DateTimeField;
