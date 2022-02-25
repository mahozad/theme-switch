class ThemeSwitch extends HTMLElement {
    constructor() {
        super();

        // Create a shadow root
        this.attachShadow({mode: "open"}); // sets and returns "this.shadowRoot"

        // See https://stackoverflow.com/q/2305654
        this.shadowRoot.innerHTML = `<button id="theme-switch" onclick="toggleTheme()">
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="mask">
        <rect width="24" height="24" fill="#fff"/>
        <circle id="eclipse" r="10" cx="33" cy="6">
          <animate id="eclipse-anim-come" fill="freeze" attributeName="cx" to="20" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
          <animate id="eclipse-anim-go" fill="freeze" attributeName="cx" to="33" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
        </circle>
        <!-- See https://youtu.be/7aobRPg7BXI -->
        <path id="letter" fill="none" stroke="#000" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" pathlength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="m8 16.5 4-9 4 9-1-2h-6">
          <animate id="letter-anim-show" fill="freeze" attributeName="stroke-dashoffset" to="0" dur="400ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines=".67,.27,.55,.9"/>
          <animate id="letter-anim-hide" fill="freeze" attributeName="stroke-dashoffset" to="1" dur="15ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
        </path>
      </mask>
    </defs>
    <g id="visible-content" mask="url(#mask)">
      <circle id="circle" r="5" cx="12" cy="12">
        <animate id="core-anim-enlarge" fill="freeze" attributeName="r" to="10" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
        <animate id="core-anim-shrink" fill="freeze" attributeName="r" to="5" dur="300ms" begin="indefinite" calcMode="spline" keyTimes="0; 1" keySplines="0.37, 0, 0.63, 1"/>
      </circle>
      <g id="rays" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round">
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
    </g>
  </svg>
</button>
`;

        /*// Create (nested) span elements
        const wrapper = document.createElement("span");
        wrapper.setAttribute("class", "wrapper");
        const icon = wrapper.appendChild(document.createElement("span"));
        icon.setAttribute("class", "icon");
        icon.setAttribute("tabindex", 0);
        // Insert icon from defined attribute or default icon
        const img = icon.appendChild(document.createElement("img"));
        img.src = this.hasAttribute("img") ? this.getAttribute("img") : "img/default.png";

        const info = wrapper.appendChild(document.createElement("span"));
        info.setAttribute("class", "info");
        // Take attribute content and put it inside the info span
        info.textContent = this.getAttribute("data-text");*/

        // Create some CSS to apply to the shadow dom
        const style = document.createElement("style");

        // language=CSS
        style.textContent = `
            #theme-switch {
                /*visibility: hidden;*/
                /*position: absolute;*/
                padding: 8px;
                border: none;
                inset-inline-start: -56px;
                inset-block-start: 0;
                display: flex;
                cursor: pointer;
                border-radius: 8px;
                background: var(--theme-switch-bg-color);
                box-shadow: #0000002D 0 2px 4px;
            }

            /* Only change the color of the core and not rays
             * as it seems to make a better animation in terms of visuals
             */
            #circle {
                fill: var(--theme-switch-icon-color);
                stroke: var(--theme-switch-icon-color);
            }
        `;

        // attach the created elements to the shadow DOM
        this.shadowRoot.append(style/*, wrapper*/);
    }

    connectedCallback() {

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
const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

updateTheme();
setThemeButtonInitialIcon();

document.addEventListener("DOMContentLoaded", onDocumentReady);
window.matchMedia(COLOR_SCHEME_QUERY)
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
    const isDark = window.matchMedia(COLOR_SCHEME_QUERY).matches;
    return isDark ? THEME_DARK : THEME_LIGHT;
}

function onDocumentReady() {
    setThemeButtonInitialIcon();
    // NOTE: Setting click listener here sometimes did not work in browsers.
    //  So, the onclick attribute is set on the element in the HTML.
    //  let shadowRoot = document.getElementsByTagName("theme-switch").item(0).shadowRoot;
    //  shadowRoot.getElementById("theme-switch").addEventListener("click", toggleTheme);
}

function setThemeButtonInitialIcon() {
    let theme = getUserThemeSelection();
    if (theme === THEME_AUTO) {
        setThemeButtonIconToAuto();
    } else if (theme === THEME_DARK) {
        setThemeButtonIconToDark();
    } else /* if (theme === THEME_LIGHT) */ {
        // Do nothing and show the icon as is
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
    let shadowRoot = document.getElementsByTagName("theme-switch").item(0).shadowRoot;
    shadowRoot.getElementById("letter-anim-hide").beginElement();
    shadowRoot.getElementById("core-anim-shrink").beginElement();
    shadowRoot.getElementById("rays-anim-show").beginElement();
    shadowRoot.getElementById("rays-anim-rotate").beginElement();
}

function animateThemeButtonIconToAuto() {
    let shadowRoot = document.getElementsByTagName("theme-switch").item(0).shadowRoot;
    shadowRoot.getElementById("eclipse-anim-go").beginElement();
    shadowRoot.getElementById("letter-anim-show").beginElement();
}

function animateThemeButtonIconToDark() {
    let shadowRoot = document.getElementsByTagName("theme-switch").item(0).shadowRoot;
    shadowRoot.getElementById("core-anim-enlarge").beginElement();
    shadowRoot.getElementById("rays-anim-hide").beginElement();
    shadowRoot.getElementById("eclipse-anim-come").beginElement();
}

function setThemeButtonIconToAuto() {
    let shadowRoot = document.getElementsByTagName("theme-switch").item(0).shadowRoot;
    shadowRoot.getElementById("circle").setAttribute("r", "10");
    shadowRoot.getElementById("rays").setAttribute("opacity", "0");
    shadowRoot.getElementById("letter").setAttribute("stroke-dashoffset", "0");
}

function setThemeButtonIconToDark() {
    let shadowRoot = document.getElementsByTagName("theme-switch").item(0).shadowRoot;
    shadowRoot.getElementById("circle").setAttribute("r", "10");
    shadowRoot.getElementById("rays").setAttribute("opacity", "0");
    shadowRoot.getElementById("eclipse").setAttribute("cx", "20");
}
