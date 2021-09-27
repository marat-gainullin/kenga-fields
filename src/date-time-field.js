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

        function parse(source) {
            return new Date(source);
        }

        function format(date) {
            const formatted = new Date(-(new Date()).getTimezoneOffset() * 60000 + date.valueOf()).toJSON();
            const zi = formatted.indexOf('Z');
            if (zi > -1) {
                return formatted.substring(0, zi);
            } else {
                return formatted;
            }
        }

        this.parse = parse;
        this.format = format;

        this.formatError = () => {
            const message = i18n['not.a.datetime'];
            return message ? `${message}(${box.value})` : box.validationMessage;
        };

        this.checkValidity = () => {
            return !isNaN(self.parse(box.value));
        };

        function textChanged() {
            const oldValue = value;
            if (box.value !== '') {
                if (self.checkValidity()) {
                    value = self.parse(box.value);
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
            get: function() {
                return textChanged;
            }
        });

        Object.defineProperty(this, 'text', {
            get: function() {
                return box.value;
            },
            set: function(aValue) {
                if (box.value !== aValue) {
                    box.value = aValue;
                    textChanged();
                }
            }
        });

        Object.defineProperty(this, 'value', {
            get: function() {
                return value;
            },
            set: function(aValue) {
                if (value !== aValue) {
                    const oldValue = value;
                    value = aValue;
                    box.value = value != null ? self.format(value) : '';
                    self.fireValueChanged(oldValue);
                }
            }
        });
    }
}

export default DateTimeField;
