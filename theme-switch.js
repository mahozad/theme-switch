const DEFAULT_SIZE = 24 /* px */;

// circleRadius, raysOpacity, eclipseCenterX, letterOffset
const ICON_INITIAL_STATE_FOR_AUTO = [10, 0, 33, 0];
const ICON_INITIAL_STATE_FOR_DARK = [10, 0, 20, 1];
const ICON_INITIAL_STATE_FOR_LIGHT = [5, 1, 33, 1];

let shadowRoot;

class ThemeSwitch extends HTMLElement {
    constructor() {
        super();

        // Creates and returns "this.shadowRoot"
        shadowRoot = this.attachShadow({mode: "open"});
        const [circleRadius, raysOpacity, eclipseCenterX, letterOffset] = getInitialStateForIcon();

        // See https://stackoverflow.com/q/2305654/8583692
        shadowRoot.innerHTML = `
            <!-- Using <button> element allows the element to be focused and is more semantic -->
            <button id="theme-switch">
              <!-- See https://stackoverflow.com/q/34393465/8583692 -->
              <svg viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <mask id="mask">
                    <!-- Fill the entire viewbox so it is clickable -->
                    <rect width="100%" height="100%" fill="#fff"/>
                    <circle id="eclipse" r="10" cx="${eclipseCenterX}" cy="6">
                      <animate id="eclipse-anim-come" fill="freeze" attributeName="cx" to="20" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
                      <animate id="eclipse-anim-go" fill="freeze" attributeName="cx" to="33" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
                    </circle>
                    <!-- See https://youtu.be/7aobRPg7BXI -->
                    <path id="letter" fill="none" stroke="#000" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" pathlength="1" stroke-dasharray="1 1" stroke-dashoffset="${letterOffset}" d="m8 16.5 4-9 4 9-1-2h-6">
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

        // Add the click listener to the top-most parent (the custom element itself)
        // so the padding etc. on the element be also clickable
        shadowRoot.host.addEventListener("click", toggleTheme);

        // Create some CSS to apply to the shadow DOM
        const style = document.createElement("style");

        // See https://css-tricks.com/styling-a-web-component/
        // language=CSS
        style.textContent = `
            /* :host === the host element of the shadow === <theme-switch> */
            /* See https://developer.mozilla.org/en-US/docs/Web/CSS/:host */
            :host {
                display: flex;
                width: ${DEFAULT_SIZE}px;
                aspect-ratio: 1 / 1;
            }

            button {
                padding: 0;
                border: none;
                background: transparent;
                display: flex;
                cursor: pointer;
            }

            /* Only change the color of the core and not rays
             * as it seems to make a visually better animation 
             */
            #circle {
                fill: var(--theme-switch-icon-color);
                stroke: var(--theme-switch-icon-color);
            }
        `;

        shadowRoot.append(style);
    }
}

customElements.define("theme-switch", ThemeSwitch);

// ----------====================-----------------======================
// ----------====================-----------------======================
// ----------====================-----------------======================
// ----------====================-----------------======================
// ----------====================-----------------======================
// ----------====================-----------------======================

const THEME_KEY = "theme";
const THEME_AUTO = "auto";
const THEME_DARK = "dark";
const THEME_LIGHT = "light";
const THEME_ATTRIBUTE = "data-theme";
const COLOR_SCHEME_DARK = "(prefers-color-scheme: dark)";

updateTheme();
window
    .matchMedia(COLOR_SCHEME_DARK)
    .addEventListener("change", updateTheme);

function updateTheme() {
    let theme = getUserThemeSelection();
    if (theme === THEME_AUTO) theme = getSystemTheme();
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
}

function getUserThemeSelection() {
    const defaultTheme = THEME_LIGHT;
    const userSelection = localStorage.getItem(THEME_KEY);
    return userSelection === null ? defaultTheme : userSelection;
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
