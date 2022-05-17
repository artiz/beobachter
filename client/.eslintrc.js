module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["plugin:react/recommended", "plugin:@typescript-eslint/recommended", "airbnb"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
        "no-use-before-define": "off",
        "no-any": true,
        "react/jsx-filename-extension": ["warn", { extensions: [".tsx"] }],
        "import/extensions": ["never", "ignorePackages"],
        "import/ignore": [],
    },
};
