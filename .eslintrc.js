module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:node/recommended',
    // 'lingui'
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-var-requires": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/no-namespace": "warn",
    "@typescript-eslint/no-this-alias": "warn",
    "@typescript-eslint/no-inferrable-types": "warn",
    "node/no-unsupported-features/es-syntax": "off",
  },
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['**/*.js', 'dist', '**/*.d.ts', '**/*/test.ts']
};
