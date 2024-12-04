import BoxField from 'kenga/box-field'
import ItemEvent from 'kenga/events/item-event'
import HasValue from 'kenga/has-value'

export default class LookupField extends BoxField implements HasValue {
  constructor(shell?: HTMLElement)
  
  emptyText: string

  value: any
  text: string
  textChanged(): void

  selectedIndex: number
  count: number
  lookupHeight: string

  showLookup(clearText = false): void
  hideLookup(): void
  onShowLookup: () => void;
  onHideLookup: () => void;
  addValue(aLabel: string, aValue: any): void
  insertValue(insertAt: number, aLabel: string, aValue: any): void
  updateLabel(aValue: any, aLabel: string): void
  valueAt(index: number): any
  labelAt(index: number): string
  removeValue(aValue: any): boolean
  clear(): void
  indexOfValue(aValue: any): number
}
