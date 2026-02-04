import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    rules: js.configs.recommended.rules,
  },
  ...tseslint.configs.recommended,
];
