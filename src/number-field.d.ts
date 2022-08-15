import HasValue from 'kenga/has-value'
import ConstraintField from './constraint-field'

export default class NumberField extends ConstraintField implements HasValue {
  value: number
  text: string
  textChanged(): void

  checkValidity: () => boolean
}
