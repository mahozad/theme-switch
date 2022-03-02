const {JSDOM} = require("jsdom");
const puppeteer = require("puppeteer-core");
const fileSystem = require('fs');
// See https://stackoverflow.com/a/48952855/8583692
const {configureToMatchImageSnapshot: configureSnapshots} = require("jest-image-snapshot");
const toMatchReferenceSnapshot = configureSnapshots({
    customSnapshotsDir: "snapshots/",
    customDiffDir: "snapshot-diffs/",
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
const {chromiumPath} = require("./local.json");

expect.extend({ toMatchReferenceSnapshot });

// TODO: Also test for the following cases:
//  - No <theme-switch> element
//  - Duplicate <theme-switch> elements
// See https://github.com/chaijs/type-detect/issues/98
// See https://stackoverflow.com/a/51702674/8583692
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
    {url: "http://localhost"}
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
    main.toggleTheme();
    expect(main.getUserThemeSelection()).toBe("dark");
});

test(`When user theme is dark, toggleTheme should update the theme to auto`, () => {
    main.__Rewire__("animateThemeButtonIconToAuto", () => {});
    localStorage.setItem("theme", "dark");
    main.toggleTheme();
    expect(main.getUserThemeSelection()).toBe("auto");
});

test(`When user theme is auto, toggleTheme should update the theme to light`, () => {
    main.__Rewire__("animateThemeButtonIconToLight", () => {});
    localStorage.setItem("theme", "auto");
    main.toggleTheme();
    expect(main.getUserThemeSelection()).toBe("light");
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
        await takeScreenshot(() => {localStorage.setItem("theme", "light");});
        const snapshotTakenNow = fileSystem.readFileSync(snapshotFileName);
        expect(snapshotTakenNow).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is dark, the icon should be moon`, async () => {
        await takeScreenshot(() => {localStorage.setItem("theme", "dark");});
        const snapshotTakenNow = fileSystem.readFileSync(snapshotFileName);
        expect(snapshotTakenNow).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is auto, the icon should be auto`, async () => {
        await takeScreenshot(() => {localStorage.setItem("theme", "auto");});
        const snapshotTakenNow = fileSystem.readFileSync(snapshotFileName);
        expect(snapshotTakenNow).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is light, clicking the switch should change the icon to moon`, async () => {
        await takeScreenshot(
            () => {localStorage.setItem("theme", "light");},
            element => {element.click();}
        );
        const snapshotTakenNow = fileSystem.readFileSync(snapshotFileName);
        expect(snapshotTakenNow).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is dark, clicking the switch should change the icon to auto`, async () => {
        await takeScreenshot(
            () => {localStorage.setItem("theme", "dark");},
            element => {element.click();}
        );
        const snapshotTakenNow = fileSystem.readFileSync(snapshotFileName);
        expect(snapshotTakenNow).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is auto, clicking the switch should change the icon to light`, async () => {
        await takeScreenshot(
            () => {localStorage.setItem("theme", "auto");},
            element => {element.click();}
        );
        const snapshotTakenNow = fileSystem.readFileSync(snapshotFileName);
        expect(snapshotTakenNow).toMatchReferenceSnapshot();
    }, 100_000);

    afterAll(() => {fileSystem.rmSync(snapshotFileName);});
});

async function takeScreenshot(init, action = () => {}) {
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
    await page.goto(`file://${__dirname}\\test.html`);

    const element = await page.$("theme-switch");
    await action(element);
    // Wait for the element animation to finish
    await page.waitForTimeout(1000);

    await element.screenshot({path: snapshotFileName});
    await browser.close();
}

// console.log(`\u001B[32m✔️\u001B[39m Tests passed`);

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
