import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    rules: js.configs.recommended.rules,
    plugins: {
      prettier,
    },
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
