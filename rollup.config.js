import { terser } from "rollup-plugin-terser";
/* TODO: Use html-minifier-terser instead */
import { minify } from "html-minifier";
import replace from "@rollup/plugin-replace";
import CleanCSS from "clean-css";
import fileSystem from "fs";

export default {
    input: "src/main.js",
    output: [
        {
            file: "dist/theme-switch.js",
            /* amd, cjs, es, iife, umd, system */
            format: "cjs",
            strict: true
        },
        {
            file: "dist/theme-switch.min.js",
            format: "iife",
            validate: true,
            /*
             * "hidden" works like true except that the corresponding
             * sourcemap comments in the bundled files are suppressed.
             */
            sourcemap: true,
            /*
             * The global variable name representing your bundle.
             * Other scripts on the same page can use this
             * variable name to access the exports of our bundle.
             */
            name: "themeSwitch",
            plugins: [terser()]
        }
    ],
    plugins: [
        /* Could instead use rollup-plugin-html but produced low-quality code */
        replace({
            "ICON_TEMPLATE": readHTML("src/icon.html"),
            "STYLES_TEMPLATE": readCSS("src/styles.css")
        })
    ]
};

function readHTML(file) {
    const raw = fileSystem.readFileSync(file, { encoding: "utf-8" });
    return minify(raw, {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        collapseBooleanAttributes: true
    });
}

function readCSS(file) {
    const raw = fileSystem.readFileSync(file, { encoding: "utf-8" });
    return new CleanCSS().minify(raw).styles;
}
