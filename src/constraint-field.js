import BoxField from 'kenga/box-field';

class ConstraintField extends BoxField {
    constructor(box, shell) {
        if (!box) {
            box = document.createElement('input');
            box.type = 'number';
        }
        if (!shell) {
            shell = box;
        }
        super(box, shell);

        Object.defineProperty(this, 'minimum', {
            get: function() {
                const boxMin = parseFloat(box.min);
                return isNaN(boxMin) ? null : boxMin;
            },
            set: function(aValue) {
                box.min = aValue;
            }
        });
        Object.defineProperty(this, 'maximum', {
            get: function() {
                const boxMax = parseFloat(box.max);
                return isNaN(boxMax) ? null : boxMax;
            },
            set: function(aValue) {
                box.max = aValue;
            }
        });
        Object.defineProperty(this, 'step', {
            get: function() {
                const boxStep = parseFloat(box.step);
                return isNaN(boxStep) ? null : boxStep;
            },
            set: function(aValue) {
                box.step = aValue;
            }
        });
    }
}

export default ConstraintField;
