/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

const Widths = ["w-1/6", "w-1/4", "w-1/3", "w-1/2", "w-2/3", "w-3/4", "w-full"];
const Breakpoints = ["", "sm", "md", "lg", "xl", "2xl"];
const content =
    Widths.map((w) => Breakpoints.map((br) => [`${br}${br && ":"}${w}`]))
        .flat()
        .join("\n") + "\n";

const filepath = path.join(__dirname, "..", "src", "ui", "widths.tailwind");
fs.writeFile(filepath, content, (err) => {
    if (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to write colors", err);
    }
});
