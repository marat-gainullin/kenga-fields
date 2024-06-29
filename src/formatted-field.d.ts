import BoxField from 'kenga/box-field'
import HasValue from 'kenga/has-value'

export default class FormattedField extends BoxField implements HasValue {
  constructor(shell?: HTMLElement)
  
  value: string
  text: string
  textChanged(): void
}
