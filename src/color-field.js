import Color from 'kenga/color';
import BoxField from 'kenga/box-field';

class ColorField extends BoxField {
    constructor(shell) {
        const box = document.createElement('input');
        box.type = 'color';
        if (!shell)
            shell = box;

        super(box, shell);
        const self = this;
        let value = null;

        function format(color) {
            return color ? color.toString() : '#fff';
        }

        function parse(source) {
            const parsed = Color.parse(source);
            return parsed ? new Color(parsed.red, parsed.green, parsed.blue, parsed.alpha) : parsed;
        }

        this.parse = parse;
        this.format = format;

        this.checkValidity = () => {
            return true;
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
                    box.value = self.format(value);
                    self.fireValueChanged(oldValue);
                }
            }
        });
    }
}

export default ColorField;
