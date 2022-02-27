import i18n from './i18n';
import BoxField from 'kenga/box-field';

class DateField extends BoxField {
    constructor(shell) {
        const box = document.createElement('input');
        box.type = 'date';
        if (!shell)
            shell = box;

        super(box, shell);
        const self = this;
        let value = null;

        this.formatError = () => {
            const message = i18n['not.a.date'];
            return message ? `${message}(${box.value})` : box.validationMessage;
        };

        this.checkValidity = () => {
            return true;
        };

        function textChanged() {
            const oldValue = value;
            if (box.value !== '') {
                if (self.checkValidity()) {
                    value = box.valueAsDate;
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
                /* Browsers have very strange behaviour here. They treat timezone explicitly. And the value after the .valueAsDate = assignment gets distorted */
                return box.valueAsDate != null ? new Date(box.valueAsDate.getTime() + box.valueAsDate.getTimezoneOffset() * 60_000) : null;
            },
            set: function (aValue) {
                if (value !== aValue) {
                    const oldValue = value;
                    value = aValue;
                    /* Browsers have very strange behaviour here. They treat timezone explicitly. And the value after the .valueAsDate = assignment gets distorted */
                    box.valueAsDate = value != null ? new Date(value.getTime() - value.getTimezoneOffset() * 60_000) : null;
                    self.fireValueChanged(oldValue);
                }
            }
        });
    }
}

export default DateField;
