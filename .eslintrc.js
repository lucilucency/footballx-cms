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
    "max-len": ["error", { "code": 180, "ignoreTemplateLiterals": true, "ignoreStrings": true }],
    "no-mixed-operators": ["error", {
      "allowSamePrecedence": true
    }],
    "radix": 0,
    "no-shadow": 1,
    "import/named": ["error"],
    "jsx-a11y/anchor-is-valid": ["warn", {
      "components": ["Link"],
      "specialLink": ["to"],
    }],
    "react/no-array-index-key": 1,
    "react/require-default-props": 0,
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
