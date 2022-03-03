/*
* NOTE: Do not use this script as an ES6 module.
*  ES6 modules are deferred and we don't want that because
*  we want the user previous theme selection to be applied
*  as soon as possible (before the page is rendered).
* */

/*
* There are two types of modules mostly used in JavaScript.
* One is created by Node.js and is used inside the Node environment
* and has been available for a long time.
* Another is the standard native JavaScript modules introduced in ES6.
*
* The Node type uses `module.exports` (or simply `exports`) and `require()`
* to export and import functions, properties, etc.
* Because these are arbitrary objects and functions created just in Node environment,
* browsers do not know about `exports` or `require` functions and throw error.
* If you want to use this type of module in browsers, you should bundle the files
* (merge all of them into a single JS file which eliminates the need for exports and require)
* with tools like babel, webpack, rollup, etc.
*
* ES6 modules use `export` and `import` keywords for the same purpose.
*
* Example Node modules:
*
* my-calculator.js
* const PI = 3.14;
* function calculate() {}
* modules.exports.calculate = calculate;
* modules.exports.PI = PI;
*
* main.js
* const calculator = require("my-calculator");
* let perimeter = 2 * calculator.PI;
* let result = calculator.calculate();
*
* Example ES6 modules:
*
* my-calculator.js
* const PI = 3.14;
* export function calculate() {}
*
* main.js
* import { calculate, PI } from "my-calculator.js";
* let perimeter = 2 * PI;
* let result = calculate();
*
* See https://stackoverflow.com/a/9901097/8583692
* */

/*
* Minify the script either through command line with babel
* - babel theme-switch.js --presets minify --source-maps --out-file result.min.js
* or with babel-minify (also has an alias called minify) which is useful if
* you don't already use babel (as a preset) or want to run minification standalone.
* Note that it does not take into account babel.config.json settings.
* - babel-minify (or minify) theme-switch.js --mangle --no-comments --out-file result.min.js`
* Or automate it with IntelliJ file watcher
* - babel
*   + program: $ProjectFileDir$\node_modules\.bin\babel
*   + arguments: $FilePathRelativeToProjectRoot$ --out-file $FileNameWithoutExtension$.min.js --presets minify --source-maps
*   Note that setting "sourceMaps": "true" in babel.config.json does not work because of
*   this bug: https://github.com/babel/babel/issues/5261 ("sourceMaps": "inline" works, however)
* - UglifyJS
* - YUI compressor (seems to be deprecated and removed in newer versions of IntelliJ)
* */

// TODO: extract Jest configuration to a jest.config.js file

/*
* NOTE: To avoid name collisions if another script declares variables or functions with the same name
*  as ours (i.e. defining them in the global scope) and browsers complaining about identifiers
*  being redeclared, we wrap all our code in a closure or IEFE (sort of creating a namespace for it).
* For examples, see these libraries:
*   - https://github.com/highlightjs/highlight.js/blob/main/src/highlight.js
*   - https://github.com/jashkenas/underscore/blob/master/underscore.js
* See
*   - https://stackoverflow.com/a/32750216/8583692
*   - https://stackoverflow.com/q/8228281/8583692
*   - https://stackoverflow.com/q/881515/8583692
*   - https://stackoverflow.com/q/39388777/8583692
* We could also do something like these libraries:
*   - https://github.com/juliangarnier/anime/blob/master/build.js
*   - https://github.com/mrdoob/three.js/
*   - https://github.com/moment/moment
*   - https://github.com/floating-ui/floating-ui
* */

const ICON_SIZE = 24 /* px */;
const THEME_KEY = "theme";
const THEME_AUTO = "auto";
const THEME_DARK = "dark";
const THEME_LIGHT = "light";
const THEME_DEFAULT = THEME_LIGHT;
const THEME_ATTRIBUTE = "data-theme";
const COLOR_SCHEME_DARK = "(prefers-color-scheme: dark)";

// circleRadius, raysOpacity, eclipseCenterX, letterOffset
const ICON_INITIAL_STATE_FOR_AUTO = [10, 0, 33, 0];
const ICON_INITIAL_STATE_FOR_DARK = [10, 0, 20, 1];
const ICON_INITIAL_STATE_FOR_LIGHT = [5, 1, 33, 1];

let shadowRoot;

class ThemeSwitchElement extends HTMLElement {
    constructor() {
        super();

        // See https://stackoverflow.com/q/2305654/8583692
        shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.innerHTML = generateIcon(...getInitialStateForIcon());

        // Add the click listener to the top-most parent (the custom element itself)
        // so the padding etc. on the element be also clickable
        shadowRoot.host.addEventListener("click", toggleTheme);

        // Create some CSS to apply to the shadow DOM
        // See https://css-tricks.com/styling-a-web-component/
        const style = document.createElement("style");
        style.textContent = generateStyle();
        shadowRoot.append(style);
    }
}

// language=html
function generateIcon(circleRadius, raysOpacity, eclipseCenterX, letterOffset) {
    return `
    <!-- Using <button> element allows the element to be focused and is more semantic -->
    <button id="theme-switch">
      <!-- See https://stackoverflow.com/q/34393465/8583692 -->
      <svg viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="mask">
            <!-- Fill the entire viewBox as the mask default (show everything) -->
            <rect width="100%" height="100%" fill="#fff"/>
            <circle id="eclipse" r="10" cx="${eclipseCenterX}" cy="6">
              <animate id="eclipse-anim-come" fill="freeze" attributeName="cx" to="20" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
              <animate id="eclipse-anim-go" fill="freeze" attributeName="cx" to="33" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
            </circle>
            <!-- See https://youtu.be/7aobRPg7BXI -->
            <path id="letter" fill="none" stroke="#000" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${letterOffset}" d="m8 16.5 4-9 4 9-1-2h-6">
              <animate id="letter-anim-show" fill="freeze" attributeName="stroke-dashoffset" to="0" dur="400ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines=".67,.27,.55,.9"/>
              <animate id="letter-anim-hide" fill="freeze" attributeName="stroke-dashoffset" to="1" dur="15ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
            </path>
          </mask>
        </defs>
        <g id="visible-content" mask="url(#mask)">
          <g id="rays" opacity="${raysOpacity}" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round">
            <animate id="rays-anim-hide" fill="freeze" attributeName="opacity" to="0" dur="100ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
            <animate id="rays-anim-show" fill="freeze" attributeName="opacity" to="1" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
            <animateTransform id="rays-anim-rotate" attributeName="transform" attributeType="XML" type="rotate" from="-25 12 12" to="0 12 12" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
            <path d="m12 1v3"/>
            <path d="m23 12h-3"/>
            <path d="m19.778 4.2218-2.121 2.1213"/>
            <path d="m19.778 19.778-2.121-2.121"/>
            <path d="m4.222 19.778 2.121-2.121"/>
            <path d="m4.222 4.222 2.121 2.121"/>
            <path d="m4 12h-3"/>
            <path d="m12 20v3"/>
          </g>
          <circle id="circle" r="${circleRadius}" cx="12" cy="12">
            <animate id="core-anim-enlarge" fill="freeze" attributeName="r" to="10" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
            <animate id="core-anim-shrink" fill="freeze" attributeName="r" to="5" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
          </circle>
        </g>
      </svg>
    </button>
    `;
}

// language=css
function generateStyle() {
    return `
    /* :host === the host element of the shadow === <theme-switch> */
    /* See https://developer.mozilla.org/en-US/docs/Web/CSS/:host */
    :host {
        display: flex;
        width: ${ICON_SIZE}px;
        aspect-ratio: 1 / 1;
        /* This is for when the element has padding */
        cursor: pointer;
    }

    button {
        padding: 0;
        border: none;
        background: transparent;
        display: flex;
        /* The host element also has its cursor set */
        cursor: pointer;
    }

    /* Only change the color of the core and not rays */
    /* as it seems to make a visually better animation */
    #circle {
        fill: var(--theme-switch-icon-color);
        stroke: var(--theme-switch-icon-color);
    }
    `;
}

updateTheme();
window.customElements.define("theme-switch", ThemeSwitchElement);
window
    .matchMedia(COLOR_SCHEME_DARK)
    .addEventListener("change", updateTheme);

function updateTheme() {
    let theme = getUserThemeSelection();
    if (theme === THEME_AUTO) theme = getSystemTheme();
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
}

function getUserThemeSelection() {
    const userSelection = localStorage.getItem(THEME_KEY);
    return userSelection === null ? THEME_DEFAULT : userSelection;
}

function getSystemTheme() {
    const isDark = window.matchMedia(COLOR_SCHEME_DARK).matches;
    return isDark ? THEME_DARK : THEME_LIGHT;
}

function getInitialStateForIcon() {
    let theme = getUserThemeSelection();
    if (theme === THEME_AUTO) {
        return ICON_INITIAL_STATE_FOR_AUTO;
    } else if (theme === THEME_DARK) {
        return ICON_INITIAL_STATE_FOR_DARK;
    } else /* if (theme === THEME_LIGHT) */ {
        return ICON_INITIAL_STATE_FOR_LIGHT;
    }
}

// See https://stackoverflow.com/q/48316611
function toggleTheme() {
    let theme = getUserThemeSelection();
    if (theme === THEME_AUTO) {
        localStorage.setItem(THEME_KEY, THEME_LIGHT);
        animateThemeButtonIconToLight();
    } else if (theme === THEME_DARK) {
        localStorage.setItem(THEME_KEY, THEME_AUTO);
        animateThemeButtonIconToAuto();
    } else /* if (theme === THEME_LIGHT) */ {
        localStorage.setItem(THEME_KEY, THEME_DARK);
        animateThemeButtonIconToDark();
    }
    updateTheme();
}

function animateThemeButtonIconToLight() {
    shadowRoot.getElementById("letter-anim-hide").beginElement();
    shadowRoot.getElementById("core-anim-shrink").beginElement();
    shadowRoot.getElementById("rays-anim-rotate").beginElement();
    shadowRoot.getElementById("rays-anim-show").beginElement();
}

function animateThemeButtonIconToAuto() {
    shadowRoot.getElementById("eclipse-anim-go").beginElement();
    shadowRoot.getElementById("letter-anim-show").beginElement();
}

function animateThemeButtonIconToDark() {
    shadowRoot.getElementById("rays-anim-hide").beginElement();
    shadowRoot.getElementById("core-anim-enlarge").beginElement();
    shadowRoot.getElementById("eclipse-anim-come").beginElement();
}

// Export for tests run by npm.
// See https://stackoverflow.com/q/63752210/8583692
// and https://stackoverflow.com/a/54680602/8583692
// and https://stackoverflow.com/q/43042889/8583692
// and https://stackoverflow.com/a/1984728/8583692
if (typeof module !== "undefined") {
    module.exports = {
        updateTheme,
        toggleTheme,
        getSystemTheme,
        getUserThemeSelection,
        getInitialStateForIcon,
        animateThemeButtonIconToAuto,
        animateThemeButtonIconToDark,
        animateThemeButtonIconToLight
    };
}
