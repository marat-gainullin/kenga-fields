import BoxField from 'kenga/box-field'

export default class ConstraintField extends BoxField {
  constructor(box?: HTMLElement, shell?: HTMLElement)
  
  minimum: number
  maximum: number
  step: number
}
