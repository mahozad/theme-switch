import highlightJs from "https://unpkg.com/@highlightjs/cdn-assets@11.7.0/es/highlight.min.js";

document.querySelectorAll("code")
    .forEach(element => {
        highlightJs.highlightElement(element);
    });
