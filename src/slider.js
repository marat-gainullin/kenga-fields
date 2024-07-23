import FocusEvent from 'kenga/events/focus-event';
import BlurEvent from 'kenga/events/blur-event';
import KeyEvent from "kenga/events/key-event";
import ValueChangeEvent from 'kenga/events/value-change-event'
import Widget from 'kenga/widget'
import Ui from 'kenga/utils'

export default class Slider extends Widget {

    constructor(shell/*?: HTMLElement*/) {
        super(shell)
    /*private*/ const _trackLeft = document.createElement('div')//: HTMLElement
    /*private*/ const _trackRight = document.createElement('div')//: HTMLElement
    /*private*/ const _thumb = document.createElement('div')//: HTMLElement
    /*private*/ const _ticks = document.createElement('div')//: HTMLElement
    /*private*/ const _spacer = document.createElement('div')//: HTMLElement
    /*private*/ let _step = 1
    /*private*/ let _minimum = 0
    /*private*/ let _maximum = 100
    /*private*/ let _ticksMinimum = null
    /*private*/ let _ticksStep = null
    /*private*/ let _ticksMaximum = null
    /*private*/ let _value/*: number*/ = null
    /*private*/ let _continuousValueChange = false
        const self = this

        this.shell.classList.add('p-slider')
        _spacer.classList.add('p-slider-spacer')
        _trackLeft.classList.add('p-slider-track-left')
        _trackRight.classList.add('p-slider-track-right')
        _thumb.classList.add('p-slider-thumb')
        _ticks.classList.add('p-slider-ticks')
        _ticks.appendChild(_thumb)
        
        this.shell.appendChild(_spacer)
        this.shell.appendChild(_trackLeft)
        this.shell.appendChild(_trackRight)
        this.shell.appendChild(_ticks)

        this.shell.addEventListener(Ui.Events.KEYDOWN, (event) => {
            if (_step != null) {
                const key = event.key.toLowerCase()
                if (key == 'arrowup' || key == 'arrowright') {
                    self.value += _step
                } else if (key == 'arrowdown' || key == 'arrowleft') {
                    self.value -= _step
                }
            }
        })

        _ticks.onpointerdown = (dEvent/*: PointerEvent*/) => {
            const min = _minimum ?? 0
            const max = _maximum ?? 100
            const span = max - min
            if (dEvent.target == _ticks) {
                const dk = dEvent.offsetX / _ticks.offsetWidth
                self.value = constrainedValueOf(min + span * dk)
            }
            _ticks.setPointerCapture(dEvent.pointerId)
            _ticks.onpointermove = (mEvent/*: PointerEvent*/) => {
                if (mEvent.target == _ticks && dEvent.screenX != mEvent.screenX) {
                    const mk = mEvent.offsetX / _ticks.offsetWidth
                    const newValue = constrainedValueOf(min + span * mk)
                    if (_continuousValueChange) {
                        self.value = newValue
                    } else {
                        checkThumb(newValue)
                    }
                }
            }
            _ticks.onpointerup = (uEvent/*: PointerEvent*/) => {
                _ticks.releasePointerCapture(uEvent.pointerId)
                _ticks.onpointermove = null
                _ticks.onpointerup = null
                if (uEvent.target == _ticks && dEvent.screenX != uEvent.screenX) {
                    const uk = uEvent.offsetX / _ticks.offsetWidth
                    self.value = constrainedValueOf(min + span * uk)
                }
            }
        }
        checkNull()
        checkThumb(_value)


        Object.defineProperty(this, 'minimum', {
            get: function ()/*: number*/ {
                return _minimum
            },

            set: function (value/*: number*/) {
                if (_minimum != value) {
                    _minimum = value
                    refillTicks()
                }
            }
        });
        Object.defineProperty(this, 'maximum', {
            get: function ()/*: number*/ {
                return _maximum
            },

            set: function (value/*: number*/) {
                if (_maximum != value) {
                    _maximum = value
                    refillTicks()
                }
            }
        });

        Object.defineProperty(this, 'step', {
            get: function ()/*: number*/ {
                return _step
            },

            set: function (value/*: number*/) {
                if (_step != value) {
                    _step = value
                    refillTicks()
                }
            }
        })

        Object.defineProperty(this, 'ticksStep', {
            get: function ()/*: number*/ {
                return _ticksStep
            },

            set: function (value/*: number*/) {
                if (_ticksStep != value) {
                    if (value == null) {
                        _ticksStep = value
                    } else {
                        const parsed = parseFloat(value)
                        if (isNaN(parsed)) {
                            _ticksStep = null
                        } else {
                            _ticksStep = parsed
                        }
                    }
                    refillTicks()
                }
            }
        })

        Object.defineProperty(this, 'ticksMinimum', {
            get: function ()/*: number*/ {
                return _ticksMinimum
            },

            set: function (value/*: number*/) {
                if (_ticksMinimum != value) {
                    if (value == null) {
                        _ticksMinimum = value
                    } else {
                        const parsed = parseFloat(value)
                        if (isNaN(parsed)) {
                            _ticksMinimum = null
                        } else {
                            _ticksMinimum = parsed
                        }
                    }
                    refillTicks()
                }
            }
        })

        Object.defineProperty(this, 'ticksMaximum', {
            get: function ()/*: number*/ {
                return _ticksMaximum
            },

            set: function (value/*: number*/) {
                if (_ticksMaximum != value) {
                    if (value == null) {
                        _ticksMaximum = value
                    } else {
                        const parsed = parseFloat(value)
                        if (isNaN(parsed)) {
                            _ticksMaximum = null
                        } else {
                            _ticksMaximum = parsed
                        }
                    }
                    refillTicks()
                }
            }
        })

        Object.defineProperty(this, 'continuousValueChange', {
            get: function ()/*: boolean */ {
                return _continuousValueChange
            },

            set: function (value/*: number*/) {
                if (_continuousValueChange != value) {
                    _continuousValueChange = value
                }
            }
        })


        Object.defineProperty(this, 'value', {
            get: function ()/*: number*/ {
                return _value
            },

            set: function (aValue) {
                if (_value != aValue) {
                    const oldValue = _value
                    if (aValue == null) {
                        _value = aValue
                    } else {
                        _value = constrainedValueOf(aValue)
                    }
                    checkNull()
                    checkThumb(_value)
                    fireValueChanged(oldValue)
                }
            }
        })

        function constrainedValueOf(aValue) {
            const min = _minimum ?? 0
            const max = _maximum ?? 100
            const snappedValue = _step != null ? Math.round(aValue / (_step)) * _step : aValue
            return Math.min(max, Math.max(min, snappedValue))
        }

    /*private*/ function checkNull() {
            if (_value == null) {
                self.shell.classList.add('p-indeterminate');
            } else {
                self.shell.classList.remove('p-indeterminate');
            }
        }

    /*private*/ function checkThumb(val) {
            const min = _minimum ?? 0
            const max = _maximum ?? 100
            const span = (max - min) / 100
            const thumbAt = val ?? 0
            _trackLeft.style.width =
                _thumb.style.left =
                _trackRight.style.left = `${(thumbAt - min) / span}%`
            _thumb.title = val != null ? val + '' : ''
        }


    /*private*/ function addTick(min/*: number*/, span/*: number*/, tickAt/*: number*/) {
            const tick = document.createElement('div')
            tick.classList.add('p-slider-tick');
            const tickLabel = document.createElement('p')
            tickLabel.classList.add('p-slider-tick-label')
            const labelText = `${tickAt}`
            tickLabel.innerHTML = labelText
            tickLabel.style.marginLeft = `-${labelText.length / 4}em`;
            (() => {
                const wasTickAt = tickAt
                tick.onpointerdown = () => {
                    self.value = wasTickAt
                }
            })()
            tick.style.left = `${(tickAt - min) / span * 100}%`

            tick.appendChild(tickLabel)
            _ticks.appendChild(tick)
        }

    /*private*/ function refillTicks() {
            _ticks.innerHTML = ''

            if (_ticksStep != null) {
                const valuesMin = _minimum ?? 0
                const valuesMax = _maximum ?? 100
                const valuesSpan = valuesMax - valuesMin
                const min = _ticksMinimum ?? valuesMin
                const max = _ticksMaximum ?? valuesMax


                addTick(valuesMin, 1, valuesMin)
                let tickAt = min
                while (tickAt <= max) {
                    if (tickAt > valuesMin && tickAt < valuesMax) {
                        addTick(valuesMin, valuesSpan, tickAt)
                    }
                    tickAt += _ticksStep
                }
                addTick(0, valuesMax, valuesMax)
            }
            _ticks.appendChild(_thumb)
        }

        const valueChangeHandlers = new Set();

        function addValueChangeHandler(handler) {
            valueChangeHandlers.add(handler);
            return {
                removeHandler: function () {
                    valueChangeHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addValueChangeHandler', {
            get: function () {
                return addValueChangeHandler;
            }
        });

        function fireValueChanged(oldValue) {
            if (self.validate) {
                self.validate()
            }
            const event = new ValueChangeEvent(self, oldValue, self.value);
            valueChangeHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        Object.defineProperty(this, 'fireValueChanged', {
            get: function () {
                return fireValueChanged;
            }
        });
        const focusHandlers = new Set();

        function addFocusHandler(handler) {
            focusHandlers.add(handler);
            return {
                removeHandler: function () {
                    focusHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addFocusHandler', {
            get: function () {
                return addFocusHandler;
            }
        });

        Ui.on(this.box, Ui.Events.FOCUS, fireFocus);

        function fireFocus() {
            const event = new FocusEvent(self);
            focusHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        const focusLostHandlers = new Set();

        function addFocusLostHandler(handler) {
            focusLostHandlers.add(handler);
            return {
                removeHandler: function () {
                    focusLostHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addFocusLostHandler', {
            get: function () {
                return addFocusLostHandler;
            }
        });

        Ui.on(this.box, Ui.Events.BLUR, fireBlur);

        function fireBlur() {
            const event = new BlurEvent(self);
            focusLostHandlers.forEach(h => {
                Ui.later(() => {
                    h(event);
                });
            });
        }

        function addKeyTypeHandler(handler) {
            return Ui.on(self.box, Ui.Events.KEYPRESS, evt => {
                handler(new KeyEvent(self, evt));
            });
        }

        Object.defineProperty(this, 'addKeyTypeHandler', {
            configurable: true,
            get: function () {
                return addKeyTypeHandler;
            }
        });

        function addKeyPressHandler(handler) {
            return Ui.on(self.box, Ui.Events.KEYDOWN, evt => {
                handler(new KeyEvent(self, evt));
            });
        }

        Object.defineProperty(this, 'addKeyPressHandler', {
            configurable: true,
            get: function () {
                return addKeyPressHandler;
            }
        });

        function addKeyReleaseHandler(handler) {
            return Ui.on(self.box, Ui.Events.KEYUP, evt => {
                handler(new KeyEvent(self, evt));
            });
        }

        Object.defineProperty(this, 'addKeyReleaseHandler', {
            configurable: true,
            get: function () {
                return addKeyReleaseHandler;
            }
        });
    }
}
