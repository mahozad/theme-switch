const { JSDOM } = require("jsdom");

// See https://github.com/chaijs/type-detect/issues/98
// See https://stackoverflow.com/a/51702674/8583692
const dom = new JSDOM(
    `<!DOCTYPE html><html lang="en"><body></body></html>`,
    { url: "http://localhost" }
);

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.localStorage = dom.window.localStorage;
setSystemThemeTo("light");

const main = require("./theme-switch");

test(`When system theme is light, getSystemTheme should return "light"`, () => {
    expect(main.getSystemTheme()).toBe("light");
});

test(`When system theme is dark, getSystemTheme should return "dark"`, () => {
    setSystemThemeTo("dark");
    expect(main.getSystemTheme()).toBe("dark");
});

test(`For first-time users, getUserThemeSelection should return the default theme`, () => {
    localStorage.clear();
    expect(main.getUserThemeSelection()).toBe("light");
});

test(`For first-time users, getUserThemeSelection should return the default theme irrespective of the system theme`, () => {
    localStorage.clear();
    setSystemThemeTo("dark");
    expect(main.getUserThemeSelection()).toBe("light");
});

test(`getUserThemeSelection should return "light" when user had previously selected "light"`, () => {
    localStorage.setItem("theme", "light");
    expect(main.getUserThemeSelection()).toBe("light");
});

test(`getUserThemeSelection should return "dark" when user had previously selected "dark"`, () => {
    localStorage.setItem("theme", "dark");
    expect(main.getUserThemeSelection()).toBe("dark");
});

test(`getUserThemeSelection should return "auto" when user had previously selected "auto"`, () => {
    localStorage.setItem("theme", "auto");
    expect(main.getUserThemeSelection()).toBe("auto");
});

/**
 * We cannot mock an internal function of a module with Jest.
 * Instead, we used babel rewire plugin.
 * See https://stackoverflow.com/q/51269431/8583692
 * and https://stackoverflow.com/q/51900413/8583692
 * and https://github.com/speedskater/babel-plugin-rewire
 *
 * If we wanted to mock a regular function, we could have used any of these approaches:
 *
 * ```javascript
 * jest.mock("theme-switch");
 * jest.spyOn(main, "animateThemeButtonIconToDark").mockImplementation(() => jest.fn());
 * jest.mock("theme-switch", () => ({
 *     ...jest.requireActual("theme-switch"),
 *     animateThemeButtonIconToDark: jest.fn()
 * }));
 * main.animateThemeButtonIconToDark.mockImplementation(() => {})
 * main.animateThemeButtonIconToDark = jest.fn(() => {});
 * ```
 */
test(`When user theme is light, toggleTheme should update the theme to dark`, () => {
    main.__Rewire__("animateThemeButtonIconToDark", function() {});

    localStorage.setItem("theme", "light");
    main.toggleTheme();
    expect(main.getUserThemeSelection()).toBe("dark");
});

console.log(`\u001B[32m✔️\u001B[39m Tests passed`);

// See https://stackoverflow.com/a/53449595/8583692
// and https://stackoverflow.com/a/57180950/8583692
function setSystemThemeTo(mode) {
    const isDark = mode === "dark";
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: isDark,
            media: query,
            onchange: null,
            addListener: jest.fn(), // Deprecated
            removeListener: jest.fn(), // Deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
}
