import Widget from 'kenga/widget'
import ValueChangeEvent from 'kenga/events/value-change-event'
import HasValue from 'kenga/has-value'

export default class RichTextArea extends Widget implements HasValue {
  value: string
  fireValueChanged(): void
  addValueChangeHandler(handler: (evt: ValueChangeEvent) => void): { removeHandler: () => void }
  text: string
}
