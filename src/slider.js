import i18n from './i18n';
import ConstraintField from './constraint-field';

class RangeField extends ConstraintField {
    constructor(shell) {
        const box = document.createElement('input');
        box.type = 'range';
        if (!shell)
            shell = box;

        super(box, shell);
        const self = this;
        let value = null;
        let text = '';
        box.classList.add('p-indeterminate');

        function checkNullClasses() {
            if (value === null) {
                box.classList.add('p-indeterminate');
            } else {
                box.classList.remove('p-indeterminate');
            }
        }

        this.formatError = () => {
            const message = i18n['not.a.number'];
            return message ? `${message}(${box.value})` : box.validationMessage;
        };

        this.checkValidity = () => {
            return !isNaN(parseFloat(box.value));
        };

        function textChanged() {
            const oldValue = value;
            if (box.value !== '') {
                if (self.checkValidity()) {
                    value = parseFloat(box.value);
                }
            } else {
                value = null;
            }
            checkNullClasses();
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
                return text;
            },
            set: function(aValue) {
                if (aValue && isNaN(parseFloat(aValue)))
                    return;
                if (text !== aValue) {
                    box.value = aValue;
                    text = aValue;
                    textChanged();
                }
            }
        });

        Object.defineProperty(this, 'value', {
            get: function() {
                return value;
            },
            set: function(aValue) {
                if (!isNaN(aValue)) {
                    if (value !== aValue) {
                        const oldValue = value;
                        value = aValue;
                        text = value != null ? `${value}` : '';
                        box.value = text;
                        checkNullClasses();
                        self.fireValueChanged(oldValue);
                    }
                }
            }
        });
    }
}

export default RangeField;
