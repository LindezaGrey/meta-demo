module.exports = {
    root: true,
    env: {
        node: true,
    },
    plugins: [
        "@typescript-eslint",
        "prettier"
      ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/camelcase": "off",
    },
};
