[![Tests workflow](https://img.shields.io/github/workflow/status/mahozad/theme-switch/CI?label=Tests&logo=github)](https://github.com/mahozad/theme-switch/actions/workflows/ci.yml)
[![Codecov](https://img.shields.io/codecov/c/gh/mahozad/theme-switch?label=Coverage&logo=codecov&logoColor=%23FF56C0&token=C4P4I1TQTF)](https://codecov.io/gh/mahozad/theme-switch)
[![Minified size](https://img.shields.io/bundlephobia/min/@mahozad/theme-switch?label=Minified%20size)](https://unpkg.com/@mahozad/theme-switch)

<div align="center">

![Animated icon](https://raw.githubusercontent.com/mahozad/theme-switch/main/icon.svg)

</div>

# HTML light/dark/system theme animated switch button

A simple [custom HTML element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
called `<theme-switch>`.
This widget toggles between light theme, dark theme, and automatic theme (OS theme).
It works by adding a custom attribute named `data-theme` to the `html` element of your page.
You can style your page the way you like based on the value of that attribute.
See below for an [example](#styling-a-page-based-on-the-selected-theme).

See the [demo page](https://mahozad.ir/theme-switch/).

It was inspired by [this YouTube video](https://youtu.be/kZiS1QStIWc)
and [this library](https://github.com/GoogleChromeLabs/dark-mode-toggle).

## Using in plain, regular HTML pages

<details>

Download the [theme-switch.min.js](dist/theme-switch.min.js) file and reference it at the top of your HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My page title</title>
  <!-- Do not use defer or async attributes -->
  <script src="theme-switch.min.js"></script>
  <!-- Rest of the styles, scripts, etc. -->
</head>
<body>

  <theme-switch></theme-switch>

</body>
```

You can also use CDNs instead of downloading the script manually and hosting it yourself:

  - Using the latest version:
    ```html
    <script src="https://unpkg.com/@mahozad/theme-switch"></script>
    <!-- OR -->
    <script src="https://cdn.jsdelivr.net/npm/@mahozad/theme-switch"></script>    
    ```
  - Using a specific version:
    ```html
    <script src="https://unpkg.com/@mahozad/theme-switch@1.0.0"></script>
    <!-- OR -->
    <script src="https://cdn.jsdelivr.net/npm/@mahozad/theme-switch@1.0.0"></script>
    ```
</details>
  
## Using in Node.js and npm

<details>
Install the library from a command line with this command:

```shell
npm install @mahozad/theme-switch
```

Use the script in your page like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My page title</title>
  <!-- Do not use defer or async attributes -->
  <script src="node_modules/@mahozad/theme-switch/dist/theme-switch.min.js"></script>
  <!-- Rest of the styles, scripts, etc. -->
</head>
<body>

  <theme-switch></theme-switch>

</body>
```

</details>

## Using in Angular framework

<details>

From command line, install the library:

```shell
npm install --save @mahozad/theme-switch
```

In your *angular.json* file at the root of your project update the `scripts` property like this:

```json
"scripts": [
  {
    "input": "node_modules/@mahozad/theme-switch/dist/theme-switch.min.js",
    "inject": false,
    "bundleName": "theme-switch"
  }
]
```

Add the following to your *app.module.ts* file to enable HTML custom elements:

```typescript
@NgModule({
    // ...
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
```

In `<head>` of your *index.html* file add the script just as described above:

```html
<script src="theme-switch.js"></script>
```

Finally, use the element anywhere you want:

```html
<theme-switch></theme-switch>
```

</details>

## Styling the switch element

A custom element is no different from HTML built-in elements.  
Use and style it however you want just like you would use and style a regular element (e.g. a `div`):

```css
theme-switch {
    width: 64px;
    padding: 8px;
    background: #888;
    
    /* There is a special property called --theme-switch-icon-color
     * which you can set, to change the color of the icon in switch */
    --theme-switch-icon-color: #aabbcc;
}
```

## Styling a page based on the selected theme

In your CSS stylesheet, specify your desired styles for light and dark themes.
One way is to define [custom CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for your colors, sizes, etc. and redefine them (if needed) with new values for the dark theme:

```css
/* These are applied for the default (light) theme */
/* (or when the toggle is auto, and the OS theme is light) */
:root {
    --my-page-background-color: #fff;
    --my-icons-color: #000;
    --my-primary-color: red;
}

/* These are applied for the dark theme */
/* (or when the toggle is auto, and the OS theme is dark) */
/* If a property has the same value for both light and dark themes, no need to redeclare it here */
[data-theme="dark"] {
    --my-page-background-color: #112233;
    --my-icons-color: #efefef;
}

body {
    background: var(--my-page-background-color);
}
```

## Misc

The switch element fires (triggers) a custom event called `themeToggle` every time it is toggled (clicked).
You can listen and react to it if you want:

```javascript
document.addEventListener("themeToggle", event => {
    console.log(`Old theme: ${ event.detail.oldState }`);
    console.log(`New theme: ${ event.detail.newState }`);
    // More operations...
});
```

---

## Other 

<details>

See [this article](https://css-tricks.com/web-components-are-easier-than-you-think/)
which is about creating HTML custom elements.

See the icon for switching themes (located in the top right corner) on
[Google Fonts site](https://fonts.google.com/icons). Also see [this site](https://rastikerdar.github.io/vazirmatn).

See [this article](https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web)
for implementing dark/light theme on sites.

See [this post](https://stackoverflow.com/q/56300132/8583692) for how to override
dark/light theme for a site.

---

TODO:
  - See [this comprehensive GitHub repo about custom elements](https://github.com/mateusortiz/webcomponents-the-right-way)
  - Try to publish the library in https://www.webcomponents.org/
  - Try to add the library to [rufus site](https://github.com/pbatard/rufus-web)
  - Try to add the library to [jest site](https://github.com/facebook/jest) (probably its `docs/` directory. see [this PR](https://github.com/facebook/jest/pull/11021))
  - Try to add the library to [MDN site](https://developer.mozilla.org/en-US/)
  - Try to add the library to [docusaurus](https://github.com/facebook/docusaurus)
  - Try to add the library to [dokka](https://github.com/Kotlin/dokka)
  - Try to add the library to [mkdocs-material](https://github.com/squidfunk/mkdocs-material)
  - See [chrome auto dark feature for android](https://developer.chrome.com/blog/new-in-chrome-98/#autodark-opt-out)

</details>
