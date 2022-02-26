const { JSDOM } = require("jsdom");

// See https://github.com/chaijs/type-detect/issues/98
// See https://stackoverflow.com/a/51702674/8583692
const dom = new JSDOM(
    `<!DOCTYPE html><html><body></body></html>`,
    { url: "http://localhost" }
);

global.window = dom.window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.localStorage = window.localStorage;

// See https://stackoverflow.com/a/53449595/8583692
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

const main = require("./theme-switch");

test("first test", () => {
    expect("abc").toEqual("abc");
    expect("def").toBe("def");
    expect(main.getSystemTheme()).toEqual("light");
});

console.log(`\u001B[32m✔️\u001B[39m Tests passed`);
