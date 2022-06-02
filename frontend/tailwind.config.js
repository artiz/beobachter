module.exports = {
    mode: "jit",
    content: ["./src/**/*.{js,jsx,ts,tsx,tailwind}"],
    theme: {
        extend: {
            zIndex: {
                100: "100",
            },
        },
    },
    plugins: [],
};
