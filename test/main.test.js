/**
 * This docblock is required to configure jest environment to jsdom.
 * See https://jestjs.io/docs/configuration#testenvironment-string
 *
 * Another way would be to manually setting up jsdom.
 * See testing-with-jsdom git branch that does it that way.
 *
 * @jest-environment jsdom
 */

const puppeteer = require("puppeteer-core");
const fileSystem = require("fs");
// See https://stackoverflow.com/a/48952855/8583692
const { configureToMatchImageSnapshot: configureSnapshots } = require("jest-image-snapshot");
const toMatchReferenceSnapshot = configureSnapshots({
    customSnapshotsDir: "test/screenshots/",
    customDiffDir: "test/screenshots-diff/"
});
const snapshotFileName = "test/temp-screenshot.png";
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
setSystemThemeTo("light");
const main = require("../dist/theme-switch");
// See documentations of one of tests about these (called rewiring)
// (Could have instead exported the functions in theme-switch.js)
const ELEMENT_NAME = main.__get__("ELEMENT_NAME");
const CUSTOM_EVENT_NAME = main.__get__("CUSTOM_EVENT_NAME");
const THEME_KEY = main.__get__("THEME_KEY");
const THEME_AUTO = main.__get__("THEME_AUTO");
const THEME_DARK = main.__get__("THEME_DARK");
const THEME_LIGHT = main.__get__("THEME_LIGHT");
const THEME_DEFAULT = main.__get__("THEME_DEFAULT");
const THEME_ATTRIBUTE = main.__get__("THEME_ATTRIBUTE");
const updateTheme = main.__get__("updateTheme");
const getSystemTheme = main.__get__("getSystemTheme");
const themeSwitchClass = main.__get__("ThemeSwitchElement");
const getUserThemeSelection = main.__get__("getUserThemeSelection");
const getInitialStateForIcon = main.__get__("getInitialStateForIcon");

test(`When system theme is light, getSystemTheme should return "light"`, () => {
    setSystemThemeTo(THEME_LIGHT);
    expect(getSystemTheme()).toBe(THEME_LIGHT);
});

test(`When system theme is dark, getSystemTheme should return "dark"`, () => {
    setSystemThemeTo(THEME_DARK);
    expect(getSystemTheme()).toBe(THEME_DARK);
});

test(`For first-time users, getUserThemeSelection should return the default theme`, () => {
    localStorage.clear();
    expect(getUserThemeSelection()).toBe(THEME_DEFAULT);
});

test(`For first-time users, getUserThemeSelection should return the default theme irrespective of the system theme`, () => {
    localStorage.clear();
    setSystemThemeTo(THEME_DARK);
    expect(getUserThemeSelection()).toBe(THEME_DEFAULT);
});

test(`getUserThemeSelection should return "light" when user had previously selected "light"`, () => {
    localStorage.setItem(THEME_KEY, THEME_LIGHT);
    expect(getUserThemeSelection()).toBe(THEME_LIGHT);
});

test(`getUserThemeSelection should return "dark" when user had previously selected "dark"`, () => {
    localStorage.setItem(THEME_KEY, THEME_DARK);
    expect(getUserThemeSelection()).toBe(THEME_DARK);
});

test(`getUserThemeSelection should return "auto" when user had previously selected "auto"`, () => {
    localStorage.setItem(THEME_KEY, THEME_AUTO);
    expect(getUserThemeSelection()).toBe(THEME_AUTO);
});

test(`getUserThemeSelection should return the default theme when the value stored is corrupted`, () => {
    localStorage.setItem(THEME_KEY, "sanitizer");
    expect(getUserThemeSelection()).toBe(THEME_DEFAULT);
});

/**
 * NOTE: jsdom doesn't seem to support `beginElement()` function on SVG `animate` element.
 *  See https://github.com/jsdom/jsdom/issues/3344
 *  and https://github.com/jsdom/jsdom/issues/2647
 *  and https://stackoverflow.com/q/44173754/8583692
 *  We had ho mock the implementation of some functions to prevent error.
 *
 * To mock instance method of a class, override the class prototype with new implementation of the method.
 * See https://github.com/speedskater/babel-plugin-rewire/issues/45
 * and https://stackoverflow.com/q/29151528
 * Maybe we can use `call` function to alter the `this` for a method if that is something helpful.
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
 *
 * To mock an internal function of a module (we cannot mock them with Jest),
 * we can use babel rewire plugin
 * (or rewire-test-env-only plugin so the minified file is not bloated
 * see https://www.npmjs.com/package/babel-plugin-rewire-test-env-only).
 * See https://stackoverflow.com/q/51269431/8583692
 * and https://stackoverflow.com/q/51900413/8583692
 * and https://github.com/speedskater/babel-plugin-rewire
 * and https://github.com/jhnns/rewire/issues/136#issuecomment-380829197
 * and https://www.npmtrends.com/babel-plugin-rewire-vs-mock-require-vs-proxyquire-vs-rewire
 *
 * To mock a regular (global) function, we could have used any of these approaches:
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
    themeSwitchClass.prototype.animateThemeButtonIconToDark = () => {};
    const instance = new themeSwitchClass();
    instance.toggleTheme(THEME_LIGHT);
    expect(getUserThemeSelection()).toBe(THEME_DARK);
});

test(`When user theme is dark, toggleTheme should update the theme to auto`, () => {
    themeSwitchClass.prototype.animateThemeButtonIconToAuto = () => {};
    const instance = new themeSwitchClass();
    instance.toggleTheme(THEME_DARK);
    expect(getUserThemeSelection()).toBe(THEME_AUTO);
});

test(`When user theme is auto, toggleTheme should update the theme to light`, () => {
    themeSwitchClass.prototype.animateThemeButtonIconToLight = () => {};
    const instance = new themeSwitchClass();
    instance.toggleTheme(THEME_AUTO);
    expect(getUserThemeSelection()).toBe(THEME_LIGHT);
});

test(`When user selected theme is light, updateTheme should update document theme attribute to "light"`, () => {
    main.__set__("getUserThemeSelection", () => THEME_LIGHT);
    updateTheme();
    const result = document.documentElement.getAttribute(THEME_ATTRIBUTE);
    expect(result).toBe(THEME_LIGHT);
});

test(`When user selected theme is dark, updateTheme should update document theme attribute to "dark"`, () => {
    main.__set__("getUserThemeSelection", () => THEME_DARK);
    updateTheme();
    const result = document.documentElement.getAttribute(THEME_ATTRIBUTE);
    expect(result).toBe(THEME_DARK);
});

test(`When user selected theme is auto and system theme is light, updateTheme should update document theme attribute to "light"`, () => {
    main.__set__("getUserThemeSelection", () => THEME_AUTO);
    main.__set__("getSystemTheme", () => THEME_LIGHT);
    updateTheme();
    const result = document.documentElement.getAttribute(THEME_ATTRIBUTE);
    expect(result).toBe(THEME_LIGHT);
});

test(`When user selected theme is auto and system theme is dark, updateTheme should update document theme attribute to "dark"`, () => {
    main.__set__("getUserThemeSelection", () => THEME_AUTO);
    main.__set__("getSystemTheme", () => THEME_DARK);
    updateTheme();
    const result = document.documentElement.getAttribute(THEME_ATTRIBUTE);
    expect(result).toBe(THEME_DARK);
});

test(`When user selected theme is light, getInitialStateForIcon should return correct values`, () => {
    main.__set__("getUserThemeSelection", () => THEME_LIGHT);
    expect(getInitialStateForIcon()).toEqual([5, 1, 33, 1]);
});

test(`When user selected theme is dark, getInitialStateForIcon should return correct values`, () => {
    main.__set__("getUserThemeSelection", () => THEME_DARK);
    expect(getInitialStateForIcon()).toEqual([10, 0, 20, 1]);
});

test(`When user selected theme is auto, getInitialStateForIcon should return correct values`, () => {
    main.__set__("getUserThemeSelection", () => THEME_AUTO);
    expect(getInitialStateForIcon()).toEqual([10, 0, 33, 0]);
});

test(`When current theme is light and new theme is dark, createEvent should create event with proper details`, () => {
    const instance = new themeSwitchClass();
    const result = instance.createEvent(THEME_LIGHT, THEME_DARK);
    expect(result.detail.originId).toBe(instance.identifier);
    expect(result.detail.oldState).toBe(THEME_LIGHT);
    expect(result.detail.newState).toBe(THEME_DARK);
});

test(`When current theme is dark and new theme is auto, createEvent should create event with proper details`, () => {
    const instance = new themeSwitchClass();
    const result = instance.createEvent(THEME_DARK, THEME_AUTO);
    expect(result.detail.originId).toBe(instance.identifier);
    expect(result.detail.oldState).toBe(THEME_DARK);
    expect(result.detail.newState).toBe(THEME_AUTO);
});

test(`When current theme is auto and new theme is light, createEvent should create event with proper details`, () => {
    const instance = new themeSwitchClass();
    const result = instance.createEvent(THEME_AUTO, THEME_LIGHT);
    expect(result.detail.originId).toBe(instance.identifier);
    expect(result.detail.oldState).toBe(THEME_AUTO);
    expect(result.detail.newState).toBe(THEME_LIGHT);
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
        const screenshot = await takeScreenshot(() => { localStorage.setItem(THEME_KEY, THEME_LIGHT); });
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is dark, the icon should be moon`, async () => {
        const screenshot = await takeScreenshot(() => { localStorage.setItem("theme", "dark"); });
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is auto, the icon should be auto`, async () => {
        const screenshot = await takeScreenshot(() => { localStorage.setItem("theme", "auto"); });
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is light, clicking the switch should change the icon to moon`, async () => {
        const screenshot = await takeScreenshot(
            () => { localStorage.setItem(THEME_KEY, THEME_LIGHT); },
            (page, element) => { element.click(); }
        );
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is dark, clicking the switch should change the icon to auto`, async () => {
        const screenshot = await takeScreenshot(
            () => { localStorage.setItem("theme", "dark"); },
            (page, element) => { element.click(); }
        );
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user stored theme is auto, clicking the switch should change the icon to light`, async () => {
        const screenshot = await takeScreenshot(
            () => { localStorage.setItem("theme", "auto"); },
            (page, element) => { element.click(); }
        );
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user specifies a custom color for switch icon, the colors should be applied`, async () => {
        const screenshot = await takeScreenshot(
            () => { localStorage.setItem(THEME_KEY, THEME_LIGHT); },
            (page, element) => {
                // See https://stackoverflow.com/a/64487791/8583692
                element.evaluate(element => {
                    element.style.setProperty("--theme-switch-icon-color", "#ffe36e");
                });
            }
        );
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When user specifies a custom color for switch icon in a CSS rule with low specificity (like html{}), the colors should be applied`, async () => {
        const screenshot = await takeScreenshot(
            () => { localStorage.setItem(THEME_KEY, THEME_LIGHT); },
            () => {},
            "template-2.html"
        );
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    // Make the element able to be hidden (with CSS property display: none)
    // See https://developers.google.com/web/fundamentals/web-components/best-practices
    // and https://stackoverflow.com/q/47144187/8583692
    test(`When user specifies hidden attribute on the element, element should be hidden`, async () => {
        const action = async () => {
            await takeScreenshot(() => {}, () => {}, "template-3.html");
        };
        await expect(action).rejects.toThrowError("Node is either not visible or not an HTMLElement");
    }, 100_000);

    test(`When there are multiple instances of the element in page and one of them is toggled, others should be toggled too`, async () => {
        const screenshot = await takeScreenshot(
            () => { localStorage.setItem(THEME_KEY, THEME_LIGHT); },
            async page => {
                (await page.$("#theme-switch-2")).click();
                await page.waitForTimeout(600);
                (await page.$("#theme-switch-3")).click();
            },
            "template-4.html",
            "#container"
        );
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When there are no instances of the element in page, everything should be fine (no errors should be thrown etc.)`, async () => {
        const screenshot = await takeScreenshot(
            () => { localStorage.setItem(THEME_KEY, THEME_LIGHT); },
            () => {},
            "template-5.html",
            "#example"
        );
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`When no size is specified for the element, it should have default size`, async () => {
        const screenshot = await takeScreenshot(() => {}, () => {}, "template-6.html");
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    test(`The minified version of the script should also work`, async () => {
        const screenshot = await takeScreenshot(() => {
            localStorage.setItem("theme", "auto");
        }, async (page, element) => {
            await element.click();
            await page.waitForTimeout(600);
            await element.click();
        }, "template-7.html");
        expect(screenshot).toMatchReferenceSnapshot();
    }, 100_000);

    // See https://stackoverflow.com/q/47107465/8583692
    // and https://github.com/puppeteer/puppeteer/blob/main/examples/custom-event.js
    test(`When the switch is toggled, it should trigger a "themeToggle" event`, async () => {
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const result = await Promise.race([new Promise(async resolve => {
            // Define a window.myListener function on the page
            await page.exposeFunction("myListener", event => {
                // resolve the outer Promise here, so we can await it outside
                resolve(event);
            });
            await addListener(page, CUSTOM_EVENT_NAME);
            await page.goto(`file://${__dirname}\\template-1.html`);
            const element = await page.$(ELEMENT_NAME);
            await element.click();
        }), page.waitForTimeout(10_000)]);
        try {
            expect(result.type).toBe(CUSTOM_EVENT_NAME);
        } catch (error) {
            throw new Error(`${error}\nThe error may also have happened because of the timeout, meaning the event was not triggered`);
            // OR  fail("..."); // See https://github.com/facebook/jest/issues/11698
        } finally {
            await page.waitForTimeout(1_000); // To fix a problem for CI
            await browser.close();
        }
    }, 100_000);

    test(`When the switch is toggled, its event should contain its old and new state`, async () => {
        localStorage.setItem(THEME_KEY, THEME_LIGHT);
        const browser = await launchBrowser();
        const page = await browser.newPage();
        const result = await Promise.race([new Promise(async resolve => {
            await page.exposeFunction("myListener", event => resolve(event));
            await addListener(page, CUSTOM_EVENT_NAME);
            await page.goto(`file://${__dirname}\\template-1.html`);
            const element = await page.$(ELEMENT_NAME);
            await element.click();
        }), page.waitForTimeout(10_000)]);
        try {
            expect(result.detail.oldState).toBe(THEME_LIGHT);
            expect(result.detail.newState).toBe(THEME_DARK);
        } catch (error) {
            throw new Error(`${error}\nThe error may also have happened because of the timeout, meaning the event was not triggered`);
        } finally {
            await page.waitForTimeout(1_000); // To fix a problem for CI
            await browser.close();
        }
    }, 100_000);

    // FIXME: the code is mostly duplicate of the takeScreenshot function
    test(`When a switch in another open page is toggled, switches in this page should be updated`, async () => {
        localStorage.setItem("theme", "light");
        const browser = await launchBrowser();
        const page1 = await browser.newPage();
        const page2 = await browser.newPage();
        await page1.goto(`file://${__dirname}\\template-1.html`);
        await page2.goto(`file://${__dirname}\\template-4.html`);
        const page1Switch = await page1.$(ELEMENT_NAME);
        await page1Switch.click();
        await page1.waitForTimeout(600);
        const page2Switches = await page2.$("#container");
        try {
            const screenshot = await page2Switches.screenshot({ path: snapshotFileName });
            expect(screenshot).toMatchReferenceSnapshot();
        } finally {
            await browser.close();
        }
    }, 100_000);

    test(`When a switch in another open page is toggled, document theme attribute in this page should be updated`, async () => {
        localStorage.setItem("theme", "light");
        const browser = await launchBrowser();
        const page1 = await browser.newPage();
        const page2 = await browser.newPage();
        await page1.goto(`file://${__dirname}\\template-1.html`);
        await page2.goto(`file://${__dirname}\\template-4.html`);
        const page1Switch = await page1.$(ELEMENT_NAME);
        await page1Switch.click();
        await page1.waitForTimeout(600);
        try {
            const attributeValue = await page2.evaluate(() => {
                return document.documentElement.getAttribute("data-theme");
            });
            expect(attributeValue).toBe("dark");
        } finally {
            await browser.close();
        }
    });

    afterAll(() => { fileSystem.rmSync(snapshotFileName); });
});

function addListener(page, eventType) {
    return page.evaluateOnNewDocument(type => {
        document.addEventListener(type, event => {
            window.myListener({ type, detail: event.detail });
        });
    }, eventType);
}

async function takeScreenshot(
    init,
    action = () => {},
    pageHTML = "template-1.html",
    targetElementSelector = ELEMENT_NAME
) {
    const browser = await launchBrowser();
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

/**
 * Setting `channel: "chrome"` overrides `executablePath`.
 * Download the required version of chrome from
 * https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Win_x64
 *
 * Puppeteer seems to download chrome in this directory:
 * C:\\your_workspace\\node_modules\\puppeteer\\.local-chromium\\win64-(version)\\chrome-win\\chrome.exe
 *
 * If headless is set to false, opens the browser UI.
 *
 * @returns {Promise<Browser>}
 */
function launchBrowser() {
    return puppeteer.launch({
        headless: true,
        executablePath: chromiumPath
    });
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
