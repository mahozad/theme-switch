import { terser } from "rollup-plugin-terser";

export default {
    input: "theme=switch.js",
    output: [
        {
            file: "dist/theme-switch.js",
            format: "cjs"
        },
        {
            file: "dist/theme-switch.min.js",
            format: "iife",
            name: "themeSwitch",
            plugins: [terser()]
        }
    ]
};
