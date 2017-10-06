/* global expect */
/* global NaN */

describe('Fields Api', function () {

    it('TextField.Structure', function (done) {
        require([
            'forms/fields/text-field'], function (
                TextField) {
            var textField1 = new TextField();
            expect(textField1.text).toEqual('');
            var textField2 = new TextField('Sample text');
            expect(textField2.text).toEqual('Sample text');
            done();
        });
    });
    it('TextField.Markup', function (done) {
        require([
            'core/invoke',
            'core/logger',
            'forms/fields/text-field'], function (
                Invoke,
                Logger,
                TextField) {
            var textField = new TextField();
            document.body.appendChild(textField.element);
            textField.text = 'Sample text';
            textField.onActionPerformed = function () {
                Logger.info('TextField action');
            };
            textField.onValueChange = function (evt) {
                Logger.info('TextField value changed: newValue: ' + evt.newValue + '; oldValue: ' + evt.oldValue);
            };

            spyOn(textField, 'onValueChange');

            textField.text += ' 1';
            textField.text += ' 2';
            textField.text += ' 3';

            Invoke.later(function () {
                expect(textField.onValueChange.calls.count()).toEqual(3);
                document.body.removeChild(textField.element);
                done();
            });
        });
    });

    function expectTypedField(TypedField, Font, Color, Cursor) {
        var instance = new TypedField();
        expect(instance.element.type).not.toEqual('');
        expectWidget(instance, Font, Color, Cursor);
    }

    function expectTypedFieldMarkup(Logger, TypedField) {
        var instance = new TypedField();
        document.body.appendChild(instance.element);
        expect(instance.element.type).not.toEqual('');
        instance.onActionPerformed = function (evt) {
            Logger.info('Action performed on ' + evt.source.constructor.name);
        };
        instance.onValueChange = function (evt) {
            Logger.info('Value change on ' + evt.source.constructor.name + '. newValue: ' + evt.newValue + '; oldValue: ' + evt.oldValue);
        };
        if (instance.error)
            instance.error = null;
        document.body.removeChild(instance.element);
    }

    it('ColorField.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/color-field'], function (
                Font,
                Color,
                Cursor,
                ColorField) {
            expectTypedField(ColorField, Font, Color, Cursor);
            var instance = new ColorField();
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

            done();
        });
    });
    it('ColorField.Markup', function (done) {
        require([
            'ui/color',
            'core/logger',
            'forms/fields/color-field'], function (
                Color,
                Logger,
                ColorField) {
            expectTypedFieldMarkup(Logger, ColorField);
            done();
        });
    });
    it('DateField.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/date-field'], function (
                Font,
                Color,
                Cursor,
                DateField) {
            expectTypedField(DateField, Font, Color, Cursor);
            var instance = new DateField();
            expect(instance.text).toEqual('');
            expect(instance.value).toBe(null);

            var day = new Date('2017-04-23T00:00:00.000Z');
            instance.text = '2017-04-23';
            expect(instance.value instanceof Date).toBe(true);
            expect(instance.value.valueOf()).toEqual(day.valueOf());

            instance.text = '';
            expect(instance.value).toBeNull();

            instance.value = day;
            expect(instance.text).toEqual('2017-04-23');

            instance.value = null;
            expect(instance.text).toEqual('');

            done();
        });
    });
    it('DateField.Markup', function (done) {
        require([
            'core/logger',
            'forms/fields/date-field'], function (
                Logger,
                DateField) {
            expectTypedFieldMarkup(Logger, DateField);
            done();
        });
    });
    it('DateTimeField.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/date-time-field'], function (
                Font,
                Color,
                Cursor,
                DateTimeField) {
            expectTypedField(DateTimeField, Font, Color, Cursor);

            var instance = new DateTimeField();
            expect(instance.text).toEqual('');
            expect(instance.value).toBe(null);

            var moment = new Date('2017-04-23T01:07:00.068Z');
            var localMoment = new Date(-moment.getTimezoneOffset() * 60000 + moment.valueOf()).toJSON(); // local version of moment
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

            done();
        });
    });
    it('DateTimeField.Markup', function (done) {
        require([
            'core/logger',
            'forms/fields/date-time-field'], function (
                Logger,
                DateTimeField) {
            expectTypedFieldMarkup(Logger, DateTimeField);
            var instance = new DateTimeField();
            done();
        });
    });
    it('TimeField.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/time-field'], function (
                Font,
                Color,
                Cursor,
                TimeField) {
            expectTypedField(TimeField, Font, Color, Cursor);
            var instance = new TimeField();
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

            done();
        });
    });
    it('TimeField.Markup', function (done) {
        require([
            'core/logger',
            'forms/fields/time-field'], function (
                Logger,
                TimeField) {
            expectTypedFieldMarkup(Logger, TimeField);
            done();
        });
    });
    it('TextField.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/text-field'], function (
                Font,
                Color,
                Cursor,
                TextField) {
            expectTypedField(TextField, Font, Color, Cursor);
            var instance = new TextField();
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

            done();
        });
    });
    it('TextField.Markup', function (done) {
        require([
            'core/logger',
            'forms/fields/text-field'], function (
                Logger,
                TextField) {
            expectTypedFieldMarkup(Logger, TextField);
            done();
        });
    });
    it('TextArea.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/text-area'], function (
                Font,
                Color,
                Cursor,
                TextArea) {
            expectTypedField(TextArea, Font, Color, Cursor);
            var instance = new TextArea();
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

            done();
        });
    });
    it('TextArea.Markup', function (done) {
        require([
            'core/logger',
            'forms/fields/text-area'], function (
                Logger,
                TextArea) {
            expectTypedFieldMarkup(Logger, TextArea);
            done();
        });
    });
    it('EMailField.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/email-field'], function (
                Font,
                Color,
                Cursor,
                EMailField) {
            expectTypedField(EMailField, Font, Color, Cursor);
            var instance = new EMailField();
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

            done();
        });
    });
    it('EMailField.Markup', function (done) {
        require([
            'core/logger',
            'forms/fields/email-field'], function (
                Logger,
                EMailField) {
            expectTypedFieldMarkup(Logger, EMailField);
            done();
        });
    });
    it('PasswordField.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/password-field'], function (
                Font,
                Color,
                Cursor,
                PasswordField) {
            expectTypedField(PasswordField, Font, Color, Cursor);
            var instance = new PasswordField();
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

            done();
        });
    });
    it('PasswordField.Markup', function (done) {
        require([
            'core/logger',
            'forms/fields/password-field'], function (
                Logger,
                PasswordField) {
            expectTypedFieldMarkup(Logger, PasswordField);
            done();
        });
    });
    it('PhoneField.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/phone-field'], function (
                Font,
                Color,
                Cursor,
                PhoneField) {
            expectTypedField(PhoneField, Font, Color, Cursor);
            var instance = new PhoneField();
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

            done();
        });
    });
    it('PhoneField.Markup', function (done) {
        require([
            'core/logger',
            'forms/fields/phone-field'], function (
                Logger,
                PhoneField) {
            expectTypedFieldMarkup(Logger, PhoneField);
            done();
        });
    });
    it('UrlField.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/url-field'], function (
                Font,
                Color,
                Cursor,
                UrlField) {
            expectTypedField(UrlField, Font, Color, Cursor);
            var instance = new UrlField();
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

            done();
        });
    });
    it('UrlField.Markup', function (done) {
        require([
            'core/logger',
            'forms/fields/url-field'], function (
                Logger,
                UrlField) {
            expectTypedFieldMarkup(Logger, UrlField);
            done();
        });
    });
    it('NumberField.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/number-field'], function (
                Font,
                Color,
                Cursor,
                NumberField) {
            expectTypedField(NumberField, Font, Color, Cursor);
            var instance = new NumberField();
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

            done();
        });
    });
    it('NumberField.Markup', function (done) {
        require([
            'core/logger',
            'forms/fields/number-field'], function (
                Logger,
                NumberField) {
            expectTypedFieldMarkup(Logger, NumberField);
            done();
        });
    });
    it('Slider.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/slider'], function (
                Font,
                Color,
                Cursor,
                Slider) {
            expectTypedField(Slider, Font, Color, Cursor);
            var instance = new Slider();
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

            done();
        });
    });
    it('Slider.Markup', function (done) {
        require([
            'core/logger',
            'forms/fields/slider'], function (
                Logger,
                Slider) {
            expectTypedFieldMarkup(Logger, Slider);
            done();
        });
    });
    it('ProgressField.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/progress-field'], function (
                Font,
                Color,
                Cursor,
                ProgressField) {
            expectTypedField(ProgressField, Font, Color, Cursor);
            var instance = new ProgressField();
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

            done();
        });
    });
    it('ProgressField.Markup', function (done) {
        require([
            'core/logger',
            'forms/fields/progress-field'], function (
                Logger,
                ProgressField) {
            expectTypedFieldMarkup(Logger, ProgressField);
            done();
        });
    });
    it('MeterField.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/meter-field'], function (
                Font,
                Color,
                Cursor,
                MeterField) {
            expectTypedField(MeterField, Font, Color, Cursor);
            var instance = new MeterField();
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

            done();
        });
    });
    it('MeterField.Markup', function (done) {
        require([
            'core/logger',
            'forms/fields/meter-field'], function (
                Logger,
                MeterField) {
            expectTypedFieldMarkup(Logger, MeterField);
            done();
        });
    });
    it('DropDownField.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/drop-down-field'], function (
                Font,
                Color,
                Cursor,
                DropDownField) {
            expectWidget(new DropDownField(), Font, Color, Cursor);

            var instance = new DropDownField();
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

            for (var i = 1; i < instance.count; i++) {
                expect(instance.valueAt(i)).toEqual(i);
                expect(instance.indexOfValue(i)).toEqual(i);
            }

            for (i = instance.count - 1; i >= 0; i--) {
                instance.removeValue(i);
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
            done();
        });
    });
    it('DropDownField.Markup', function (done) {
        require([
            'core/logger',
            'forms/fields/drop-down-field'], function (
                Logger,
                DropDownField) {
            var instance = new DropDownField();
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
            instance.onActionPerformed = function () {
                Logger.info('Action performed on ' + instance.constructor.name);
            };
            instance.onItemSelected = function (evt) {
                Logger.info('Item selected on ' + instance.constructor.name + '; item: ' + evt.item);
            };
            instance.onValueChange = function (evt) {
                Logger.info(instance.constructor.name + ' value changed: newValue: ' + evt.newValue + '; oldValue: ' + evt.oldValue);
            };
            document.body.removeChild(instance.element);
            done();
        });
    });
    it('RichTextArea.Structure', function (done) {
        require([
            'ui/font',
            'ui/color',
            'ui/cursor',
            'forms/fields/rich-text-area'], function (
                Font,
                Color,
                Cursor,
                RichTextArea) {
            expectWidget(new RichTextArea(), Font, Color, Cursor);

            var instance = new RichTextArea();
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

            done();
        });
    });
    it('RichTextArea.Markup', function (done) {
        require([
            'core/invoke',
            'core/logger',
            'forms/fields/rich-text-area'], function (
                Invoke,
                Logger,
                RichTextArea) {
            var instance = new RichTextArea();
            document.body.appendChild(instance.element);

            instance.onActionPerformed = function () {
                Logger.info('Action performed on ' + instance.constructor.name);
            };
            instance.onValueChange = function (evt) {
                Logger.info(instance.constructor.name + ' value changed: newValue: ' + evt.newValue + '; oldValue: ' + evt.oldValue);
            };

            spyOn(instance, 'onValueChange');

            instance.value = 'Sample content';

            Invoke.later(function () {
                expect(instance.onValueChange.calls.count()).toEqual(1);
                document.body.removeChild(instance.element);
                done();
            });
        });
    });
});
