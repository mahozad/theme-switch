const { JSDOM } = require("jsdom");

// See https://github.com/chaijs/type-detect/issues/98
// See https://stackoverflow.com/a/51702674/8583692
const dom = new JSDOM(
    `<!DOCTYPE html><html lang="en"><body></body></html>`,
    { url: "http://localhost" }
);

global.window = dom.window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.localStorage = window.localStorage;
setSystemThemeTo("light");

const main = require("./theme-switch");

test(`When system theme is light, getSystemTheme should return "light"`, () => {
    expect(main.getSystemTheme()).toBe("light");
});

test(`When system theme is dark, getSystemTheme should return "dark"`, () => {
    setSystemThemeTo("dark");
    expect(main.getSystemTheme()).toBe("dark");
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
