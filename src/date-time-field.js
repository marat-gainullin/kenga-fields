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
                value = new Date(box.value);
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
                    if (aValue != null) {
                        let textValue = (aValue.getFullYear()+'').padStart(2, '0') + '-' + ((aValue.getMonth() + 1)+'').padStart(2, '0') + '-' + (aValue.getDate()+'').padStart(2, '0') + 'T' + (aValue.getHours()+'').padStart(2, '0') + ':' + (aValue.getMinutes()+'').padStart(2, '0');
                        if (box.step != '') {
                            if (box.step.toLowerCase() == 'any' || Number(box.step) < 60) {
                              textValue += ':' + (aValue.getSeconds()+'').padStart(2, '0')
                            }
                            if (box.step.toLowerCase() == 'any' || Number(box.step) < 1) {
                              textValue += '.' + (aValue.getMilliseconds()+'').padStart(2, '0')
                            }
                        }
                        box.value = textValue
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
