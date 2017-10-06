import i18n from './i18n';
import ConstraintField from './constraint-field';

class NumberField extends ConstraintField {
    constructor(box, shell) {
        if (!box) {
            box = document.createElement('input');
            box.type = 'number';
        }
        if (!shell) {
            shell = box;
        }
        super(box, shell);
        const self = this;
        let value = null;

        function textChanged() {
            const oldValue = value;
            if (box.value !== '') {
                const parsed = parseFloat(box.value);
                if (isNaN(parsed)) {
                    self.error = `${i18n['not.a.number']}(${box.value})`;
                } else {
                    value = parsed;
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
                if (aValue && isNaN(parseFloat(aValue)))
                    return;
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
                if (!isNaN(aValue)) {
                    if (value !== aValue) {
                        const oldValue = value;
                        value = aValue;
                        box.value = value != null ? `${value}` : '';
                        self.fireValueChanged(oldValue);
                    }
                }
            }
        });
    }
}

export default NumberField;
