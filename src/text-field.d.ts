import BoxField from 'kenga/box-field'
import HasValue from 'kenga/has-value'

export default class TextField extends BoxField implements HasValue {
  value: string
  text: string
  textChanged(): void
}
