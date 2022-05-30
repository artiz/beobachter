/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

const ColorsList = [
    "slate",
    "gray",
    "zinc",
    "stone",
    "red",
    "orange",
    "amber",
    "yellow",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "purple",
    "pink",
    "rose",
];

const content =
    ColorsList.map((c) =>
        [100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => [`bg-${c}-${n}`, `border-${c}-${n}`, `text-${c}-${n}`])
    )
        .flat(2)
        .map((x) => [`active:${x}`, `hover:${x}`, `${x}`])
        .flat(2)
        .join("\n") + "\n";

const filepath = path.join(__dirname, "..", "src", "ui", "colors.tailwind");
fs.writeFile(filepath, content, (err) => {
    if (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to write colors", err);
    }
});
