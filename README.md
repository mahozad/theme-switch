<div align="center">

![Animated icon on light](animation.svg#gh-light-mode-only)
![Animated icon on dark](animation-on-dark.svg#gh-dark-mode-only)

</div>

## HTML light/dark/system theme switch button

This widget toggles between light theme, dark theme, and automatic theme (OS theme).
It works by adding a custom attribute named `data-theme` to the `html` element of your page.
It is up to you to style your page the way you like based on the value of that attribute.
See below for an example.

It was inspired by [this library](https://github.com/GoogleChromeLabs/dark-mode-toggle)
and [this YouTube video](https://youtu.be/kZiS1QStIWc).

### Use in your page

Download the [theme-switch.js](theme-switch.js) file and reference it at the top of your HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>My page title</title>
  <!-- Do not use defer or async attributes -->
  <script src="theme-switch.js"></script>
  <!-- Rest of the styles, scripts, etc. -->
</head>
```

The element is called `<theme-switch>`. Use it just like you would use a regular element (e.g. `div`):

```html
<theme-switch></theme-switch>
```

In your CSS stylesheet, specify your desired styles for light and dark themes.
One way is to define [custom CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for your colors, sizes, etc. and redefine them (if needed) with new values for the dark theme:

```css
/* These are applied for the default (light) theme (or when auto, and the system theme is light) */
:root {
    --my-page-background-color: #fff;
    --my-icons-color: #000;
    --my-primary-color: red;
}

/* Here, we redeclare properties that should have different values for the dark theme */
[data-theme="dark"] {
    --my-page-background-color: #112233;
    --my-icons-color: #efefef;
}

body {
    background: var(--my-page-background-color);
}
```

You can also style the switch element itself however you want, again, just like regular elements:

```css
theme-switch {
    width: 64px;
    padding: 8px;
    background: #888;
    
    /* There is a special property called --theme-switch-icon-color
     * which you can set, to change the color of the switch icon */
    --theme-switch-icon-color: var(--my-icons-color);
}
```

---

See [this YouTube video](https://youtu.be/kZiS1QStIWc).

See [this tutorial](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) and
[this article](https://css-tricks.com/web-components-are-easier-than-you-think/)
for creating HTML custom elements.

See the icon for switching themes (located in top right corner) on
[Google Fonts site](https://fonts.google.com/icons)

See [this article](https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web)
for implementing dark/light theme on sites.

See [this post](https://stackoverflow.com/q/56300132/8583692) for how to override
dark/light theme for site.

See [this library](https://github.com/GoogleChromeLabs/dark-mode-toggle) providing
a custom element for toggling dark/light theme.

---

TODO:
  - Try to add the library to [rufus site](https://github.com/pbatard/rufus-web)
  - Try to add the library to [jest site](https://github.com/facebook/jest)(probably its `docs/` directory. see [this PR](https://github.com/facebook/jest/pull/11021))
  - Try to add the library to [docusaurus](https://github.com/facebook/docusaurus)
  - Try to add the library to [dokka](https://github.com/Kotlin/dokka)
  - Try to add the library to [mkdocs-material](https://github.com/squidfunk/mkdocs-material)
