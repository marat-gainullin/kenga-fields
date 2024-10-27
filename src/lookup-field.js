import BoxField from 'kenga/box-field';
import Popup from 'kenga/popup';

class LookupField extends BoxField {
    constructor(shell) {
        const box = document.createElement('input');
        box.type = 'text'
        if (!shell) {
            shell = box;
        }
        super(box, shell);
        shell.classList.add('p-lookup')

        const self = this;
        const itemsContainer = document.createElement('div');
        itemsContainer.classList.add('p-lookup-items')
        const popup = new Popup(itemsContainer)

        const items = []
        let visibleItemCount = 8
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
                    valuesIndicies.set(items[i]['js-value'], i);
                }
            }
        }

        const mouseDownReg = Ui.on(box, Ui.Events.MOUSEDOWN, evt => {
            popup.popupRelativeTo(box)
        })
        const inputReg = Ui.on(box, Ui.Events.INPUT, evt => {
            const text = box.value.trim()
            items.forEach(item => {
                if (text == '') {
                    item.classList.remove('p-lookup-unmatch')
                    item.classList.remove('p-lookup-match')
                } else {
                    if (item.innerText.contains(text)) {
                        item.classList.remove('p-lookup-unmatch')
                        item.classList.add('p-lookup-match')
                    } else {
                        item.classList.remove('p-lookup-match')
                        item.classList.add('p-lookup-unmatch')
                    }
                }
            })
            if (!popup.shown) {
                popup.popupRelativeTo(box)
            }
        })

        function textChanged() {
            const foundAt = items.findIndex(item => item.innerText == box.value)
            if (foundAt != -1) {
                self.value = valueAt(foundAt)
                box.value = labelAt(foundAt)
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
                    if (value != null) {
                        const at = indexOfValue(value)
                        box.value = box.placeholder = labelAt(at);
                    } else {
                        box.value = ''
                        box.placeholder = emptyText
                    }
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

        Object.defineProperty(this, 'visibleItemCount', {
            get: function () {
                return visibleItemCount;
            },
            set: function (aValue) {
                visibleItemCount = aValue;
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
            return item ? item['js-value'] : null;
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
                item['js-value'] = aValue;
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
            validateValuesIndicies();
            return valuesIndicies.get(aValue);
        }

        Object.defineProperty(this, 'indexOfValue', {
            get: function () {
                return indexOfValue;
            }
        });

    }
}

export default LookupField;
