# kenga-fields
Kenga input widgets with **JavaScript typed** values. You can find almost all HTML5 input widgets here.
They all have `value` property and fire value change events.

# Install
To install `kenga-fields` package to your project, type the following command:
`npm install kenga-fields --save`

# Using
To use data binding of these widgets, you can write something like this
`const em = new EMailField(); em.onValueCange = (event) => {...}`.

# Architecture
These widgets have decorations, that allow a user to clear a widget's value and select a value with custom value selection dialog.
See `kenga/decorator` module to lear about value clear and value select.
Also, these widgets have `value` property, fire value change events.
