import ProgressField from './progress-field'

export default class MeterField extends ProgressField {
  constructor(shell?: HTMLElement)
  
  low: number
  high: number
  optimum: number
}
