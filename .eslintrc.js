const path = require('path');

module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "jest": true,
    },
    "settings": {
        "import/resolver": {
            node: {
                paths: [path.resolve(__dirname, './src')],
            },
        },
    },
    "extends": "airbnb",
    "rules": {
        "func-names": ["error", "never"],
        "max-len": ["error", {"code": 180, "ignoreTemplateLiterals": true, "ignoreStrings": true}],
        "no-mixed-operators": ["error", {
            "allowSamePrecedence": true
        }],
        // "space-after-keywords": ["error", "never"],
        "indent": [2, 2, {"SwitchCase": 1}],
        "radix": 0,
        // "indent": 0,
        'no-plusplus': 0,
        'jsx-a11y/no-noninteractive-element-interactions': 0,
        "no-nested-ternary": 0,
        "no-unused-expressions": ["error", { "allowShortCircuit": true }],
        "no-underscore-dangle": 0,
        "no-shadow": 1,
        "import/named": ["error"],
        "jsx-a11y/anchor-is-valid": ["warn", {
            "components": ["Link"],
            "specialLink": ["to"],
        }],
        "react/no-array-index-key": 1,
        "react/require-default-props": 0,
        "react/prop-types": 0,
        "react/forbid-prop-types": 0,
        'import/no-extraneous-dependencies': [
            "error",
            {
                devDependencies: [
                    '.storybook/**',
                    'src/stories/**'
                ]
            }
        ]
    }
};
