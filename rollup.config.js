import { terser } from "rollup-plugin-terser";

export default {
    input: "theme=switch.js",
    output: [
        {
            file: "dist/theme-switch.js",
            /* amd, cjs, es, iife, umd, system */
            format: "cjs",
            strict: true,
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
    ]
};
