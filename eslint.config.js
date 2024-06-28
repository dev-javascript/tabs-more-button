const prettier = require('eslint-plugin-prettier');
const globals = require('globals');
const babelParser = require('@babel/eslint-parser');
const path = require('path');
const {fileURLToPath} = require('url');
const js = require('@eslint/js');
const {FlatCompat} = require('@eslint/eslintrc');

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
// Fix TypeError Key "languageOptions": Key "globals": Global "AudioWorkletGlobalScope " has leading or trailing whitespace.
const GLOBALS_BROWSER_FIX = Object.assign({}, globals.browser, {
  AudioWorkletGlobalScope: globals.browser['AudioWorkletGlobalScope '],
});
delete GLOBALS_BROWSER_FIX['AudioWorkletGlobalScope '];

module.exports = [
  ...compat.extends('eslint:recommended', 'plugin:prettier/recommended'),
  {
    plugins: {
      prettier,
    },

    languageOptions: {
      globals: {
        ...GLOBALS_BROWSER_FIX,
        ...globals.node,
        ...globals.jest,
      },

      parser: babelParser,
      ecmaVersion: 12,
      sourceType: 'commonjs',

      parserOptions: {
        ecmaFeatures: {
          //jsx: true,
        },

        allowImportExportEverywhere: false,
      },
    },

    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
];
