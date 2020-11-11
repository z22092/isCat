module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "eol-last": 0,
        "indent": ["warn", 4],
        "new-cap": "warn",
        "comma-dangle": ["error", {
            "arrays": "never",
            "objects": "never",
            "imports": "never",
            "exports": "never",
            "functions": "ignore"
        }],
        "brace-style":  "off",
        "padded-blocks": "off",
        "linebreak-style": "off",
        "strict": "off",
        "no-unused-vars": "warn",
        "quotes": "off",
        "semi": [ "warn", "always" ],
        "eqeqeq": [ "error", "smart" ],
        "max-len": ["warn", 1000],
        "object-curly-spacing": "off",
        "no-nested-ternary": 1,
        "no-empty": "error",
        "no-constant-condition": "error",
        "curly": ["warn", "multi-line"],
        "keyword-spacing": "off",
        "spaced-comment": ["warn", "always"],
        "space-before-function-paren": "off",
        "space-before-blocks": ["warn", "always"],
        "array-bracket-spacing": "off",
        "block-spacing": ["error"],
        "no-console": [
            "error", { "allow": ["warn", "error", "log", "time"] }
        ]
    }
};