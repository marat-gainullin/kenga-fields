import Widget from 'kenga/widget'
import HasValue from 'kenga/has-value'

export default class Slider extends Widget implements HasValue {
  constructor(shell?: HTMLElement)
  minimum: number
  maximum: number
  step: number
  ticksStep: number
  continuousValueChange: boolean
  value: number

  addFocusHandler(handler: (evt: FocusEvent) => void): { removeHandler: () => void };
  addFocusLostHandler(handler: (evt: BlurEvent) => void): { removeHandler: () => void };

  addKeyTypeHandler(handler: (evt: KeyEvent) => void): { removeHandler: () => void };
  addKeyPressHandler(handler: (evt: KeyEvent) => void): { removeHandler: () => void };
  addKeyReleaseHandler(handler: (evt: KeyEvent) => void): { removeHandler: () => void };

  fireValueChanged(oldValue: any): void;
  addValueChangeHandler(handler: (evt: ValueChangeEvent) => void): { removeHandler: () => void };
}
