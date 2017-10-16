/* global expect */
/* global NaN */
import '../src/layout.css';
import '../src/theme.css';
import '../src/rich-text-area/layout.css';
import '../src/rich-text-area/theme.css';

import Logger from 'septima-utils/logger';
import Invoke from 'septima-utils/invoke';
import Font from 'kenga/font';
import Color from 'kenga/color';
import Cursor from 'kenga/cursor';
import Slider from '../src/slider';
import TextArea from '../src/text-area';
import UrlField from '../src/url-field';
import DateField from '../src/date-field';
import TextField from '../src/text-field';
import TimeField from '../src/time-field';
import ColorField from '../src/color-field';
import EMailField from '../src/email-field';
import MeterField from '../src/meter-field';
import PhoneField from '../src/phone-field';
import NumberField from '../src/number-field';
import RichTextArea from '../src/rich-text-area';
import PasswordField from '../src/password-field';
import ProgressField from '../src/progress-field';
import DateTimeField from '../src/date-time-field';
import DropDownField from '../src/drop-down-field';

describe('Fields Api', () => {

function expectValue(obj, prop, value) {
    obj[prop] = value;
    expect(obj[prop]).toEqual(value);
}

function expectWidget(widget) {
    expect('name' in widget).toBeTruthy();
    expectValue(widget, 'name', 'widgetName');
    expect('element' in widget).toBeTruthy();
    expect('parent' in widget).toBeTruthy();
    expectValue(widget, 'parent', new widget.constructor());
    expectValue(widget, 'parent', null);
    expect('left' in widget).toBeTruthy();
    expectValue(widget, 'left', 30);
    expect('width' in widget).toBeTruthy();
    expectValue(widget, 'width', 50);
    expect('top' in widget).toBeTruthy();
    expectValue(widget, 'top', 57);
    expect('height' in widget).toBeTruthy();
    expectValue(widget, 'height', 80);
    expect('enabled' in widget).toBeTruthy();
    expectValue(widget, 'enabled', true);
    expectValue(widget, 'enabled', false);
    expect('visible' in widget).toBeTruthy();
    expectValue(widget, 'visible', true);
    expectValue(widget, 'visible', false);
    expect('opaque' in widget).toBeTruthy();
    expectValue(widget, 'opaque', true);
    expectValue(widget, 'opaque', false);
    expect('cursor' in widget).toBeTruthy();
    expectValue(widget, 'cursor', Cursor.WAIT);
    expect('background' in widget).toBeTruthy();
    expectValue(widget, 'background', new Color('#fcfcfc'));
    expect('foreground' in widget).toBeTruthy();
    expectValue(widget, 'foreground', new Color(12, 45, 78, 35));
    expect('error' in widget).toBeTruthy();
    expectValue(widget, 'error', 'sample validation message');
    widget.error = null;
    expect('contextMenu' in widget).toBeTruthy();
    expectValue(widget, 'contextMenu', new widget.constructor());
    expect('toolTipText' in widget).toBeTruthy();
    expectValue(widget, 'toolTipText', ' sample tooltip');
    expect('focusable' in widget).toBeTruthy();
    expectValue(widget, 'focusable', true);
    expectValue(widget, 'focusable', false);
    expect('font' in widget).toBeDefined();
    expectValue(widget, 'font', new Font('Arial', Font.Style.ITALIC, 14));
    expect(widget.focus).toBeDefined();
    expect(typeof widget.focus).toEqual('function');
    widget.focus();

    expect('onShow' in widget).toBeTruthy();
    expectValue(widget, 'onShow', () => {});
    expect('onHide' in widget).toBeTruthy();
    expectValue(widget, 'onHide', () => {});
    expect('onMouseRelease' in widget).toBeTruthy();
    expectValue(widget, 'onMouseRelease', () => {});
    expect('onFocusLost' in widget).toBeTruthy();
    expectValue(widget, 'onFocusLost', () => {});
    expect('onMousePress' in widget).toBeTruthy();
    expectValue(widget, 'onMousePress', () => {});
    expect('onMouseEnter' in widget).toBeTruthy();
    expectValue(widget, 'onMouseEnter', () => {});
    expect('onMouseMove' in widget).toBeTruthy();
    expectValue(widget, 'onMouseMove', () => {});
    expect('onAction' in widget).toBeTruthy();
    expectValue(widget, 'onAction', () => {});
    expect('onKeyRelease' in widget).toBeTruthy();
    expectValue(widget, 'onKeyRelease', () => {});
    expect('onKeyType' in widget).toBeTruthy();
    expectValue(widget, 'onKeyType', () => {});
    expect('onMouseWheelMove' in widget).toBeTruthy();
    expectValue(widget, 'onMouseWheelMove', () => {});
    expect('onFocus' in widget).toBeTruthy();
    expectValue(widget, 'onFocus', () => {});
    expect('onMouseClick' in widget).toBeTruthy();
    expectValue(widget, 'onMouseClick', () => {});
    expect('onMouseExit' in widget).toBeTruthy();
    expectValue(widget, 'onMouseExit', () => {});
    expect('onKeyPress' in widget).toBeTruthy();
    expectValue(widget, 'onKeyPress', () => {});
}
    function expectTypedField(TypedField) {
        const instance = new TypedField();
        expect(instance.element.type).not.toEqual('');
        expectWidget(instance);
    }

    function expectTypedFieldMarkup(Logger, TypedField) {
        const instance = new TypedField();
        document.body.appendChild(instance.element);
        expect(instance.element.type).not.toEqual('');
        instance.onAction = evt => {
            Logger.info(`Action performed on ${evt.source.constructor.name}`);
        };
        instance.onValueChange = evt => {
            Logger.info(`Value change on ${evt.source.constructor.name}. newValue: ${evt.newValue}; oldValue: ${evt.oldValue}`);
        };
        if (instance.error)
            instance.error = null;
        document.body.removeChild(instance.element);
    }

    it('TextField.Structure.1', () => {
        const textField1 = new TextField();
        expect(textField1.text).toEqual('');
        const textField2 = new TextField('Sample text');
        expect(textField2.text).toEqual('Sample text');
    });
    
    it('TextField.Structure.2', () => {
        expectTypedField(TextField);
        const instance = new TextField();
        expect(instance.text).toEqual('');
        expect(instance.value).toBeNull();

        instance.text = 'sample text';
        expect(instance.value).toEqual('sample text');
        instance.text = '';
        expect(instance.value).toBeNull();
        instance.value = 'another sample text';
        expect(instance.text).toEqual('another sample text');
        instance.value = null;
        expect(instance.text).toEqual('');
    });
    
    it('TextField.Markup.1', done => {
        const textField = new TextField();
        document.body.appendChild(textField.element);
        textField.text = 'Sample text';
        textField.onAction = () => {
            Logger.info('TextField action');
        };
        textField.onValueChange = evt => {
            Logger.info(`TextField value changed: newValue: ${evt.newValue}; oldValue: ${evt.oldValue}`);
        };

        spyOn(textField, 'onValueChange');

        textField.text += ' 1';
        textField.text += ' 2';
        textField.text += ' 3';

        Invoke.later(() => {
            expect(textField.onValueChange.calls.count()).toEqual(3);
            document.body.removeChild(textField.element);
            done();
        });
    });
    
    it('TextField.Markup.2', () => {
        expectTypedFieldMarkup(Logger, TextField);
    });

    it('ColorField.Structure', () => {
        expectTypedField(ColorField);
        const instance = new ColorField();
        expect(instance.text).toEqual('#000000');
        instance.text = '#fcfcfc';
        expect(instance.text).toEqual('#fcfcfc');
        expect(instance.value instanceof Color).toBe(true);
        expect(instance.value.toString()).toEqual('#fcfcfc');

        instance.text = '';
        expect(instance.text).toEqual('#000000');
        expect(instance.value.toString()).toBe('#000000');

        instance.value = Color.blue;
        expect(instance.value).toBe(Color.blue);
        expect(instance.text).toEqual('#0000ff');

        instance.value = null;
        expect(instance.value).toBe(null);
        expect(instance.text).toEqual('#000000');
    });
    it('ColorField.Markup', () => {
        expectTypedFieldMarkup(Logger, ColorField);
    });
    it('DateField.Structure', () => {
        expectTypedField(DateField);
        const instance = new DateField();
        expect(instance.text).toEqual('');
        expect(instance.value).toBe(null);

        const day = new Date('2017-04-23T00:00:00.000Z');
        instance.text = '2017-04-23';
        expect(instance.value instanceof Date).toBe(true);
        expect(instance.value.valueOf()).toEqual(day.valueOf());

        instance.text = '';
        expect(instance.value).toBeNull();

        instance.value = day;
        expect(instance.text).toEqual('2017-04-23');

        instance.value = null;
        expect(instance.text).toEqual('');
    });
    it('DateField.Markup', () => {
        expectTypedFieldMarkup(Logger, DateField);
    });
    it('DateTimeField.Structure', () => {
        expectTypedField(DateTimeField);

        const instance = new DateTimeField();
        expect(instance.text).toEqual('');
        expect(instance.value).toBe(null);

        const moment = new Date('2017-04-23T01:07:00.068Z');
        let localMoment = new Date(-moment.getTimezoneOffset() * 60000 + moment.valueOf()).toJSON(); // local version of moment
        localMoment = localMoment.substring(0, localMoment.length - 1);
        instance.text = localMoment;
        expect(instance.value instanceof Date).toBe(true);
        expect(instance.value.valueOf()).toEqual(moment.valueOf());

        instance.text = '';
        expect(instance.value).toBeNull();

        instance.value = moment;
        expect(instance.text).toEqual(localMoment);

        instance.value = null;
        expect(instance.text).toEqual('');
    });
    it('DateTimeField.Markup', () => {
        expectTypedFieldMarkup(Logger, DateTimeField);
        const instance = new DateTimeField();
    });
    it('TimeField.Structure', () => {
        expectTypedField(TimeField);
        const instance = new TimeField();
        expect(instance.text).toEqual('');
        expect(instance.value).toBe(null);

        instance.text = '13:45';
        expect(typeof instance.value).toEqual('number');
        expect(instance.value).toEqual(13 * 3600 * 1000 + 45 * 60 * 1000);

        instance.text = '';
        expect(instance.value).toBeNull();

        instance.value = 13 * 3600 * 1000 + 45 * 60 * 1000;
        expect(instance.text).toEqual('13:45:00.000');

        instance.value = null;
        expect(instance.text).toEqual('');
    });
    it('TimeField.Markup', () => {
        expectTypedFieldMarkup(Logger, TimeField);
    });
    it('TextArea.Structure', () => {
        expectTypedField(TextArea);
        const instance = new TextArea();
        expect(instance.text).toEqual('');
        expect(instance.value).toBeNull();

        instance.text = 'sample text';
        expect(instance.value).toEqual('sample text');
        instance.text = '';
        expect(instance.value).toBeNull();
        instance.value = 'another sample text';
        expect(instance.text).toEqual('another sample text');
        instance.value = null;
        expect(instance.text).toEqual('');
    });
    it('TextArea.Markup', () => {
        expectTypedFieldMarkup(Logger, TextArea);
    });
    it('EMailField.Structure', () => {
        expectTypedField(EMailField);
        const instance = new EMailField();
        expect(instance.text).toEqual('');
        expect(instance.value).toBeNull();

        instance.text = 'fd@mk.com';
        expect(instance.value).toEqual('fd@mk.com');
        instance.text = '';
        expect(instance.value).toBeNull();
        instance.value = 'dd@rf.nl';
        expect(instance.text).toEqual('dd@rf.nl');
        instance.value = null;
        expect(instance.text).toEqual('');
    });
    it('EMailField.Markup', () => {
        expectTypedFieldMarkup(Logger, EMailField);
    });
    it('PasswordField.Structure', () => {
        expectTypedField(PasswordField);
        const instance = new PasswordField();
        expect(instance.text).toEqual('');
        expect(instance.value).toBeNull();

        instance.text = 'fd-mk.com';
        expect(instance.value).toEqual('fd-mk.com');
        instance.text = '';
        expect(instance.value).toBeNull();
        instance.value = 'dd-rf.nl';
        expect(instance.text).toEqual('dd-rf.nl');
        instance.value = null;
        expect(instance.text).toEqual('');
    });
    it('PasswordField.Markup', () => {
        expectTypedFieldMarkup(Logger, PasswordField);
    });
    it('PhoneField.Structure', () => {
        expectTypedField(PhoneField);
        const instance = new PhoneField();
        expect(instance.text).toEqual('');
        expect(instance.value).toBeNull();

        instance.text = '+5 907 143 26 78';
        expect(instance.value).toEqual('+5 907 143 26 78');
        instance.text = '';
        expect(instance.value).toBeNull();
        instance.value = '+5 907 143 26 55';
        expect(instance.text).toEqual('+5 907 143 26 55');
        instance.value = null;
        expect(instance.text).toEqual('');
    });
    it('PhoneField.Markup', () => {
        expectTypedFieldMarkup(Logger, PhoneField);
    });
    it('UrlField.Structure', () => {
        expectTypedField(UrlField);
        const instance = new UrlField();
        expect(instance.text).toEqual('');
        expect(instance.value).toBeNull();

        instance.text = 'udp://host.nl/path';
        expect(instance.value).toEqual('udp://host.nl/path');
        instance.text = '';
        expect(instance.value).toBeNull();
        instance.value = 'udp://host.nl/path1';
        expect(instance.text).toEqual('udp://host.nl/path1');
        instance.value = null;
        expect(instance.text).toEqual('');
    });
    it('UrlField.Markup', () => {
        expectTypedFieldMarkup(Logger, UrlField);
    });
    it('NumberField.Structure', () => {
        expectTypedField(NumberField);
        const instance = new NumberField();
        expect(instance.text).toEqual('');
        expect(instance.value).toBeNull();

        instance.text = '09';
        expect(instance.value).toEqual(9);
        instance.text = '';
        expect(instance.value).toBeNull();
        instance.value = 67;
        expect(instance.text).toEqual('67');
        instance.step = 100;
        expect(instance.step).toEqual(100);
        instance.minimum = -100;
        expect(instance.minimum).toEqual(-100);
        instance.maximum = 100;
        expect(instance.maximum).toEqual(100);
        instance.value = -200;
        expect(instance.value).toEqual(-200); // value is assignable regardless of constraints
        instance.text = 'hh';
        expect(instance.text).toEqual('-200');
        expect(instance.value).toEqual(-200);
        instance.value = NaN;
        expect(instance.text).toEqual('-200');
        expect(instance.value).toEqual(-200);
        instance.value = null;
        expect(instance.text).toEqual('');
        if (instance.error)
            instance.error = null;
    });
    it('NumberField.Markup', () => {
        expectTypedFieldMarkup(Logger, NumberField);
    });
    it('Slider.Structure', () => {
        expectTypedField(Slider);
        const instance = new Slider();
        expect(instance.text).toEqual('');
        expect(instance.value).toBeNull();

        instance.text = '09';
        expect(instance.value).toEqual(9);
        instance.text = '';
        expect(instance.value).toBeNull();
        instance.value = 67;
        expect(instance.text).toEqual('67');
        instance.step = 100;
        expect(instance.step).toEqual(100);
        instance.minimum = -100;
        expect(instance.minimum).toEqual(-100);
        instance.maximum = 100;
        expect(instance.maximum).toEqual(100);
        instance.value = -200;
        expect(instance.value).toEqual(-200); // value is assignable regardless of constraints
        instance.text = 'hh';
        expect(instance.text).toEqual('-200');
        expect(instance.value).toEqual(-200);
        instance.value = NaN;
        expect(instance.text).toEqual('-200');
        expect(instance.value).toEqual(-200);
        instance.value = null;
        expect(instance.text).toEqual('');
        if (instance.error)
            instance.error = null;
    });
    it('Slider.Markup', () => {
        expectTypedFieldMarkup(Logger, Slider);
    });
    it('ProgressField.Structure', () => {
        expectTypedField(ProgressField);
        const instance = new ProgressField();
        expect(instance.text).toEqual('');
        expect(instance.value).toBeNull();

        instance.text = '09';
        expect(instance.value).toEqual(9);
        instance.text = '';
        expect(instance.value).toBeNull();
        instance.text = '9.56';
        expect(instance.value).toEqual(9.56);
        instance.text = '';
        expect(instance.value).toBeNull();

        instance.value = 78;
        expect(instance.text).toEqual('78');
        instance.value = null;
        expect(instance.text).toEqual('');
        instance.value = 56;
        expect(instance.text).toEqual('56');
        instance.text = 'hh';
        expect(instance.text).toEqual('56');
        expect(instance.value).toEqual(56);
        instance.value = NaN;
        expect(instance.text).toEqual('56');
        expect(instance.value).toEqual(56);
        instance.value = null;
        expect(instance.text).toEqual('');
        if (instance.error)
            instance.error = null;
    });
    it('ProgressField.Markup', () => {
        expectTypedFieldMarkup(Logger, ProgressField);
    });
    it('MeterField.Structure', () => {
        expectTypedField(MeterField);
        const instance = new MeterField();
        expect(instance.text).toEqual('');
        expect(instance.value).toBeNull();

        instance.text = '09';
        expect(instance.value).toEqual(9);
        instance.text = '';
        expect(instance.value).toBeNull();
        instance.text = '9.56';
        expect(instance.value).toEqual(9.56);
        instance.text = '';
        expect(instance.value).toBeNull();

        instance.value = 78;
        expect(instance.text).toEqual('78');
        instance.value = null;
        expect(instance.text).toEqual('');
        instance.value = 56;
        expect(instance.text).toEqual('56');
        instance.text = 'hh';
        expect(instance.text).toEqual('56');
        expect(instance.value).toEqual(56);
        instance.value = NaN;
        expect(instance.text).toEqual('56');
        expect(instance.value).toEqual(56);
        instance.value = null;
        expect(instance.text).toEqual('');
        if (instance.error)
            instance.error = null;
    });
    it('MeterField.Markup', () => {
        expectTypedFieldMarkup(Logger, MeterField);
    });
    it('DropDownField.Structure', () => {
        expectWidget(new DropDownField());

        const instance = new DropDownField();
        expect(instance.value).toBeNull();
        expect(instance.text).toEqual('< . >');
        expect(instance.count).toEqual(1);

        instance.visibleItemCount = 4;
        expect(instance.visibleItemCount).toEqual(4);

        instance.addValue('1', 1);
        instance.addValue('2', 2);
        instance.addValue('3', 3);
        instance.addValue('4', 4);
        instance.addValue('5', 5);
        expect(instance.count).toEqual(6);
        expect(instance.labelAt(4)).toEqual('4');

        instance.updateLabel(4, '44');
        expect(instance.count).toEqual(6);
        expect(instance.labelAt(4)).toEqual('44');

        for (let i = 1; i < instance.count; i++) {
            expect(instance.valueAt(i)).toEqual(i);
            expect(instance.indexOfValue(i)).toEqual(i);
        }

        for (let d = instance.count - 1; d >= 0; d--) {
            instance.removeValue(d);
        }
        expect(instance.count).toEqual(1);
        expect(instance.valueAt(0)).toBeNull();
        expect(instance.value).toBeNull();
        expect(instance.labelAt(0)).toEqual('< . >');
        expect(instance.text).toEqual('< . >');

        instance.emptyText = 'Select an item please';
        expect(instance.text).toEqual('Select an item please');
        expect(instance.labelAt(0)).toEqual('Select an item please');

        instance.addValue('1', 1);
        instance.addValue('2', 2);
        instance.addValue('3', 3);
        instance.addValue('4', 4);
        instance.addValue('5', 5);
        expect(instance.count).toEqual(6);

        instance.clear();
        expect(instance.count).toEqual(1);
        expect(instance.valueAt(0)).toBeNull();
        expect(instance.value).toBeNull();
        expect(instance.labelAt(0)).toEqual('Select an item please');
        expect(instance.text).toEqual('Select an item please');
    });
    it('DropDownField.Markup', () => {
        const instance = new DropDownField();
        document.body.appendChild(instance.element);
        instance.addValue('1', 1);
        instance.addValue('2', 2);
        instance.addValue('3', 3);
        instance.addValue('4', 4);
        instance.addValue('5', 5);
        instance.addValue('6', 6);
        instance.addValue('7', 7);
        instance.addValue('8', 8);
        instance.addValue('9', 9);
        instance.addValue('10', 10);

        instance.emptyText = 'Select an item please';
        expect(instance.text).toEqual('Select an item please');
        instance.onAction = () => {
            Logger.info(`Action performed on ${instance.constructor.name}`);
        };
        instance.onSelect = evt => {
            Logger.info(`Item selected on ${instance.constructor.name}; item: ${evt.item}`);
        };
        instance.onValueChange = evt => {
            Logger.info(`${instance.constructor.name} value changed: newValue: ${evt.newValue}; oldValue: ${evt.oldValue}`);
        };
        document.body.removeChild(instance.element);
    });
    it('RichTextArea.Structure', () => {
        expectWidget(new RichTextArea());

        const instance = new RichTextArea();
        expect(instance.value).toBeNull();
        expect(instance.text).toEqual('');

        instance.value = '<p>content</p>';
        expect(instance.text).toEqual('content');

        instance.value = null;
        expect(instance.text).toEqual('');

        instance.text = '<p>content</p>';
        expect(instance.value).toEqual('&lt;p&gt;content&lt;/p&gt;');

        instance.text = '';
        expect(instance.value).toBeNull();
    });
    it('RichTextArea.Markup', done => {
        const instance = new RichTextArea();
        document.body.appendChild(instance.element);

        instance.onAction = () => {
            Logger.info(`Action performed on ${instance.constructor.name}`);
        };
        instance.onValueChange = evt => {
            Logger.info(`${instance.constructor.name} value changed: newValue: ${evt.newValue}; oldValue: ${evt.oldValue}`);
        };

        spyOn(instance, 'onValueChange');

        instance.value = 'Sample content';

        Invoke.later(() => {
            expect(instance.onValueChange.calls.count()).toEqual(1);
            document.body.removeChild(instance.element);
            done();
        });
    });
});
