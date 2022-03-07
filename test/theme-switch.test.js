const { JSDOM } = require("jsdom");
const puppeteer = require("puppeteer-core");
const fileSystem = require("fs");
// See https://stackoverflow.com/a/48952855/8583692
const { configureToMatchImageSnapshot: configureSnapshots } = require("jest-image-snapshot");
const toMatchReferenceSnapshot = configureSnapshots({
    customSnapshotsDir: "snapshots/",
    customDiffDir: "snapshot-diffs/"
});
const snapshotFileName = "temp-snapshot-for-test.png";
/**
 * See https://stackoverflow.com/q/7163061/8583692
 * Add a local.json file with the content like this:
 * {
 *   "chromiumPath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
 * }
 * The file is intentionally ignored in VCS.
 */
const { chromiumPath } = require("../local.json");

expect.extend({ toMatchReferenceSnapshot });

// TODO: Also test for the following cases:
//  - No <theme-switch> element
//  - Duplicate <theme-switch> elements
// See https://github.com/chaijs/type-detect/issues/98
// See https://stackoverflow.com/a/51702674/8583692
// This HTML is used to create window, localstorage, etc. and is used for unit tests.
// Screenshot tests use their own HTML file.
const dom = new JSDOM(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Test page</title>
    </head>
    <body>
      <theme-switch></theme-switch>
    </body>
    </html> 
`,
    { url: "http://localhost" }
);

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.localStorage = dom.window.localStorage;
setSystemThemeTo("light");

const main = require("../theme-switch");
// Could have instead exported the functions in theme-switch.js
const mainInternals = {
    toggleTheme: main.__get__("toggleTheme"),
    getSystemTheme: main.__get__("getSystemTheme"),
    getUserThemeSelection: main.__get__("getUserThemeSelection")
};

test(`When system theme is light, getSystemTheme should return "light"`, () => {
    setSystemThemeTo("light");
    expect(mainInternals.getSystemTheme()).toBe("light");
});

test(`When system theme is dark, getSystemTheme should return "dark"`, () => {
    setSystemThemeTo("dark");
    expect(mainInternals.getSystemTheme()).toBe("dark");
});

test(`For first-time users, getUserThemeSelection should return the default theme`, () => {
    localStorage.clear();
    expect(mainInternals.getUserThemeSelection()).toBe("light");
});

test(`For first-time users, getUserThemeSelection should return the default theme irrespective of the system theme`, () => {
    localStorage.clear();
    setSystemThemeTo("dark");
    expect(mainInternals.getUserThemeSelection()).toBe("light");
});

test(`getUserThemeSelection should return "light" when user had previously selected "light"`, () => {
    localStorage.setItem("theme", "light");
    expect(mainInternals.getUserThemeSelection()).toBe("light");
});

test(`getUserThemeSelection should return "dark" when user had previously selected "dark"`, () => {
    localStorage.setItem("theme", "dark");
    expect(mainInternals.getUserThemeSelection()).toBe("dark");
});

test(`getUserThemeSelection should return "auto" when user had previously selected "auto"`, () => {
    localStorage.setItem("theme", "auto");
    expect(mainInternals.getUserThemeSelection()).toBe("auto");
});

/**
 * NOTE: jsdom doesn't seem to support `beginElement()` function on SVG `animate` element.
 *  See https://github.com/jsdom/jsdom/issues/3344
 *  and https://github.com/jsdom/jsdom/issues/2647
 *  and https://stackoverflow.com/q/44173754/8583692
 *  We had ho mock the implementation of some functions to prevent error.
 *
 * We cannot mock an internal function of a module with Jest.
 * Instead, we used babel rewire plugin
 * (or rewire-test-env-only plugin so the minified file is not bloated
 * see https://www.npmjs.com/package/babel-plugin-rewire-test-env-only).
 * See https://stackoverflow.com/q/51269431/8583692
 * and https://stackoverflow.com/q/51900413/8583692
 * and https://github.com/speedskater/babel-plugin-rewire
 * and https://github.com/jhnns/rewire/issues/136#issuecomment-380829197
 * and https://www.npmtrends.com/babel-plugin-rewire-vs-mock-require-vs-proxyquire-vs-rewire
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
    main.__Rewire__("animateThemeButtonIconToDark", () => {});
    localStorage.setItem("theme", "light");
    mainInternals.toggleTheme();
    expect(mainInternals.getUserThemeSelection()).toBe("dark");
});

test(`When user theme is dark, toggleTheme should update the theme to auto`, () => {
    main.__Rewire__("animateThemeButtonIconToAuto", () => {});
    localStorage.setItem("theme", "dark");
    mainInternals.toggleTheme();
    expect(mainInternals.getUserThemeSelection()).toBe("auto");
});

test(`When user theme is auto, toggleTheme should update the theme to light`, () => {
    main.__Rewire__("animateThemeButtonIconToLight", () => {});
    localStorage.setItem("theme", "auto");
    mainInternals.toggleTheme();
    expect(mainInternals.getUserThemeSelection()).toBe("light");
});

describe("Screenshot tests", () => {
    // Increase the timeout of executing all the test suit from
    // the default 5000 to a greater value to run fine on CI
    // Also, set the timeout per test for each individual test
    // See https://github.com/facebook/jest/issues/5055
    jest.setTimeout(100_000);

    // See https://stackoverflow.com/a/53299842/8583692
    // Consider Selenium as an alternative to Puppeteer.
    // Selenium doesn't seem to support screenshot testing feature.
    // See https://stackoverflow.com/q/22938045/8583692
    test(`When user stored theme is light, the icon should be sun`, async () => {
        const screenshot = await takeScreenshot(() => {localStorage.setItem("theme", "light");});
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is dark, the icon should be moon`, async () => {
        const screenshot = await takeScreenshot(() => {localStorage.setItem("theme", "dark");});
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is auto, the icon should be auto`, async () => {
        const screenshot = await takeScreenshot(() => {localStorage.setItem("theme", "auto");});
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is light, clicking the switch should change the icon to moon`, async () => {
        const screenshot = await takeScreenshot(
            () => {localStorage.setItem("theme", "light");},
            (page, element) => {element.click();}
        );
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is dark, clicking the switch should change the icon to auto`, async () => {
        const screenshot = await takeScreenshot(
            () => {localStorage.setItem("theme", "dark");},
            (page, element) => {element.click();}
        );
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is auto, clicking the switch should change the icon to light`, async () => {
        const screenshot = await takeScreenshot(
            () => {localStorage.setItem("theme", "auto");},
            (page, element) => {element.click();}
        );
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user specifies a custom color for switch icon, the colors should be applied`, async () => {
        const screenshot = await takeScreenshot(
            () => {localStorage.setItem("theme", "light");},
            (page, element) => {
                // See https://stackoverflow.com/a/64487791/8583692
                element.evaluate((el) => {
                    el.style.setProperty("--theme-switch-icon-color", "#ffe36e");
                });
            }
        );
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user specifies a custom color for switch icon in a CSS rule with low specificity (like html{}), the colors should be applied`, async () => {
        const screenshot = await takeScreenshot(
            () => {localStorage.setItem("theme", "light");},
            () => {},
            "test2.html"
        );
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    // Make the element able to be hidden (with CSS property display: none)
    // See https://developers.google.com/web/fundamentals/web-components/best-practices
    // and https://stackoverflow.com/q/47144187/8583692
    test(`When user specifies hidden attribute on the element, element should be hidden`, async () => {
        const action = async () => {
            await takeScreenshot(() => {}, () => {}, "test3.html");
        };
        await expect(action).rejects.toThrowError("Node is either not visible or not an HTMLElement");
    }, 100_000);

    afterAll(() => {fileSystem.rmSync(snapshotFileName);});
});

async function takeScreenshot(
    init,
    action = () => {},
    pageHTML = "test1.html",
    targetElementSelector = "theme-switch"
) {
    const browser = await puppeteer.launch({
            headless: true, // If false, opens the browser UI
            // channel: "chrome", // this overrides executablePath
            // Download the required version from https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Win_x64
            // OR C:\\your_workspace\\node_modules\\puppeteer\\.local-chromium\\win64-(version)\\chrome-win\\chrome.exe
            executablePath: chromiumPath
        }
    );

    const page = await browser.newPage();
    // See https://stackoverflow.com/a/66530593/8583692
    await page.evaluateOnNewDocument(init);
    // page.setContent("<DOCTYPE html><html>...")
    await page.goto(`file://${__dirname}\\${pageHTML}`);

    const element = await page.$(targetElementSelector);
    await action(page, element);
    // Wait for the action or element animation to finish
    await page.waitForTimeout(600);

    try {
        return await element.screenshot({ path: snapshotFileName });
    } finally {
        // NOTE: This call should be in finally block so if taking screenshot
        //  threw any error then the browser is closed no matter what to avoid
        //  the tests not being finished (running forever)
        await browser.close();
    }
}

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
            dispatchEvent: jest.fn()
        }))
    });
}
