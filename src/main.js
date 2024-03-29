/*
 * To set up the project dependencies and libraries, first run:
 * ```shell
 * npm install
 * ```
 * It will download all dependencies (including chrome for puppeteer).
 * To clean install everything, see https://stackoverflow.com/a/55258699.
 *
 * Downloading Chrome may require VPN in restricted locations. See:
 * - https://stackoverflow.com/a/60843949
 * - https://www.chromium.org/getting-involved/download-chromium/
 * - https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html
 * - https://download-chromium.appspot.com/
 * We can run the puppeteer installation like so to try to
 * download the chrome again if it failed (https://stackoverflow.com/a/60843938):
 * ```shell
 * node ./node_modules/puppeteer/install.js
 * ```
 * Or, we could download the chrome manually and extract it in the directory
 * specified and described in our tests.js script.
 *
 * To bundle the script and generate the distributable, run:
 * ./node_modules/.bin/rollup -c rollup.config.mjs
 *
 * The scripts to run are defined in the package.json file.
 * Those are mostly scripts that test the project because our project
 * is not a runnable app or something executable so there is no "run" script.
 * To "run" (see) the component, generate the distributable as described
 * above and then open the demo/index.html file in a browser.
 */

/*
 * NOTE: Do not use this script as an ES6 module.
 *  ES6 modules are deferred and we don't want that because
 *  we want the user previous theme selection to be applied
 *  as soon as possible (before the page is rendered).
 */

/*
 * There are two types of modules mostly used in JavaScript.
 * One is created by Node.js and is used inside the Node environment
 * and has been available for a long time. It is called CommonJS.
 * Another is the standard native JavaScript modules introduced in ES6.
 *
 * The Node variant (CommonJS) uses `module.exports` (or simply `exports`) and
 * `require()` to export and import scripts, functions, variables, etc.
 * Browsers do not know about `exports` or `require` functions and throw error
 * because they are objects and functions created just in Node environment and set globally.
 * If you want to use this type of module in browsers, you should bundle the files
 * (merge all of them into a single JS file which eliminates the need for exports and require)
 * with tools like babel, webpack, rollup, etc.
 *
 * ES6 modules use `export` and `import` keywords for the same purpose.
 *
 * Example Node modules:
 *
 * // my-calculator.js \\
 * const PI = 3.14;
 * function calculate() {}
 * modules.exports.calculate = calculate;
 * modules.exports.PI = PI;
 *
 * // main.js \\
 * const calculator = require("my-calculator");
 * const perimeter = 2 * calculator.PI;
 * const result = calculator.calculate();
 *
 * Example ES6 modules:
 *
 * // my-calculator.js \\
 * export const PI = 3.14;
 * export function calculate() {}
 *
 * // main.js \\
 * import { calculate, PI } from "my-calculator.js";
 * const perimeter = 2 * PI;
 * const result = calculate();
 *
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
 * and https://stackoverflow.com/a/9901097/8583692
 */

/*
 * Minify the script either through command line with babel:
 * - babel main.js --source-maps --out-file result.min.js
 * or with babel-minify (also has an alias called minify) which is useful if
 * you don't already use babel (as a preset) or want to run minification standalone.
 * Note that it does not take into account babel.config.json settings.
 * - babel-minify (or minify) main.js --mangle --no-comments --out-file result.min.js`
 * Or automate it with IntelliJ file watcher
 * - babel
 *   + program: $ProjectFileDir$\node_modules\.bin\babel
 *   + arguments: $FilePathRelativeToProjectRoot$ --out-file $FileNameWithoutExtension$.min.js --source-maps
 *   Note that setting "sourceMaps": "true" in babel.config.json does not work because of
 *   this bug: https://github.com/babel/babel/issues/5261 ("sourceMaps": "inline" works, however)
 * - UglifyJS
 * - YUI compressor (seems to be deprecated and removed in newer versions of IntelliJ)
 *
 * Babel preset-env inserts a semicolon at the start of the minified file.
 * See why: https://stackoverflow.com/q/1873983/8583692
 */

// TODO: extract Jest configuration to a jest.config.js file
// TODO: Add an attribute so the user can define key name stored in localstorage
// TODO: Make the component customizable by adding custom attributes:
//  See https://medium.com/technofunnel/creating-passing-data-to-html-custom-elements-using-attributes-bfd9aa759fd4

// FIXME: If the switch is toggled too quickly, the switches in other open tabs may not update consistently.
//  Steps to reproduce the bug:
//  - Open two tabs
//  - Set the theme of both tabs to "auto"
//  - In one of the pages, click the switch three times in rapid succession so its new state is "auto" again
//    The other tab should also show auto icon but it shows light icon.
//  To resolve this, instead of listening for localstorage events, maybe we can pull the
//  localstorage state for changes every 100 ms and update the switch if necessary.

/*
 * NOTE: To avoid name collisions if another script declares variables or functions with the same name
 *  as ours (i.e. defining them in the global scope) and browsers complaining about identifiers
 *  being redeclared, we wrap all our code in a closure or IIFE (sort of creating a namespace for it).
 *  ES6 now supports block scope as well (simply wrapping the whole code in {}).
 *  I am now using the babel-plugin-iife-wrap plugin to wrap the whole result (minified) code in an IIFE.
 * For examples, see these libraries:
 *   - https://github.com/highlightjs/highlight.js/blob/main/src/highlight.js
 *   - https://github.com/jashkenas/underscore/blob/master/underscore.js
 * See
 *   - https://www.w3schools.com/js/js_scope.asp
 *   - https://github.com/jhnns/rewire/issues/136#issuecomment-380829197
 *   - https://stackoverflow.com/a/32750216/8583692
 *   - https://stackoverflow.com/q/8228281/8583692
 *   - https://stackoverflow.com/q/881515/8583692
 *   - https://stackoverflow.com/q/39388777/8583692
 *   - https://stackoverflow.com/a/47207686/8583692
 * We could also do something like these libraries:
 *   - https://github.com/juliangarnier/anime/blob/master/build.js
 *   - https://github.com/mrdoob/three.js/
 *   - https://github.com/moment/moment
 *   - https://github.com/floating-ui/floating-ui
 */

const ELEMENT_NAME = "theme-switch";
const ICON_SIZE = 24 /* px */;
const ICON_COLOR = "#000";
const THEME_KEY = "theme";
const THEME_AUTO = "auto";
const THEME_DARK = "dark";
const THEME_LIGHT = "light";
const THEME_VALUES = [THEME_AUTO, THEME_DARK, THEME_LIGHT];
const THEME_DEFAULT = THEME_LIGHT;
const THEME_ATTRIBUTE = "data-theme";
const COLOR_SCHEME_DARK = "(prefers-color-scheme: dark)";
const CUSTOM_EVENT_NAME = "themeToggle";
// circleRadius, raysOpacity, eclipseCenterX, letterOffset
const ICON_INITIAL_STATE_FOR_AUTO = [10, 0, 33, 0];
const ICON_INITIAL_STATE_FOR_DARK = [10, 0, 20, 1];
const ICON_INITIAL_STATE_FOR_LIGHT = [5, 1, 33, 1];

class ThemeSwitchElement extends HTMLElement {
    shadowRoot;
    // See pages 410-415 of the book Grokking Simplicity: Taming...
    // Also, see https://stackoverflow.com/a/43116254/8583692
    static counter = 0;
    identifier = ThemeSwitchElement.counter++;

    constructor() {
        super();
        // See https://stackoverflow.com/q/2305654/8583692
        this.shadowRoot = this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = generateIcon(...getInitialStateForIcon());
        // Add the click listener to the top-most parent (the custom element itself)
        // so the padding etc. on the element be also clickable
        this.shadowRoot.host.addEventListener("click", this.onClick);
        // If another theme switch in page toggled, update my icon too
        document.addEventListener(CUSTOM_EVENT_NAME, event => {
            if (event.detail.originId !== this.identifier) {
                this.adaptToTheme();
            }
        });
        // If a theme switch in another page toggled, update my state too
        // See https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
        window.addEventListener("storage", event => {
            if (event.key === THEME_KEY) {
                this.adaptToTheme();
                updateTheme();
            }
        });
        // Create some CSS to apply to the shadow DOM
        // See https://css-tricks.com/styling-a-web-component/
        const style = document.createElement("style");
        style.textContent = generateStyle();
        this.shadowRoot.append(style);
    }

    onClick() {
        const oldTheme = getUserThemeSelection();
        this.toggleTheme(oldTheme);
        const newTheme = getUserThemeSelection();
        const event = this.createEvent(oldTheme, newTheme);
        this.dispatchEvent(event);
    }

    // See https://stackoverflow.com/a/53804106/8583692
    createEvent(oldTheme, newTheme) {
        return new CustomEvent(CUSTOM_EVENT_NAME, {
            detail: {
                originId: this.identifier,
                oldState: oldTheme,
                newState: newTheme
            },
            bubbles: true,
            composed: true,
            cancelable: false
        });
    }

    // See https://stackoverflow.com/q/48316611
    toggleTheme(currentTheme) {
        if (currentTheme === THEME_AUTO) {
            localStorage.setItem(THEME_KEY, THEME_LIGHT);
            this.animateThemeButtonIconToLight();
        } else if (currentTheme === THEME_DARK) {
            localStorage.setItem(THEME_KEY, THEME_AUTO);
            this.animateThemeButtonIconToAuto();
        } else /* if (theme === THEME_LIGHT) */ {
            localStorage.setItem(THEME_KEY, THEME_DARK);
            this.animateThemeButtonIconToDark();
        }
        updateTheme();
    }

    adaptToTheme() {
        const theme = getUserThemeSelection();
        if (theme === THEME_AUTO) {
            this.animateThemeButtonIconToAuto();
        } else if (theme === THEME_DARK) {
            this.animateThemeButtonIconToDark();
        } else /* if (theme === THEME_LIGHT) */ {
            this.animateThemeButtonIconToLight();
        }
    }

    animateThemeButtonIconToLight() {
        this.shadowRoot.getElementById("letter-anim-hide").beginElement();
        this.shadowRoot.getElementById("core-anim-shrink").beginElement();
        this.shadowRoot.getElementById("rays-anim-rotate").beginElement();
        this.shadowRoot.getElementById("rays-anim-show").beginElement();
    }

    animateThemeButtonIconToAuto() {
        this.shadowRoot.getElementById("eclipse-anim-go").beginElement();
        this.shadowRoot.getElementById("letter-anim-show").beginElement();
    }

    animateThemeButtonIconToDark() {
        this.shadowRoot.getElementById("rays-anim-hide").beginElement();
        this.shadowRoot.getElementById("core-anim-enlarge").beginElement();
        this.shadowRoot.getElementById("eclipse-anim-come").beginElement();
    }
}

function generateIcon(circleRadius, raysOpacity, eclipseCenterX, letterOffset) {
    return `ICON_TEMPLATE`;
}

function generateStyle() {
    return `STYLES_TEMPLATE`;
}

updateTheme();
window.customElements.define(ELEMENT_NAME, ThemeSwitchElement);
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
    return THEME_VALUES.includes(userSelection) ? userSelection : THEME_DEFAULT;
}

function getSystemTheme() {
    const isDark = window.matchMedia(COLOR_SCHEME_DARK).matches;
    return isDark ? THEME_DARK : THEME_LIGHT;
}

function getInitialStateForIcon() {
    const theme = getUserThemeSelection();
    if (theme === THEME_AUTO) {
        return ICON_INITIAL_STATE_FOR_AUTO;
    } else if (theme === THEME_DARK) {
        return ICON_INITIAL_STATE_FOR_DARK;
    } else /* if (theme === THEME_LIGHT) */ {
        return ICON_INITIAL_STATE_FOR_LIGHT;
    }
}

// Export for tests run by npm (no longer needed; kept for future reference)
// See https://stackoverflow.com/q/63752210/8583692
// and https://stackoverflow.com/a/54680602/8583692
// and https://stackoverflow.com/q/43042889/8583692
// and https://stackoverflow.com/a/1984728/8583692
// if (typeof module !== "undefined") {
//     module.exports = {
//         updateTheme,
//         toggleTheme,
//         getSystemTheme,
//         getInitialStateForIcon,
//         animateThemeButtonIconToAuto,
//         animateThemeButtonIconToDark,
//         animateThemeButtonIconToLight
//     };
// }
