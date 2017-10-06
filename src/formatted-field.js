import BoxField from './box-field';

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
            value = self.onParse ? self.onParse(box.value) : box.value;
            self.fireValueChanged(oldValue);
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
                    box.value = self.onFormat ? self.onFormat(value) : `${value}`;
                    self.fireValueChanged(oldValue);
                }
            }
        });
    }
}

export default FormattedField;
