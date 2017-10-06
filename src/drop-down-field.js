import Invoke from 'core/invoke';
import Logger from 'core/logger';
import i18n from './i18n';
import SelectionEvent from 'ui/events/item-event';
import BoxField from './box-field';

class DropDownField extends BoxField {
    constructor(shell) {
        const box = document.createElement('select');
        if (!shell) {
            shell = box;
        }
        super(box, shell);

        const self = this;
        let value = null;
        const nullItem = document.createElement('option');
        nullItem.innerText = '< . >';
        nullItem.className = 'p-indeterminate';
        nullItem.value = '';
        nullItem['js-value'] = null;
        box.appendChild(nullItem);
        let valuesIndicies = null;

        function invalidateValuesIndicies() {
            valuesIndicies = null;
        }

        function validateValuesIndicies() {
            if (!valuesIndicies) {
                valuesIndicies = new Map();
                for (let i = 0; i < box.options.length; i++) {
                    valuesIndicies.set(box.options[i]['js-value'], i);
                }
            }
        }

        function itemChanged() {
            const oldValue = value;
            if (box.selectedIndex === -1) {
                value = null;
            } else {
                value = valueAt(box.selectedIndex);
            }
            fireSelected(value);
            self.fireValueChanged(oldValue);
        }

        const selectionHandlers = new Set();

        function addSelectionHandler(handler) {
            selectionHandlers.add(handler);
            return {
                removeHandler: function() {
                    selectionHandlers.delete(handler);
                }
            };
        }

        Object.defineProperty(this, 'addSelectionHandler', {
            get: function() {
                return addSelectionHandler;
            }
        });

        function fireSelected(aItem) {
            const event = new SelectionEvent(self, aItem);
            selectionHandlers.forEach(h => {
                Invoke.later(() => {
                    h(event);
                });
            });
        }

        Object.defineProperty(this, 'textChanged', {
            enumerable: false,
            get: function() {
                return itemChanged;
            }
        });

        Object.defineProperty(this, 'text', {
            get: function() {
                if (box.selectedIndex === -1) {
                    return '';
                } else {
                    const item = itemAt(box.selectedIndex);
                    if (item)
                        return item.innerText;
                    else
                        return '';
                }
            }
        });

        Object.defineProperty(this, 'value', {
            get: function() {
                return value;
            },
            set: function(aValue) {
                if (value !== aValue) {
                    if (aValue != null) {
                        const index = indexOfValue(aValue);
                        if (index !== -1) {
                            box.selectedIndex = index;
                        } else {
                            box.selectedIndex = indexOfValue(null);
                        }
                    } else {
                        box.selectedIndex = indexOfValue(null);
                    }
                    itemChanged();
                }
            }
        });

        Object.defineProperty(this, 'selectedIndex', {
            get: function() {
                return box.selectedIndex;
            },
            set: function(index) {
                if (index >= 0 && index < getCount()) {
                    box.selectedIndex = index;
                } else {
                    box.selectedIndex = -1;
                }
                itemChanged();
            }
        });

        Object.defineProperty(this, 'count', {
            get: function() {
                return box.options.length;
            }
        });

        Object.defineProperty(this, 'visibleItemCount', {
            get: function() {
                return box.size;
            },
            set: function(aValue) {
                box.size = aValue;
            }
        });

        function itemAt(index) {
            if (index >= 0 && index < box.options.length) {
                return box.options[index];
            } else {
                return null;
            }
        }

        Object.defineProperty(this, "emptyText", {
            configurable: true,
            get: function() {
                return nullItem.innerText;
            },
            set: function(aValue) {
                nullItem.innerText = aValue ? aValue : '< . >';
            }
        });

        function addValue(aLabel, aValue) {
            if (aValue !== null) {
                addItem(box.options.length, aLabel, aValue);
            }
        }

        Object.defineProperty(this, 'addValue', {
            get: function() {
                return addValue;
            }
        });

        function insertValue(insertAt, aLabel, aValue) {
            if (aValue !== null) {
                const index = indexOfValue(aValue);
                if (index === -1) {
                    addItem(insertAt, aLabel, aValue);
                }
            }
        }

        Object.defineProperty(this, 'insertValue', {
            get: function() {
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
            get: function() {
                return updateLabel;
            }
        });

        function valueAt(index) {
            const item = itemAt(index);
            return item ? item['js-value'] : null;
        }

        Object.defineProperty(this, 'valueAt', {
            get: function() {
                return valueAt;
            }
        });

        function labelAt(index) {
            const item = itemAt(index);
            return item ? item.innerText : null;
        }

        Object.defineProperty(this, 'labelAt', {
            get: function() {
                return labelAt;
            }
        });

        function removeValue(aValue) {
            const index = indexOfValue(aValue);
            const removed = removeItem(index);
            return removed ? true : false;
        }

        Object.defineProperty(this, 'removeValue', {
            get: function() {
                return removeValue;
            }
        });

        function clear() {
            while (box.firstElementChild) {
                box.removeChild(box.firstElementChild);
            }
            invalidateValuesIndicies();
            box.appendChild(nullItem);
        }

        Object.defineProperty(this, 'clear', {
            get: function() {
                return clear;
            }
        });

        function addItem(index, aLabel, aValue) {
            if (aValue !== null && index >= 0 && index <= box.options.length) {
                if (index === 0)
                    Logger.warning(i18n['null.item.index']);
                const item = document.createElement('option');
                item.innerText = aLabel;
                item['js-value'] = aValue;
                const wasUnselected = box.selectedIndex === -1;
                if (index === box.options.length) {
                    box.appendChild(item);
                    if (valuesIndicies)
                        valuesIndicies.set(aValue, index);
                } else {
                    box.insertBefore(itemAt(index), item);
                    invalidateValuesIndicies();
                }
                if (wasUnselected) {
                    box.selectedIndex = -1;
                }
            }
        }

        function removeItem(index) {
            if (index >= 0 && index < box.options.length) {
                const item = box.options[index];
                if (item !== nullItem) {
                    box.removeChild(item);
                    invalidateValuesIndicies();
                    return item;
                }
            }
        }

        function indexOfValue(aValue) {
            validateValuesIndicies();
            return valuesIndicies.get(aValue);
        }

        Object.defineProperty(this, 'indexOfValue', {
            get: function() {
                return indexOfValue;
            }
        });

    }
}

export default DropDownField;
