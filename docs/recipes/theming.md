# Theming

**Theming** is the process of adding your own color scheme to add style to an existing design.

The [Material Design](https://material.io/guidelines/material-design/introduction.html) specification doesn't specify a single color scheme. Instead it uses the concept of color **themes** to allow designers some flexibility in their choice of colors.

A theme is a palette based around two main colors: the **primary** color (used widely throughout the app) and the **accent** color (used mainly for highlighting and calling out specific UI elements).

Each shade is related to a particular purpose or set of purposes within the app. So for example, the shade that works best for text isn't necessarily the same shade you would use for flat areas of color. Material Design provides a number of [standard themes](https://material.io/guidelines/style/color.html#color-themes)
with shades that are carefully chosen for each purpose within the UI. The CSS files are designed so that the names are consistent between themes (so the same "purpose" will always have the same class name across CSS files). This makes it easy to switch themes simply by changing a few CSS definitions. Material Design also defines the relationship between the different shades, so you can calculate your own color values.

See the [Material Design Style page](https://material.io/guidelines/style/color.html#) for more information about color concepts.

## Contents
- [Defining a custom theme](#defining-a-custom-theme)
    - [Multiple themes](#multiple-themes)
- [How to create reusable colors/variables?](#how-to-create-reusable-colorsvariables)

## Defining a custom theme

When you want more customization than a pre-built theme offers, you can create your own theme file or customize the one that generator produces for you by default in `theme.scss`. First step is to create new color palettes or modify existing ones in `colors.scss`. By default we provide 3 different color palettes for you:
* `app-primary-blue` as primary palette
* `app-accent-green` as accent palette
* `app-warn` as warn palette

if you want to modify them you can simply adapt the colors to your application needs and no other changes will be required. However if you will create new color palettes you will need to modify `theme.scss` to use newly created palettes:

```scss
$primary: mat.m2-define-palette($app-custom-primary);
$accent:  mat.m2-define-palette($app-custom-accent);
$warn:    mat.m2-define-palette($app-custom-warn);
```

### Multiple themes

You can also create multiple themes for your application:

```scss
$primary: mat.m2-define-palette($app-custom-primary);
$accent:  mat.m2-define-palette($app-custom-accent);
$warn:    mat.m2-define-palette($app-custom-warn);
$theme:   mat.m2-define-light-theme((
    color: (
        primary: $primary,
        accent: $accent,
        warn: $warn,
    ),
    typography: $app-typography
));

$dark-theme:   mat.m2-define-dark-theme((
    color: (
        primary: $primary,
        accent: $accent,
        warn: $warn,
    ),
    typography: $app-typography
));

@include mat.all-component-themes($theme);
@include adf-core-theme($theme);

.app-dark-theme {
    @include mat.all-component-themes($dark-theme);
    @include adf-core-theme($dark-theme);
}
```
Any component with the `app-dark-theme` class will use the dark theme, while other components will fall back to the default.


## How to create reusable colors/variables
If many components in your application need to use the same color or styling configuration you can create reusable variables for them. It will make the app maintenance way easier and faster if you will make some changes in your theme later on. To do that modify contents of `variables.scss` to add new variables:
```scss
$defaults: (
  ...
  --theme-primary-background: mat.m2-get-color-from-palette($app-primary-blue, 100),
  --theme-accent-dark: mat.m2-get-color-from-palette($app-accent-green, 900),
  ...
);
```

and then each variable can be used across your application:
```scss
background-color: var(--theme-accent-dark)
```

