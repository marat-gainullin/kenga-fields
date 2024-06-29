import BoxField from 'kenga/box-field'
import HasValue from 'kenga/has-value'

export default class DateField extends BoxField implements HasValue {
  constructor(shell?: HTMLElement)
  
  checkValidity: () => boolean

  value: Date
  text: string
  textChanged(): void
}
