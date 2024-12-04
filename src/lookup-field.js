import Ui from 'kenga/utils';
import BoxField from 'kenga/box-field';
import Popup from 'kenga/popup';

const JS_VALUE = 'js-value'

class LookupField extends BoxField {
    constructor(shell) {
        const box = document.createElement('input');
        box.type = 'text'
        if (!shell) {
            shell = box;
        }
        super(box, shell);
        shell.classList.add('p-lookup')
        shell.classList.add('p-lookup-values-hidden')

        this.validateOnInput = false
        const self = this;
        const itemsContainer = document.createElement('div');
        itemsContainer.classList.add('p-lookup-items')
        let popup = new Popup(itemsContainer)
        popup.addShowHandler(() => { 
            shell.classList.add('p-lookup-values-shown') 
            shell.classList.remove('p-lookup-values-hidden') 
        })
        popup.addHideHandler(() => {
            shell.classList.add('p-lookup-values-hidden')
            shell.classList.remove('p-lookup-values-shown')
        })

        const items = []
        itemsContainer.style.maxHeight = '20vh'
        let value = null;
        let valuesIndicies = null;
        let emptyText = ''

        function invalidateValuesIndicies() {
            valuesIndicies = null;
        }

        function validateValuesIndicies() {
            if (!valuesIndicies) {
                valuesIndicies = new Map();
                for (let i = 0; i < items.length; i++) {
                    valuesIndicies.set(items[i][JS_VALUE], i);
                }
            }
        }

        function filterLookup() {
            const text = box.value.trim().toLowerCase()
            items.forEach(item => {
                if (text == '') {
                    item.classList.remove('p-lookup-unmatch')
                    item.classList.remove('p-lookup-match')
                } else {
                    if (item.innerText.toLowerCase().includes(text)) {
                        item.classList.remove('p-lookup-unmatch')
                        item.classList.add('p-lookup-match')
                    } else {
                        item.classList.remove('p-lookup-match')
                        item.classList.add('p-lookup-unmatch')
                    }
                }
            })
        }

        function valueToBox() {
            if (value != null) {
                const at = indexOfValue(value)
                box.value = box.placeholder = labelAt(at);
            } else {
                box.value = ''
                box.placeholder = emptyText
            }
        }

        function showLookup(clearText = false) {
            if (clearText) {
                box.value = ''
            }
            filterLookup()
            if (!popup.shown) {
                itemsContainer.style.width = `${box.offsetWidth}px`
                popup.popupRelativeTo(box, false, true, true)
            }
        }

        function hideLookup() {
            popup.close()
        }

        const mouseDownReg = Ui.on(box, Ui.Events.MOUSEDOWN, evt => {
            showLookup(true)
        })
        const inputReg = Ui.on(box, Ui.Events.INPUT, evt => {
            showLookup()
        })
        const blurReg = Ui.on(box, Ui.Events.BLUR, evt => {
            Ui.later(() => {
                valueToBox()
            })
        })

        function textChanged() {
            const text = box.value.trim().toLowerCase()
            if (text == '') {
                self.value = null
            } else {
                const found = items.filter(item => item.innerText.toLowerCase().includes(text))
                const equalsAt = items.findIndex(item => item.innerText.toLowerCase() == text)
                if (equalsAt != -1 && found.length == 1) {
                    self.value = valueAt(equalsAt)
                    Ui.later(() => {
                        popup.close()
                    })
                }
            }
        }

        Object.defineProperty(this, 'showLookup', {
            enumerable: false,
            get: function () {
                return showLookup;
            }
        });

        Object.defineProperty(this, 'hideLookup', {
            enumerable: false,
            get: function () {
                return showLookup;
            }
        });

        Object.defineProperty(this, 'onShowLookup', {
            get: function () {
                return popup.onShow;
            },
            set: function (aValue) {
                popup.onShow = aValue
            }
        });
        Object.defineProperty(this, 'onHideLookup', {
            get: function () {
                return popup.onHide;
            },
            set: function (aValue) {
                popup.onHide = aValue
            }
        });

        Object.defineProperty(this, 'textChanged', {
            enumerable: false,
            get: function () {
                return textChanged;
            }
        });

        Object.defineProperty(this, 'text', {
            get: function () {
                return box.value
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
                    const oldValue = value
                    value = aValue
                    valueToBox()
                    items.forEach(item => {
                        if (item[JS_VALUE] == value) {
                            item.classList.add('p-lookup-selected')
                        } else {
                            item.classList.remove('p-lookup-selected')
                        }
                    })
                    self.fireValueChanged(oldValue);
                }
            }
        });

        Object.defineProperty(this, 'selectedIndex', {
            get: function () {
                return indexOfValue(value);
            },
            set: function (index) {
                if (index >= 0 && index < items.length) {
                    self.value = valueAt(index);
                } else {
                    self.value = null;
                }
            }
        });

        Object.defineProperty(this, 'count', {
            get: function () {
                return items.length;
            }
        });

        Object.defineProperty(this, 'lookupHeight', {
            get: function () {
                return itemsContainer.style.maxHeight;
            },
            set: function (aValue) {
                if (itemsContainer.style.maxHeight != aValue) {
                    itemsContainer.style.maxHeight = aValue
                }
            }
        });

        function itemAt(index) {
            if (index >= 0 && index < items.length) {
                return items[index];
            } else {
                return null;
            }
        }

        Object.defineProperty(this, 'emptyText', {
            configurable: true,
            get: function () {
                return emptyText;
            },
            set: function (aValue) {
                emptyText = aValue ? aValue : '';
                if (value == null) {
                    box.placeholder = emptyText
                }
            }
        });

        function addValue(aLabel, aValue) {
            if (aValue !== null) {
                addItemAt(items.length, aLabel, aValue);
            }
        }

        Object.defineProperty(this, 'addValue', {
            get: function () {
                return addValue;
            }
        });

        function insertValue(insertAt, aLabel, aValue) {
            if (aValue !== null) {
                const index = indexOfValue(aValue);
                if (index === -1) {
                    addItemAt(insertAt, aLabel, aValue);
                }
            }
        }

        Object.defineProperty(this, 'insertValue', {
            get: function () {
                return insertValue;
            }
        });

        function updateLabel(aValue, aLabel) {
            if (aValue !== null) {
                const index = indexOfValue(aValue);
                if (index !== -1) {
                    const item = itemAt(index);
                    item.innerText = aLabel;
                }
            }
        }

        Object.defineProperty(this, 'updateLabel', {
            get: function () {
                return updateLabel;
            }
        });

        function valueAt(index) {
            const item = itemAt(index);
            return item ? item[JS_VALUE] : null;
        }

        Object.defineProperty(this, 'valueAt', {
            get: function () {
                return valueAt;
            }
        });

        function labelAt(index) {
            const item = itemAt(index);
            return item ? item.innerText : null;
        }

        Object.defineProperty(this, 'labelAt', {
            get: function () {
                return labelAt;
            }
        });

        function removeValue(aValue) {
            const index = indexOfValue(aValue);
            const removed = removeItemAt(index);
            return !!removed;
        }

        Object.defineProperty(this, 'removeValue', {
            get: function () {
                return removeValue;
            }
        });

        function clear() {
            popup.close()
            invalidateValuesIndicies();
            items.length = 0
        }

        Object.defineProperty(this, 'clear', {
            get: function () {
                return clear;
            }
        });

        function addItemAt(index, aLabel, aValue) {
            if (aValue !== null && index >= 0 && index <= items.length) {
                const item = document.createElement('div');
                item.classList.add('p-lookup-item')
                item.innerText = aLabel;
                item[JS_VALUE] = aValue;
                const clickReg = Ui.on(item, Ui.Events.CLICK, evt => {
                    self.value = aValue;
                    popup.close();
                })
                if (index === items.length) {
                    itemsContainer.appendChild(item)
                    items.push(item)
                    if (valuesIndicies) {
                        valuesIndicies.set(aValue, index);
                    }
                } else {
                    itemsContainer.insertBefore(item, items[index])
                    items.splice(index, 0, item)
                    invalidateValuesIndicies();
                }
            }
        }

        function removeItemAt(index) {
            if (index >= 0 && index < items.length) {
                const deleted = items.splice(index, 1);
                invalidateValuesIndicies()
                itemsContainer.removeChild(deleted[0])
                return deleted[0]
            }
        }

        function indexOfValue(aValue) {
            if (aValue != null) {
                validateValuesIndicies();
                return valuesIndicies.get(aValue);
            } else {
                -1
            }
        }

        Object.defineProperty(this, 'indexOfValue', {
            get: function () {
                return indexOfValue;
            }
        });

    }
}

export default LookupField;
