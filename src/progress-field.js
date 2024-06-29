import ConstraintField from './constraint-field';

class ProgressField extends ConstraintField {
    constructor(box, shell) {
        if (!box)
            box = document.createElement('progress');
        if (!shell) {
            shell = box;
        }

        super(box, shell);
        const self = this;
        box.classList.add('p-indeterminate');

        function checkNullClasses() {
            if (value === null) {
                box.classList.add('p-indeterminate');
                box.removeAttribute('value');
            } else {
                box.classList.remove('p-indeterminate');
            }
        }

        var value = null;

        function textChanged() {
            const oldValue = value;
            value = box.value;
            checkNullClasses();
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
                return value == null ? '' : box.value + '';
            },
            set: function (aValue) {
                if (box.value !== aValue) {
                    if (aValue == '') {
                        self.value = null
                    } else {
                        const parsed = parseFloat(aValue);
                        if (isNaN(parsed)) {
                            self.value = null
                        } else {
                            box.value = parsed;
                            textChanged();
                        }
                    }
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
                    box.value = aValue != null ? aValue : 0;
                    value = aValue;
                    checkNullClasses();
                    self.fireValueChanged(oldValue);
                }
            }
        });
    }
}

export default ProgressField;
