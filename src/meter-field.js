import ProgressField from './progress-field';

class MeterField extends ProgressField {
    constructor(shell) {
        const box = document.createElement('meter');
        if (!shell)
            shell = box;
        super(box, shell);

        const self = this;

        Object.defineProperty(this, 'low', {
            get: function() {
                const boxLow = parseFloat(box.low);
                return isNaN(boxLow) ? null : boxLow;
            },
            set: function(aValue) {
                box.low = aValue;
            }
        });
        Object.defineProperty(this, 'high', {
            get: function() {
                const boxHigh = parseFloat(box.high);
                return isNaN(boxHigh) ? null : boxHigh;
            },
            set: function(aValue) {
                box.high = aValue;
            }
        });
        Object.defineProperty(this, 'optimum', {
            get: function() {
                const boxOptimum = parseFloat(box.optimum);
                return isNaN(boxOptimum) ? null : boxOptimum;
            },
            set: function(aValue) {
                box.optimum = aValue;
            }
        });
    }
}

export default MeterField;
