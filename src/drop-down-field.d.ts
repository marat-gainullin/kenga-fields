import BoxField from 'kenga/box-field'
import ItemEvent from 'kenga/events/item-event'
import HasValue from 'kenga/has-value'

export default class DropDownField extends BoxField implements HasValue {
  emptyText: string

  value: any
  text: string
  textChanged(): void

  addSelectHandler(handler: (evt: ItemEvent) => void): { removeHandler: () => void }

  selectedIndex: number
  count: number
  visibleItemCount: number

  addValue(aLabel: string, aValue: any): void
  insertValue(insertAt: number, aLabel: string, aValue: any): void
  updateLabel(aValue: any, aLabel: string): void
  valueAt(index: number): any
  labelAt(index: number): string
  removeValue(aValue: any): boolean
  clear(): void
  indexOfValue(aValue: any): number
}
