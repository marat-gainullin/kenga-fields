import HasValue from 'kenga/has-value'
import ConstraintField from './constraint-field'

export default class ProgressField extends ConstraintField implements HasValue {
  constructor(box?: HTMLElement, shell?: HTMLElement)
  
  value: number
  text: string
  textChanged(): void
}
