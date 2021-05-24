# DatoCMS Theme Selector

A plugin for DatoCMS that allows you select a color from a predefined list. The
normal `color` field opens a color picker, but doesn't enforce a fixed set of
colors.

![Example](docs/example.png)

## Configuration

Make sure you apply the plugin on a color field, and fill out the preset color
list. You can define a default set of colors globally, and override them on an
instance. Use the global option if you have default set of values you should be
able to select from.

### Development

When testing the plugin locally, you should configure a new plugin in a DatoCMS
project, and point it to `http://localhost:3000`.
