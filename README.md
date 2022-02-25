<div align="center">

![Animated icon on light](animation.svg#gh-light-mode-only)
![Animated icon on dark](animation-on-dark.svg#gh-dark-mode-only)

</div>

## Web light/dark/auto theme switch button

This widget toggles between light theme, dark theme, and auto theme (OS theme).
It works by adding a custom attribute named `data-theme` to the `html` element.
It is up to you to style your page the way you like based on the value of that attribute.
See below for an example.

It was inspired by [this library](https://github.com/GoogleChromeLabs/dark-mode-toggle)
and [this YouTube video](https://youtu.be/kZiS1QStIWc).

### Getting started

Download the [theme-switch.js](theme-switch.js) file and add it to your HTML head element:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My page title</title>
  <script src="theme-switch.js"></script>
  <!-- ... -->
</head>
```

The element is called `<theme-switch>`. Use it just like you would use a regular element (e.g. `div`):

```html
<!-- ... -->
<body>
<!-- ... -->

<theme-switch></theme-switch>

<!-- ... -->
</body>
```

Provide your colors and values for light/dark themes as CSS variables in the first two rules:

```css
/* These are applied for the light theme (or when auto and the system theme is light) */
:root {
    --my-page-background-color: #fff;
    --my-icons-color: #000;
}

/* These are applied for the dark theme (or when auto and the system theme is dark) */
[data-theme="dark"] {
    --my-page-background-color: #112233;
    --my-icons-color: #efefef;
}

html {
    background: var(--my-page-background-color);
}
```

You can also style the switch element itself however you want, again, just like regular elements:

```css
theme-switch {
    width: 64px;
    padding: 8px;
    background: #888;
    
    /* There is a special variable called --theme-switch-icon-color
     * so you can set the icon color of the switch button */
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
