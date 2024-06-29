import BoxField from 'kenga/box-field'
import HasValue from 'kenga/has-value'

export default class TextField extends BoxField implements HasValue {
  constructor(text?: string, box?: HTMLElement, shell?: HTMLElement)
  value: string
  text: string
  textChanged(): void
}
