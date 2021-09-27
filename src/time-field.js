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

        function parse(source) {
            return (new Date(`1970-01-01T${source}Z`)).valueOf();
        }

        function format(time) {
            const formatted = (new Date(time)).toJSON().substring('1970-01-01T'.length);
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
            const message = i18n['not.a.time'];
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
                    box.value = value != null ? self.format(value) : '';
                    self.fireValueChanged(oldValue);
                }
            }
        });
    }
}

export default TimeField;
